import { prisma } from "@/lib/db";
import { headers } from "next/headers";
import { NextResponse } from "next/server";

export async function GET() {
  const url = headers().get("url");

  if (!url) return NextResponse.json({ error: true });

  return NextResponse.json({
    ...(await prisma.products.findFirst({
      where: {
        url,
      },
    })),
  });
}
