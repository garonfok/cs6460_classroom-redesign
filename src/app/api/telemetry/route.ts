import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { InputJsonValue } from "@/generated/prisma/internal/prismaNamespace";

export async function POST(req: NextRequest) {
  try {
    console.log("Attempting telemetry handle request")
    const { event, data }: { event: string, data: unknown } = await req.json();
    console.log("Destructured payload: ", event, data)


    await prisma.telemetryEvent.create({
      data: {
        eventType: event,
        payload: data as InputJsonValue
      }
    })

    return NextResponse.json({ status: 200 })
  } catch {
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 })
  }
}
