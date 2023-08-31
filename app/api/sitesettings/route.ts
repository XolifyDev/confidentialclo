import { prisma } from "@/lib/db";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET() {
  const products = await prisma.products.findMany();
  const categories = await prisma.categories.findMany();
  console.log(products, categories);
  return NextResponse.json({
    ...(await prisma.siteSettings.findFirst()),
    products,
    categories,
    promoCodes: await prisma.promoCodes.findMany(),
  });
}
