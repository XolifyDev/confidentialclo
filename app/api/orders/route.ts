import { prisma } from "@/lib/db";
import { Orders, User } from "@prisma/client";
import { NextResponse } from "next/server";

interface OrderNewInterface extends Orders {
  user: User;
}

export async function GET() {
  let orders: OrderNewInterface[] = [];

  const odb = await prisma.orders.findMany();
  for (let i = 0; i < odb.length; i++) {
    const e = odb[i];
    const user = await prisma.user.findFirst({
      where: {
        id: e.userId,
      },
    });

    orders.push({
      ...e,
      user: user!,
    });
  }

  return NextResponse.json({
    orders,
  });
}
