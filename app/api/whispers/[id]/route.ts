import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { db } from "@/lib/db";
import { whispers } from "@/lib/schema";
import { eq, or, and } from "drizzle-orm";
import { WHISPER_DURATION_MS } from "@/app/_constants";

type RouteParams = { params: Promise<{ id: string }> };

export const PUT = async (request: NextRequest, { params }: RouteParams) => {
    const { userId } = await auth();
    if (!userId) {
        return NextResponse.json({ error: "Sign in required." }, { status: 401 });
    }

    const { id } = await params;
    const whisperId = Number(id);
    const body = await request.json();
    const { action } = body as { action: "accept" | "decline" | "extend" };

    const whisper = await db.query.whispers.findFirst({
        where: and(
            eq(whispers.id, whisperId),
            or(eq(whispers.participantOneId, userId), eq(whispers.participantTwoId, userId)),
        ),
    });

    if (!whisper) {
        return NextResponse.json({ error: "Whisper not found." }, { status: 404 });
    }

    switch (action) {
        case "accept": {
            if (whisper.status !== "PENDING") {
                return NextResponse.json({ error: "Whisper is not pending." }, { status: 400 });
            }
            if (whisper.requestedById === userId) {
                return NextResponse.json({ error: "You can't accept your own request." }, { status: 400 });
            }
            const [updated] = await db
                .update(whispers)
                .set({
                    status: "ACTIVE",
                    expiresAt: new Date(Date.now() + WHISPER_DURATION_MS),
                    updatedAt: new Date(),
                })
                .where(eq(whispers.id, whisperId))
                .returning();
            return NextResponse.json(updated);
        }
        case "decline": {
            if (whisper.status !== "PENDING") {
                return NextResponse.json({ error: "Whisper is not pending." }, { status: 400 });
            }
            const [updated] = await db
                .update(whispers)
                .set({ status: "EXPIRED", updatedAt: new Date() })
                .where(eq(whispers.id, whisperId))
                .returning();
            return NextResponse.json(updated);
        }
        case "extend": {
            if (whisper.status !== "ACTIVE") {
                return NextResponse.json({ error: "Whisper is not active." }, { status: 400 });
            }
            if (whisper.extended) {
                return NextResponse.json({ error: "This whisper has already been extended." }, { status: 400 });
            }
            const [updated] = await db
                .update(whispers)
                .set({
                    expiresAt: new Date(Date.now() + WHISPER_DURATION_MS),
                    extended: true,
                    updatedAt: new Date(),
                })
                .where(eq(whispers.id, whisperId))
                .returning();
            return NextResponse.json(updated);
        }
        default:
            return NextResponse.json({ error: "Invalid action." }, { status: 400 });
    }
};
