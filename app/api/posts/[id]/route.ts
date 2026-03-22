import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { db } from "@/lib/db";
import { posts } from "@/lib/schema";
import { eq, and, isNull, isNotNull } from "drizzle-orm";

type RouteParams = { params: Promise<{ id: string }> };

export const DELETE = async (_request: NextRequest, { params }: RouteParams) => {
    const { userId } = await auth();
    if (!userId) {
        return NextResponse.json({ error: "Sign in required." }, { status: 401 });
    }

    const { id } = await params;
    const postId = Number(id);

    const post = await db.query.posts.findFirst({
        where: and(eq(posts.id, postId), eq(posts.authorId, userId), isNull(posts.deletedAt)),
        columns: { id: true },
    });

    if (!post) {
        return NextResponse.json({ error: "Post not found." }, { status: 404 });
    }

    await db.update(posts).set({ deletedAt: new Date() }).where(eq(posts.id, postId));

    return new NextResponse(null, { status: 204 });
};

export const PATCH = async (_request: NextRequest, { params }: RouteParams) => {
    const { userId } = await auth();
    if (!userId) {
        return NextResponse.json({ error: "Sign in required." }, { status: 401 });
    }

    const { id } = await params;
    const postId = Number(id);

    const post = await db.query.posts.findFirst({
        where: and(eq(posts.id, postId), eq(posts.authorId, userId), isNotNull(posts.deletedAt)),
        columns: { id: true },
    });

    if (!post) {
        return NextResponse.json({ error: "Post not found." }, { status: 404 });
    }

    await db.update(posts).set({ deletedAt: null }).where(eq(posts.id, postId));

    return new NextResponse(null, { status: 204 });
};
