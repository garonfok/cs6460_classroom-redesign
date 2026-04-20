import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest, ctx: RouteContext<'/api/announcements/[id]/seen'>) {
  const { id: announcementId } = await ctx.params;
  const { value: userId } = req.cookies.get("user_id")!;

  const comment = await prisma.userAnnouncementSeen.create({
    data: {
      announcementId,
      userId,
    },
  });

  return NextResponse.json(comment, {
    status: 201
  });
}
