import { prisma } from "@/lib/db";
import { NextResponse } from "next/server";
import dayjs from "dayjs";

export const dynamic = "force-dynamic";

function getMonthName(monthNumber: number) {
  const date = new Date("July 20, 69 00:20:18");
  date.setMonth(monthNumber);

  return date.toLocaleString("en-US", { month: "short" });
}

export async function GET() {
  let data = [];
  var month = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  console.log(getMonthName(1));
  for (let i = 0; i < 12; i++) {
    console.log(i);
    const isMonthAndYear = await prisma.analytics.findFirst({
      where: {
        month: `${i}`,
        year: `${new Date().getFullYear()}`,
      },
    });
    if (isMonthAndYear) {
      data.push({
        name: getMonthName(i),
        total: isMonthAndYear.amount,
      });
    } else {
      data.push({
        name: getMonthName(i),
        total: 0,
      });
    }
  }

  return NextResponse.json({
    data,
  });
}
