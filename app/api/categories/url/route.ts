import { prisma } from "@/lib/db";
import { headers } from "next/headers";
import { NextResponse } from "next/server";

export const dynamic = 'force-dynamic'

export async function GET() {
  const url = headers().get("url");
  console.log(url);

  if (!url) return NextResponse.json({ error: true });

  const category = await prisma.categories.findFirst({
    where: {
      url,
    },
  });
  if (!category)
    return NextResponse.json({
      error: {
        message: "Invalid Category",
      },
    });
  console.log(category);
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
