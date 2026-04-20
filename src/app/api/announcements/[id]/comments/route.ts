import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest, ctx: RouteContext<'/api/announcements/[id]/comments'>) {
  const { id: announcementId } = await ctx.params;
  const { value: userId } = req.cookies.get("user_id")!;

  const { content }: { content: string } = await req.json();

  const comment = await prisma.announcementComment.create({
    data: {
      content,
      announcementId,
      authorId: userId,
    },
  });

  return NextResponse.json(comment, {
    status: 201
  });
}
