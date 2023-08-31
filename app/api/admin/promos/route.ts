import { config } from "@/config";
import { prisma } from "@/lib/db";
import { NextApiRequest } from "next";
import { NextRequest, NextResponse } from "next/server";
import { Readable } from "stream";
import Stripe from "stripe";

async function getRawBody(readable: Readable): Promise<Buffer> {
  const chunks = [];
  for await (const chunk of readable) {
    // @ts-ignore
    chunks.push(typeof chunk === "string" ? Buffer.from(chunk) : chunk);
  }
  return Buffer.concat(chunks);
}

const stripe = new Stripe(config.stripe.clientSecret, {
  apiVersion: "2022-11-15",
});

export async function POST(req: NextApiRequest) {
  const rawData = await getRawBody(req.body);
  const body = JSON.parse(Buffer.from(rawData).toString("utf8"));
  const { name, discountPercentage } = body;

  if (!name || !discountPercentage)
    return NextResponse.json({
      error: { message: "All inputs need to be filled out" },
    });

  const ifInUse = await prisma.promoCodes.findFirst({
    where: {
      name,
    },
  });
  if (ifInUse) {
    return NextResponse.json({
      error: { message: "Promo name already in use." },
    });
  }
  const promo = await stripe.coupons.create({
    // amount_off: Number(discountPercentage),
    name,
    percent_off: Number(discountPercentage),
  });
  await prisma.promoCodes.create({
    data: {
      discount: discountPercentage,
      name,
      couponId: promo.id,
    },
  });

  return NextResponse.json({
    done: true,
  });
}
