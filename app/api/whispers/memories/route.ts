import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { db } from "@/lib/db";
import { whisperMemories } from "@/lib/schema";
import { eq, desc } from "drizzle-orm";

export const GET = async () => {
    const { userId } = await auth();
    if (!userId) {
        return NextResponse.json({ error: "Sign in required." }, { status: 401 });
    }

    const rows = await db.query.whisperMemories.findMany({
        where: eq(whisperMemories.userId, userId),
        with: {
            whisper: {
                with: {
                    participantOne: { columns: { displayId: true } },
                    participantTwo: { columns: { displayId: true } },
                    messages: { orderBy: (m, { desc }) => [desc(m.createdAt)], limit: 1 },
                },
            },
        },
        orderBy: [desc(whisperMemories.savedAt)],
    });

    return NextResponse.json(rows);
};
