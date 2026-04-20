import { FormattedGrade } from "@/app/types/types";
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const userId = req.cookies.get("user_id")?.value;

  const rawGrades = await prisma.userAssignmentGrade.findMany({
    where: {
      userId,
    },
    include: {
      assignment: true,
      UserAssignmentGradeSeen: {
        where: {
          userId,
        },
        take: 1,
      }
    },
    orderBy: {
      assignment: {
        dateDue: "desc",
      }
    }
  });

  const formattedGrades: FormattedGrade[] = rawGrades.map((grade) => ({
    id: grade.assignmentId,
    title: grade.assignment.title,
    description: grade.assignment.description,
    dateDue: grade.assignment.dateDue,
    points: grade.points,
    pointsPossible: grade.assignment.pointsPossible,
    comments: grade.comments,
    seen: grade.UserAssignmentGradeSeen.length > 0,
  }));

  return NextResponse.json(formattedGrades, {
    status: 200,
  });
}
