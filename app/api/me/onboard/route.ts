import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { db } from "@/lib/db";
import { users } from "@/lib/schema";
import { eq } from "drizzle-orm";
import { ensureUser } from "@/lib/ensureUser";

export const POST = async () => {
    const { userId } = await auth();
    if (!userId) return NextResponse.json({ error: "Unauthorized." }, { status: 401 });

    await ensureUser(userId);
    await db.update(users).set({ onboardedAt: new Date() }).where(eq(users.id, userId));

    return NextResponse.json({ ok: true });
};
