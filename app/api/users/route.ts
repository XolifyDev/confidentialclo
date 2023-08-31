import { prisma } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    users: await prisma.user.findMany(),
  });
}
