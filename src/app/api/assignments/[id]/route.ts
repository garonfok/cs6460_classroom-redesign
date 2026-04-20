import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(_req: NextRequest, ctx: RouteContext<'/api/assignments/[id]'>) {
  const { id } = await ctx.params;

  console.log("Fetching assignment with id:", id);

  const assignment = await prisma.assignment.findFirst({
    where: {
      id,
    }
  })

  if (assignment === null) {
    return NextResponse.json({ error: "Assignment not found" }, {
      status: 404
    });
  }

  return NextResponse.json(assignment, {
    status: 200
  })
}
