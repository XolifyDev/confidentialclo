import { prisma } from "@/lib/db";
import { headers } from "next/headers";
import { NextResponse } from "next/server";

export async function GET() {
  const url = headers().get("url");

  if (!url) return NextResponse.json({ error: true });

  const category = await prisma.categories.findFirst({
    where: {
      url,
    },
  });
  return NextResponse.json({
    category,
    products: await prisma.products.findMany({
      where: {
        categories: {
          has: category?.name,
        },
      },
    }),
  });
}
