import { supabase } from "../../../../lib/supabase";
import requestIp from "request-ip";
import { NextApiRequest, NextApiResponse } from "next";
import { NextRequest, NextResponse } from "next/server";
import { rateLimiterMiddleware } from "../../../../lib/rate-limiter";
import { Readable } from "stream";
import { prisma } from "@/lib/db";
import bcrypt from "bcrypt";
import getCurrentUser from "@/lib/actions/getCurrentUser";
import { uniqueId } from "lodash";
import Stripe from "stripe";
import { config as config1 } from "@/config";
export const config = {
  bodyParser: true,
};
export const runtime = "nodejs";

export async function GET(req: NextRequest) {
  return NextResponse.json({ message: "Hello World" });
}

// @ts-ignore
const stripe = new Stripe(config1.stripe.clientSecret, {
  apiVersion: "2022-11-15",
});

async function getRawBody(readable: Readable): Promise<Buffer> {
  const chunks = [];
  for await (const chunk of readable) {
    // @ts-ignore
    chunks.push(typeof chunk === "string" ? Buffer.from(chunk) : chunk);
  }
  return Buffer.concat(chunks);
}

export async function POST(req: NextApiRequest) {
  const requestUrl = new URL(req.url!);
  const ip = requestIp.getClientIp(req);
  if (!rateLimiterMiddleware(ip!)) {
    return NextResponse.json(
      { error: { message: "Rate limit exceeded" } },
      { status: 429 }
    );
  }
  const user = await getCurrentUser();

  if (!user?.id || !user?.email) {
    return NextResponse.json({
      error: { message: "You need to be logged in to do this action." },
    });
  }
  // try {
  const rawData = await getRawBody(req.body);
  const body = JSON.parse(Buffer.from(rawData).toString("utf8"));
  const { lineItems: items } = body;
  console.log(body);
  if (!items.length) {
    console.log("bad reuqest");
    return NextResponse.json({ error: "Bad Request" });
  }

  const session = await stripe.checkout.sessions
    .create({
      line_items: items,
      mode: "payment",
      success_url: `${req.headers.origin}/checkout/success?sessionId={CHECKOUT_SESSION_ID}`,
    })
    .catch((e) => console.log(e, "EROEROEROEOREOREOROEROEROERO"));
  console.log(session, "SESSION");
  return NextResponse.json({ session });
  // } catch (error) {
  //   if (error)
  //     return NextResponse.json({
  //       error: {
  //         message: error.message || "Error",
  //       },
  //     });
  // }
}
