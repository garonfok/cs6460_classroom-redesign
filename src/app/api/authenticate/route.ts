import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { faker } from "@faker-js/faker";

export async function POST(req: NextRequest) {
  const { fullName, password } = await req.json();

  const user = await prisma.user.create({
    data: {
      name: fullName,
      isTeacher: false,
    },
  });

  const assignments = await prisma.assignment.findMany();

  await Promise.all(assignments.map(async (assignment) => {
    if (assignment.dateDue > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)) {
      return;
    }
    await prisma.userAssignmentGrade.create({
      data: {
        userId: user.id,
        assignmentId: assignment.id,
        points: faker.number.int({ min: 1, max: 4 }),
        comments: "This is a computer-generated comment on the grade for this assignment. The actual grade is also computer-generated, and is not based on any real work submitted."
      },
    });
  }));

  const response = NextResponse.json({ message: "Authenticated" }, { status: 200 });

  response.cookies.set("access_password", password, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 60 * 60 * 24,
  });

  response.cookies.set("full_name", fullName, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 60 * 60 * 24,
  });

  response.cookies.set("user_id", user.id, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 60 * 60 * 24,
  });

  return response;
}

export async function GET(req: NextRequest) {
  const cookies = req.cookies;
  const userId = cookies.get("user_id")?.value;
  const fullName = cookies.get("full_name")?.value;

  return NextResponse.json({ id: userId, fullName }, { status: 200 });
}
