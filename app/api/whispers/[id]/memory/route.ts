import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { db } from "@/lib/db";
import { whisperMemories, whispers } from "@/lib/schema";
import { eq, or, and } from "drizzle-orm";

type RouteParams = { params: Promise<{ id: string }> };

export const POST = async (_request: NextRequest, { params }: RouteParams) => {
    const { userId } = await auth();
    if (!userId) {
        return NextResponse.json({ error: "Sign in required." }, { status: 401 });
    }

    const { id } = await params;
    const whisperId = Number(id);

    const whisper = await db.query.whispers.findFirst({
        where: and(
            eq(whispers.id, whisperId),
            or(eq(whispers.participantOneId, userId), eq(whispers.participantTwoId, userId)),
        ),
    });

    if (!whisper) {
        return NextResponse.json({ error: "Whisper not found." }, { status: 404 });
    }

    if (whisper.status !== "EXPIRED") {
        return NextResponse.json({ error: "Only expired whispers can be saved to memory." }, { status: 400 });
    }

    const existing = await db.query.whisperMemories.findFirst({
        where: and(eq(whisperMemories.whisperId, whisperId), eq(whisperMemories.userId, userId)),
    });

    if (existing) {
        return NextResponse.json({ error: "Already saved to memory." }, { status: 409 });
    }

    const [memory] = await db
        .insert(whisperMemories)
        .values({ whisperId, userId })
        .returning();

    return NextResponse.json(memory, { status: 201 });
};
