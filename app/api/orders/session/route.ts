import { prisma } from "@/lib/db";
import { headers } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: any) {
  const id = headers().get("id");

  if (!id) return NextResponse.json({ error: true });
  return NextResponse.json({
    ...(await prisma.orders.findFirst({
      where: {
        sessionId: id,
      },
      include: {
        user: true,
      },
    })),
  });
}
