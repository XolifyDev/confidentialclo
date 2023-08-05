import { supabase } from "../../../../lib/supabase"
import requestIp from 'request-ip'
import { NextApiRequest, NextApiResponse } from "next";
import { NextRequest, NextResponse } from "next/server";
import { rateLimiterMiddleware } from '../../../../lib/rate-limiter';
import { Readable } from "stream";
import { prisma } from "@/lib/db";
import bcrypt from "bcrypt";
import getCurrentUser from "@/lib/actions/getCurrentUser";
import { uniqueId } from "lodash";

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
    const user = await getCurrentUser();

    if (!user?.id || !user?.email) {
        return NextResponse.json({ error: { message: "You need to be logged in to do this action." }});
    }
    if(!user.isAdmin) return NextResponse.json({ error: { message: "You are not an admin! 🤡" }});
    const rawData = await getRawBody(req.body);
    const body = JSON.parse(Buffer.from(rawData).toString('utf8'))
    const { name, description, url, sizes, mainImage, images, price } = body;
    // console.log(body);
    if (!name || !description || !url || !sizes || !mainImage || !images || !price) return NextResponse.json({ error: { message: "All inputs msut be filled out." } });


    const urlSearch = await prisma.products.findFirst({
        where: {
            url
        }
    });

    if (urlSearch) return NextResponse.json({ error: { message: "Product Url is already in use" } });
    // console.log(images.split(","), sizes.split(","));
    let imageId = uniqueId();
    const mainImageUpload = await supabase.storage.from("images").upload(`/products/${imageId}.png`, mainImage);
    const mainImageSrc = await supabase.storage.from("images").getPublicUrl(`/products/${imageId}.png`);
    const newProduct = await prisma.products.create({
        data: {
            description,
            mainImage: mainImageSrc.data.publicUrl!,
            name,
            price,
            url,
            gallery: images.split(","),
            sizes: sizes.split(",")
        }
    })

    if (newProduct) {
        return NextResponse.json({ product: newProduct });
    } else {
        return NextResponse.json({ error: { message: "Error occured when creating product. Please try again!" } });
    }
}