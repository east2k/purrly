import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { db } from "@/lib/db";
import { users } from "@/lib/schema";
import { eq } from "drizzle-orm";

export const GET = async () => {
    const { userId } = await auth();
    if (!userId) {
        return NextResponse.json({ error: "Sign in required." }, { status: 401 });
    }

    const user = await db.query.users.findFirst({
        where: eq(users.id, userId),
        columns: { displayId: true },
    });

    return NextResponse.json({ displayId: user?.displayId ?? null });
};
