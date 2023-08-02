import { supabase } from "../../../../lib/supabase"
import requestIp from 'request-ip'
import { NextApiRequest, NextApiResponse } from "next";
import { NextRequest, NextResponse } from "next/server";
import { rateLimiterMiddleware } from '../../../../lib/rate-limiter';
import { Readable } from "stream";
import { prisma } from "@/lib/db";
import bcrypt from "bcrypt";

export const config = {
    api: {
        bodyParser: true,
    },
};

export async function GET(req: NextRequest) {
    return NextResponse.json({ message: "Hello World" });
}

async function getRawBody(readable: Readable): Promise<Buffer> {
    const chunks = [];
    for await (const chunk of readable) {
        // @ts-ignore
        chunks.push(typeof chunk === 'string' ? Buffer.from(chunk) : chunk);
    }
    return Buffer.concat(chunks);
}

export async function POST(req: NextApiRequest) {
    const requestUrl = new URL(req.url!)
    const ip = requestIp.getClientIp(req);
    if (!rateLimiterMiddleware(ip!)) {
        return NextResponse.json({ error: { message: 'Rate limit exceeded' } }, { status: 429 });
    }
    const rawData = await getRawBody(req.body);
    const body = JSON.parse(Buffer.from(rawData).toString('utf8'))
    const { email, password, username } = body;
    console.log(body)
    if (!email || !username || !password) return NextResponse.json({ error: { message: "All inputs msut be filled out." } })
    if (password.length < 6) {
        return NextResponse.json({
            error: {
                message: "Password length must be more then 6 characters"
            }
        })
    }

    const searchEmailData = await prisma.user.findUnique({ where: { email } });

    if (searchEmailData) {
        return NextResponse.json({
            error: {
                message: "Email already in use."
            }
        })
    }

    const searchUsernameData = await prisma.user.findFirst({
        where: {
            name: username
        }
    })

    if (searchUsernameData) {
        return NextResponse.json({
            error: {
                message: "Username already in use."
            }
        })
    }



    const hashedPassword = await bcrypt.hash(password, 12);

    const user = await prisma.user.create({
        data: {
            email,
            name: username,
            hashedPassword
        }
    })

    return NextResponse.json({user});
}