import { prisma } from "@/lib/db";
import { headers } from "next/headers";
import { NextResponse } from "next/server";

export async function GET() {
  const url = headers().get("url");

  if (!url) return NextResponse.json({ error: true });
  // console.log(url);
  const product = await prisma.products.findFirst({
    where: {
      url,
    },
  });
  console.log(product);
  return NextResponse.json({
    product,
  });
}
