import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { db } from "@/lib/db";
import { reports } from "@/lib/schema";

export const POST = async (request: NextRequest) => {
    const { userId } = await auth();
    const body = await request.json();

    const { contentType, contentId, reason } = body as {
        contentType: "POST" | "COMMENT" | "WHISPER_MESSAGE";
        contentId: number;
        reason: string;
    };

    if (!contentType || !contentId || !reason?.trim()) {
        return NextResponse.json({ error: "All fields are required." }, { status: 400 });
    }

    const [report] = await db
        .insert(reports)
        .values({
            reporterId: userId ?? null,
            contentType,
            contentId,
            reason: reason.trim(),
        })
        .returning();

    return NextResponse.json(report, { status: 201 });
};
