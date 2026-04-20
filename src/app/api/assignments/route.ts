import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  const assignments = await prisma.assignment.findMany({
    orderBy: {
      dateDue: "desc",
    },
  });

  return NextResponse.json(assignments, {
    status: 200,
  });
}
