import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { db } from "@/lib/db";
import { reactions } from "@/lib/schema";
import { eq, and, sql } from "drizzle-orm";

type RouteParams = { params: Promise<{ id: string }> };

export const POST = async (request: NextRequest, { params }: RouteParams) => {
    const { userId } = await auth();
    const { id } = await params;
    const postId = Number(id);
    const body = await request.json();
    const { type, sessionId } = body as { type: "HUG" | "ME_TOO"; sessionId?: string };

    if (!type || !["HUG", "ME_TOO"].includes(type)) {
        return NextResponse.json({ error: "Invalid reaction type." }, { status: 400 });
    }

    if (!userId && !sessionId) {
        return NextResponse.json({ error: "Session ID required for anonymous reactions." }, { status: 400 });
    }

    const existingConditions = [eq(reactions.postId, postId), eq(reactions.type, type)];
    if (userId) {
        existingConditions.push(eq(reactions.authorId, userId));
    } else {
        existingConditions.push(eq(reactions.sessionId, sessionId!));
    }

    const existing = await db
        .select({ id: reactions.id })
        .from(reactions)
        .where(and(...existingConditions))
        .limit(1);

    if (existing.length > 0) {
        await db.delete(reactions).where(eq(reactions.id, existing[0].id));
        return NextResponse.json({ toggled: "removed" });
    }

    await db.insert(reactions).values({
        type,
        postId,
        authorId: userId ?? null,
        sessionId: userId ? null : (sessionId ?? null),
    });

    return NextResponse.json({ toggled: "added" }, { status: 201 });
};
