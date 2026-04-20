import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(_req: NextRequest, ctx: RouteContext<'/api/materials/[assignmentName]'>) {
  const { assignmentName } = await ctx.params;

  const materials = await prisma.material.findMany({
    where: {
      category: assignmentName
    }
  })

  return NextResponse.json(materials, {
    status: 200
  })
}
