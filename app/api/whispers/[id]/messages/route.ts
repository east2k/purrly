import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { db } from "@/lib/db";
import { whisperMessages, whispers, users } from "@/lib/schema";
import { eq, or, and, desc, lt } from "drizzle-orm";
import { pusherServer } from "@/lib/pusher";
import { ensureUser } from "@/lib/ensureUser";

type RouteParams = { params: Promise<{ id: string }> };

export const GET = async (request: NextRequest, { params }: RouteParams) => {
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

    const { searchParams } = request.nextUrl;
    const limit = Math.min(Number(searchParams.get("limit") ?? 15), 50);
    const before = searchParams.get("before");

    const conditions = before
        ? and(eq(whisperMessages.whisperId, whisperId), lt(whisperMessages.id, Number(before)))
        : eq(whisperMessages.whisperId, whisperId);

    const rows = await db
        .select({
            id: whisperMessages.id,
            senderId: whisperMessages.senderId,
            senderDisplayId: users.displayId,
            text: whisperMessages.text,
            createdAt: whisperMessages.createdAt,
        })
        .from(whisperMessages)
        .leftJoin(users, eq(whisperMessages.senderId, users.id))
        .where(conditions)
        .orderBy(desc(whisperMessages.createdAt))
        .limit(limit);

    return NextResponse.json(rows.reverse());
};

export const POST = async (request: NextRequest, { params }: RouteParams) => {
    const { userId } = await auth();
    if (!userId) {
        return NextResponse.json({ error: "Sign in required." }, { status: 401 });
    }

    await ensureUser(userId);

    const { id } = await params;
    const whisperId = Number(id);
    const body = await request.json();
    const { text } = body as { text: string };

    if (!text?.trim()) {
        return NextResponse.json({ error: "Message text is required." }, { status: 400 });
    }

    const whisper = await db.query.whispers.findFirst({
        where: and(
            eq(whispers.id, whisperId),
            or(eq(whispers.participantOneId, userId), eq(whispers.participantTwoId, userId)),
        ),
    });

    if (!whisper) {
        return NextResponse.json({ error: "Whisper not found." }, { status: 404 });
    }

    if (whisper.status !== "ACTIVE") {
        return NextResponse.json({ error: "This whisper is no longer active." }, { status: 400 });
    }

    if (whisper.expiresAt && whisper.expiresAt.getTime() < Date.now()) {
        await db.update(whispers).set({ status: "EXPIRED", updatedAt: new Date() }).where(eq(whispers.id, whisperId));
        return NextResponse.json({ error: "This whisper has expired." }, { status: 400 });
    }

    const [message] = await db
        .insert(whisperMessages)
        .values({
            whisperId,
            senderId: userId,
            text: text.trim(),
        })
        .returning();

    const user = await db.query.users.findFirst({
        where: eq(users.id, userId),
        columns: { displayId: true },
    });

    const payload = { ...message, senderDisplayId: user?.displayId ?? null };

    await pusherServer.trigger(`whisper-${whisperId}`, "new-message", payload);

    return NextResponse.json(payload, { status: 201 });
};
