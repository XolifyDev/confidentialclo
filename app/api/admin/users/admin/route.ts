import { prisma } from "@/lib/db";
import { NextApiRequest } from "next";
import { getSession, useSession } from "next-auth/react";
import { headers } from "next/headers";
import { NextResponse } from "next/server";

export async function GET(req: NextApiRequest) {
  const id = headers().get("id");
  let session = headers().get("session");
  if (session) {
    session = JSON.parse(session);
  }
  if (!id)
    return NextResponse.json({
      error: { message: "All parameters must be passed." },
    });
  if (session?.status === "unauthenticated")
    return NextResponse.json({
      error: { message: "You need to be logged in!" },
    });

  await prisma.user.update({
    where: {
      id,
    },
    data: {
      isAdmin: true,
    },
  });
  return NextResponse.json({
    done: true,
  });
}
