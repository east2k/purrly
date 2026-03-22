import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { db } from "@/lib/db";
import { whispers } from "@/lib/schema";
import { eq, or, and, desc } from "drizzle-orm";

export const GET = async () => {
    const { userId } = await auth();
    if (!userId) {
        return NextResponse.json({ error: "Sign in to use whispers." }, { status: 401 });
    }

    const rows = await db.query.whispers.findMany({
        where: or(
            eq(whispers.participantOneId, userId),
            eq(whispers.participantTwoId, userId),
        ),
        with: {
            participantOne: { columns: { displayId: true } },
            participantTwo: { columns: { displayId: true } },
            messages: { orderBy: (m, { desc }) => [desc(m.createdAt)], limit: 1 },
        },
        orderBy: [desc(whispers.updatedAt)],
    });

    return NextResponse.json(rows);
};

export const POST = async (request: NextRequest) => {
    const { userId } = await auth();
    if (!userId) {
        return NextResponse.json({ error: "Sign in to send whisper requests." }, { status: 401 });
    }

    const body = await request.json();
    const { targetUserId, revealId } = body as { targetUserId: string; revealId: boolean };

    if (!targetUserId || targetUserId === userId) {
        return NextResponse.json({ error: "Invalid whisper target." }, { status: 400 });
    }

    const existingWhisper = await db.query.whispers.findFirst({
        where: and(
            or(
                and(eq(whispers.participantOneId, userId), eq(whispers.participantTwoId, targetUserId)),
                and(eq(whispers.participantOneId, targetUserId), eq(whispers.participantTwoId, userId)),
            ),
            or(eq(whispers.status, "PENDING"), eq(whispers.status, "ACTIVE")),
        ),
    });

    if (existingWhisper) {
        return NextResponse.json({ error: "You already have an active whisper with this person." }, { status: 409 });
    }

    const [newWhisper] = await db
        .insert(whispers)
        .values({
            participantOneId: userId,
            participantTwoId: targetUserId,
            status: "PENDING",
            requestedById: userId,
            requestedByRevealId: revealId ?? false,
        })
        .returning();

    return NextResponse.json(newWhisper, { status: 201 });
};
