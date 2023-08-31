import { prisma } from "@/lib/db";
import { NextApiRequest } from "next";
import { NextRequest, NextResponse } from "next/server";
import { Readable } from "stream";

async function getRawBody(readable: Readable): Promise<Buffer> {
  const chunks = [];
  for await (const chunk of readable) {
    // @ts-ignore
    chunks.push(typeof chunk === "string" ? Buffer.from(chunk) : chunk);
  }
  return Buffer.concat(chunks);
}

export async function POST(req: NextApiRequest) {
  const rawData = await getRawBody(req.body);
  const body = JSON.parse(Buffer.from(rawData).toString("utf8"));
  const { code } = body;

  if (!code)
    return NextResponse.json({
      error: { message: "All inputs need to be filled out" },
    });

  const ifInUse = await prisma.promoCodes.findFirst({
    where: {
      name: code,
    },
  });
  if (ifInUse) {
    return NextResponse.json({
      valid: true,
      discount: ifInUse,
    });
  }
  return NextResponse.json({
    valid: false,
  });
}
