import { FormattedAnnouncement } from "@/app/types/types";
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const userId = req.cookies.get("user_id")?.value;

  const rawAnnouncements = await prisma.announcement.findMany({
    include: {
      author: true,
      comments: {
        include: {
          author: true,
        },
        orderBy: {
          dateCreated: "asc",
        }
      },
      userAnnouncementsSeen: {
        where: {
          userId,
        },
        take: 1,
      }
    },
    orderBy: {
      dateCreated: "desc",
    }
  });

  const formattedAnnouncements: FormattedAnnouncement[] = rawAnnouncements.map((announcement) => ({
    id: announcement.id,
    content: announcement.content,
    author: announcement.author,
    comments: announcement.comments,
    dateCreated: announcement.dateCreated,
    seen: announcement.userAnnouncementsSeen.length > 0,
  }));

  return NextResponse.json(formattedAnnouncements, {
    status: 200,
  });
}

export async function POST(req: NextRequest) {
  const { value: userId } = req.cookies.get("user_id")!;

  const { content }: { content: string } = await req.json();

  const annoucement = await prisma.announcement.create({
    data: {
      content,
      authorId: userId,
    },
  });

  return NextResponse.json(annoucement, {
    status: 201,
  });
}
