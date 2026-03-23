import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { db } from "@/lib/db";
import { whispers } from "@/lib/schema";
import { eq, or, and } from "drizzle-orm";
import { WHISPER_DURATION_MS } from "@/app/_constants";
import { pusherServer } from "@/lib/pusher";

type RouteParams = { params: Promise<{ id: string }> };

export const PUT = async (request: NextRequest, { params }: RouteParams) => {
    const { userId } = await auth();
    if (!userId) {
        return NextResponse.json({ error: "Sign in required." }, { status: 401 });
    }

    const { id } = await params;
    const whisperId = Number(id);
    const body = await request.json();
    const { action } = body as { action: "accept" | "decline" | "extend" | "accept-extension" | "decline-extension" };

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
            if (whisper.extensionStatus) {
                return NextResponse.json({ error: "An extension has already been requested." }, { status: 400 });
            }
            const [extended] = await db
                .update(whispers)
                .set({ extensionStatus: "PENDING", extensionRequestedById: userId, updatedAt: new Date() })
                .where(eq(whispers.id, whisperId))
                .returning();
            await pusherServer.trigger(`whisper-${whisperId}`, "extension-update", {
                extensionStatus: "PENDING",
                extensionRequestedById: userId,
            });
            return NextResponse.json(extended);
        }
        case "accept-extension": {
            if (whisper.extensionStatus !== "PENDING") {
                return NextResponse.json({ error: "No pending extension request." }, { status: 400 });
            }
            if (whisper.extensionRequestedById === userId) {
                return NextResponse.json({ error: "You can't accept your own extension request." }, { status: 400 });
            }
            const [accepted] = await db
                .update(whispers)
                .set({ extensionStatus: "ACCEPTED", expiresAt: new Date(Date.now() + WHISPER_DURATION_MS), updatedAt: new Date() })
                .where(eq(whispers.id, whisperId))
                .returning();
            await pusherServer.trigger(`whisper-${whisperId}`, "extension-update", {
                extensionStatus: "ACCEPTED",
                extensionRequestedById: whisper.extensionRequestedById,
                expiresAt: accepted.expiresAt,
            });
            return NextResponse.json(accepted);
        }
        case "decline-extension": {
            if (whisper.extensionStatus !== "PENDING") {
                return NextResponse.json({ error: "No pending extension request." }, { status: 400 });
            }
            if (whisper.extensionRequestedById === userId) {
                return NextResponse.json({ error: "You can't decline your own extension request." }, { status: 400 });
            }
            const [declined] = await db
                .update(whispers)
                .set({ extensionStatus: "DECLINED", updatedAt: new Date() })
                .where(eq(whispers.id, whisperId))
                .returning();
            await pusherServer.trigger(`whisper-${whisperId}`, "extension-update", {
                extensionStatus: "DECLINED",
                extensionRequestedById: whisper.extensionRequestedById,
            });
            return NextResponse.json(declined);
        }
        default:
            return NextResponse.json({ error: "Invalid action." }, { status: 400 });
    }
};
