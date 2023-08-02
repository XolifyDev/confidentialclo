import { supabase } from "@/lib/supabase"
import requestIp from 'request-ip'
import { NextApiRequest, NextApiResponse } from "next";
import { NextRequest, NextResponse } from "next/server";
import { rateLimiterMiddleware } from '@/lib/rate-limiter';
import { Readable } from "stream";
import { signIn } from "next-auth/react";
import { prisma } from "@/lib/db";

export const config = {
    api: {
        bodyParser: true,
    },
};

async function getRawBody(readable: Readable): Promise<Buffer> {
    const chunks = [];
    for await (const chunk of readable) {
        chunks.push(typeof chunk === 'string' ? Buffer.from(chunk) : chunk);
    }
    return Buffer.concat(chunks);
}

export async function POST(req: NextApiRequest) {
    const ip = requestIp.getClientIp(req);
    if (!rateLimiterMiddleware(ip!)) {
        return NextResponse.json({ error: { message: 'Rate limit exceeded' } }, { status: 429 });
    }
    const rawData = await getRawBody(req.body);
    const body = JSON.parse(Buffer.from(rawData).toString('utf8'))
    const { email, password } = body;
    if (!email || !password) return NextResponse.json({ error: { message: "All inputs msut be filled out." } })
    if (password.length < 6) {
        return NextResponse.json({
            error: {
                message: "Password length must be more then 6 characters"
            }
        })
    }

    signIn('credentials', {
        ...body
    }).then(async (callback) => {
        if (callback?.error) {
            return NextResponse.json({
                error: {
                    message: callback.error
                }
            })
        }
        if (callback?.ok && !callback?.error) {
            const newData = await prisma.user.findUnique({
                where: {
                    email
                }
            });
            return NextResponse.json({
                user: newData
            })
        }
    })

    // const { data, error } = await supabase.auth.signInWithPassword({
    //     email,
    //     password,
    // });


    // if (error) {
    //     return NextResponse.json({
    //         error: {
    //             message: error.message
    //         }
    //     })
    // }

    // const { data: userData } = await supabase.from("users").select("*").eq("id", data.user.id).single();
    // return NextResponse.json({
    //     user: userData
    // })
}