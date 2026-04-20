import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest, ctx: RouteContext<'/api/grades/[id]/seen'>) {
  const { id: gradeId } = await ctx.params;
  const { value: userId } = req.cookies.get("user_id")!;

  const gradeSeen = await prisma.userAssignmentGradeSeen.create({
    data: {
      assignmentId: gradeId,
      userId,
    },
  });

  return NextResponse.json(gradeSeen, {
    status: 201
  });
}
