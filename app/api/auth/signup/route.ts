import { supabase } from "../../../../lib/supabase"
import requestIp from 'request-ip'
import { NextApiRequest, NextApiResponse } from "next";
import { NextRequest, NextResponse } from "next/server";
import { rateLimiterMiddleware } from '../../../../lib/rate-limiter';
import { Readable } from "stream";

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

    const { data: searchEmailData, error: searchEmailError } = await supabase.from("users").select("*").eq("email", email);

    if (searchEmailError) {
        return NextResponse.json({
            error: {
                message: searchEmailError.message
            }
        })
    }

    if (searchEmailData[0]) {
        return NextResponse.json({
            error: {
                message: "Email already in use."
            }
        })
    }

    const { data: searchUsernameData, error: searchUsernameError } = await supabase.from("users").select("*").eq("name", username);

    if (searchUsernameError) {
        return NextResponse.json({
            error: {
                message: searchUsernameError.message
            }
        })
    }

    if (searchUsernameData[0]) {
        return NextResponse.json({
            error: {
                message: "Username already in use."
            }
        })
    }

    const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
            data: {
                username
            },
            emailRedirectTo: `${requestUrl}/auth/callback`
        }
    })

    if (signUpError) {
        return NextResponse.json({
            error: {
                message: signUpError.message
            }
        })
    }

    const { data: newUserData, error: newUserError } = await supabase.from("users").insert({ id: signUpData.user?.id, email: signUpData.user?.email, name: username, });

    if (!newUserData || newUserError) {
        return NextResponse.json({
            error: {
                message: "Looks like something went wrong. Please try again!"
            }
        })
    }
    console.log(newUserData)
    return NextResponse.redirect(requestUrl.origin, {
        status: 301,
    })
}