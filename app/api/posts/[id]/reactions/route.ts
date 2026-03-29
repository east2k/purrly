import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { db } from "@/lib/db";
import { reactions } from "@/lib/schema";
import { eq, and } from "drizzle-orm";
import { ensureUser } from "@/lib/ensureUser";

type RouteParams = { params: Promise<{ id: string }> };

export const POST = async (_request: NextRequest, { params }: RouteParams) => {
    const { userId } = await auth();

    if (!userId) {
        return NextResponse.json({ error: "Sign in to send hugs." }, { status: 401 });
    }

    await ensureUser(userId);

    const { id } = await params;
    const postId = Number(id);

    const existing = await db
        .select({ id: reactions.id })
        .from(reactions)
        .where(and(eq(reactions.postId, postId), eq(reactions.type, "HUG"), eq(reactions.authorId, userId)))
        .limit(1);

    if (existing.length > 0) {
        await db.delete(reactions).where(eq(reactions.id, existing[0].id));
        return NextResponse.json({ toggled: "removed" });
    }

    await db.insert(reactions).values({
        type: "HUG",
        postId,
        authorId: userId,
        sessionId: null,
    }).onConflictDoNothing();

    return NextResponse.json({ toggled: "added" }, { status: 201 });
};
