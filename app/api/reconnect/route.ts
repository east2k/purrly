import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { db } from "@/lib/db";
import { reconnectRequests, whisperMemories, whispers } from "@/lib/schema";
import { eq, and, or } from "drizzle-orm";

export const POST = async (request: NextRequest) => {
    const { userId } = await auth();
    if (!userId) {
        return NextResponse.json({ error: "Sign in required." }, { status: 401 });
    }

    const body = await request.json();
    const { memoryId } = body as { memoryId: number };

    const memory = await db.query.whisperMemories.findFirst({
        where: and(eq(whisperMemories.id, memoryId), eq(whisperMemories.userId, userId)),
        with: { whisper: true },
    });

    if (!memory) {
        return NextResponse.json({ error: "Memory not found." }, { status: 404 });
    }

    const existingPending = await db.query.reconnectRequests.findFirst({
        where: and(
            eq(reconnectRequests.memoryId, memoryId),
            eq(reconnectRequests.status, "PENDING"),
        ),
    });

    if (existingPending) {
        return NextResponse.json({ error: "A reconnect request is already pending." }, { status: 409 });
    }

    const otherUserId = memory.whisper.participantOneId === userId
        ? memory.whisper.participantTwoId
        : memory.whisper.participantOneId;

    const [reconnect] = await db
        .insert(reconnectRequests)
        .values({
            memoryId,
            requestedById: userId,
            requestedToId: otherUserId,
        })
        .returning();

    return NextResponse.json(reconnect, { status: 201 });
};
