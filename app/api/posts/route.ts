import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { db } from "@/lib/db";
import { posts, users } from "@/lib/schema";
import { desc, eq, isNull, isNotNull, sql, and, gte, lte } from "drizzle-orm";

export const GET = async (request: NextRequest) => {
    const { searchParams } = request.nextUrl;
    const limit = Math.min(Number(searchParams.get("limit") ?? 20), 50);
    const offset = Number(searchParams.get("offset") ?? 0);
    const from = searchParams.get("from");
    const to = searchParams.get("to");
    const sort = searchParams.get("sort") ?? "recent";
    const authorOnly = searchParams.get("mine") === "true";
    const hiddenOnly = searchParams.get("hidden") === "true";

    const { userId } = await auth();

    const conditions = hiddenOnly && userId
        ? [isNotNull(posts.deletedAt), eq(posts.authorId, userId)]
        : [isNull(posts.deletedAt)];

    if (!hiddenOnly) {
        if (from) conditions.push(gte(posts.createdAt, new Date(Number(from))));
        if (to) conditions.push(lte(posts.createdAt, new Date(Number(to))));
        if (authorOnly && userId) conditions.push(eq(posts.authorId, userId));
    }

    const postRows = await db
        .select({
            id: posts.id,
            text: posts.text,
            mood: posts.mood,
            commentsEnabled: posts.commentsEnabled,
            hideIdentity: posts.hideIdentity,
            authorId: posts.authorId,
            authorDisplayId: users.displayId,
            createdAt: posts.createdAt,
            hugCount: sql<number>`(SELECT count(*) FROM reactions WHERE reactions.post_id = ${posts.id} AND reactions.type = 'HUG')`,
            huggedByMe: userId
                ? sql<boolean>`EXISTS (SELECT 1 FROM reactions WHERE reactions.post_id = ${posts.id} AND reactions.type = 'HUG' AND reactions.author_id = ${userId})`
                : sql<boolean>`false`,
            commentCount: sql<number>`(SELECT count(*) FROM comments WHERE comments.post_id = ${posts.id} AND comments.deleted_at IS NULL)`,
            reportCount: sql<number>`(SELECT count(*) FROM reports WHERE reports.content_type = 'POST' AND reports.content_id = ${posts.id})`,
            deletedAt: posts.deletedAt,
        })
        .from(posts)
        .leftJoin(users, eq(posts.authorId, users.id))
        .where(and(...conditions))
        .orderBy(
            sort === "mostHugged"
                ? desc(sql`(SELECT count(*) FROM reactions WHERE reactions.post_id = ${posts.id})`)
                : desc(posts.createdAt),
        )
        .limit(limit)
        .offset(offset);

    return NextResponse.json(postRows);
};

export const POST = async (request: NextRequest) => {
    const { userId } = await auth();
    const body = await request.json();

    const { text: postText, mood, commentsEnabled, hideIdentity } = body as {
        text: string;
        mood: string | null;
        commentsEnabled: boolean;
        hideIdentity: boolean;
    };

    if (!postText?.trim()) {
        return NextResponse.json({ error: "Post text is required." }, { status: 400 });
    }

    if (postText.trim().length > 2000) {
        return NextResponse.json({ error: "Post is too long." }, { status: 400 });
    }

    const [newPost] = await db
        .insert(posts)
        .values({
            text: postText.trim(),
            mood: mood ?? null,
            commentsEnabled: commentsEnabled ?? true,
            hideIdentity: userId ? (hideIdentity ?? true) : true,
            authorId: userId ?? null,
        })
        .returning();

    let authorDisplayId: string | null = null;
    if (userId) {
        const user = await db.query.users.findFirst({
            where: eq(users.id, userId),
            columns: { displayId: true },
        });
        authorDisplayId = user?.displayId ?? null;
    }

    return NextResponse.json({
        ...newPost,
        authorDisplayId,
        hugCount: 0,
        huggedByMe: false,
        commentCount: 0,
        reportCount: 0,
        deletedAt: null,
    }, { status: 201 });
};
