import { prisma } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    products: await prisma.products.findMany(),
  });
}
