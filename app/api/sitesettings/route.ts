import { prisma } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    ...(await prisma.siteSettings.findFirst()),
    products: await prisma.products.findMany(),
    categories: await prisma.categories.findMany(),
    promoCodes: await prisma.promoCodes.findMany(),
  });
}
