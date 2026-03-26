import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { db } from "@/lib/db";
import { bugReports } from "@/lib/schema";

const CATEGORIES = ["UI Bug", "Performance", "Content", "Feature Request", "Other"];

export const POST = async (request: NextRequest) => {
    const { userId } = await auth();

    const body = await request.json();
    const { category, description } = body as { category: string; description: string };

    if (!category || !CATEGORIES.includes(category)) {
        return NextResponse.json({ error: "Invalid category." }, { status: 400 });
    }
    if (!description || description.trim().length < 5) {
        return NextResponse.json({ error: "Description too short." }, { status: 400 });
    }

    await db.insert(bugReports).values({
        category,
        description: description.trim(),
        userId: userId ?? null,
    });

    return NextResponse.json({ ok: true }, { status: 201 });
};
