import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { db } from "@/lib/db";
import { comments, users, posts } from "@/lib/schema";
import { eq, and, isNull, asc, sql } from "drizzle-orm";
import { ensureUser } from "@/lib/ensureUser";

type RouteParams = { params: Promise<{ id: string }> };

export const GET = async (_request: NextRequest, { params }: RouteParams) => {
    const { id } = await params;
    const postId = Number(id);

    const rows = await db
        .select({
            id: comments.id,
            text: comments.text,
            authorId: comments.authorId,
            authorDisplayId: users.displayId,
            hideIdentity: comments.hideIdentity,
            createdAt: comments.createdAt,
            reportCount: sql<number>`(SELECT count(*) FROM reports WHERE reports.content_type = 'COMMENT' AND reports.content_id = ${comments.id} AND reports.reporter_id IS NOT NULL)`,
        })
        .from(comments)
        .leftJoin(users, eq(comments.authorId, users.id))
        .where(and(eq(comments.postId, postId), isNull(comments.deletedAt)))
        .orderBy(asc(comments.createdAt));

    return NextResponse.json(rows);
};

export const POST = async (request: NextRequest, { params }: RouteParams) => {
    const { userId } = await auth();
    if (!userId) {
        return NextResponse.json({ error: "Sign in to comment." }, { status: 401 });
    }

    const { id } = await params;
    const postId = Number(id);
    const body = await request.json();
    const { text: commentText, hideIdentity } = body as { text: string; hideIdentity: boolean };

    if (!commentText?.trim()) {
        return NextResponse.json({ error: "Comment text is required." }, { status: 400 });
    }

    const post = await db.query.posts.findFirst({
        where: and(eq(posts.id, postId), isNull(posts.deletedAt)),
        columns: { commentsEnabled: true },
    });

    if (!post) {
        return NextResponse.json({ error: "Post not found." }, { status: 404 });
    }
    if (!post.commentsEnabled) {
        return NextResponse.json({ error: "Comments are disabled on this post." }, { status: 403 });
    }

    await ensureUser(userId);

    const [newComment] = await db
        .insert(comments)
        .values({
            text: commentText.trim(),
            postId,
            authorId: userId,
            hideIdentity: hideIdentity ?? true,
        })
        .returning();

    const user = await db.query.users.findFirst({
        where: eq(users.id, userId),
        columns: { displayId: true },
    });

    return NextResponse.json({
        ...newComment,
        authorDisplayId: user?.displayId ?? null,
        reportCount: 0,
    }, { status: 201 });
};
