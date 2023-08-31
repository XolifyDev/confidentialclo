import { prisma } from "@/lib/db";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET() {
  const product = await prisma.products.findMany();
  return NextResponse.json({
    products: product,
  });
}
