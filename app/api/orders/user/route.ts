import { prisma } from "@/lib/db";
import { headers } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET(req: any) {
  const id = headers().get("id");

  if (!id) return NextResponse.json({ error: true });
  const orders = await prisma.orders.findMany({
    where: {
      userId: id,
    },
  });
  //   console.log(products);
  return NextResponse.json({
    orders,
  });
}
