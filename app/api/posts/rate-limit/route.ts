import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { db } from "@/lib/db";
import { anonRateLimits } from "@/lib/schema";
import { and, eq } from "drizzle-orm";

export const GET = async (request: NextRequest) => {
    const { userId } = await auth();
    if (userId) return NextResponse.json({ count: 0 });

    const ip =
        request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
        request.headers.get("x-real-ip") ??
        "unknown";
    const today = new Date().toISOString().slice(0, 10);

    const row = await db.query.anonRateLimits.findFirst({
        where: and(eq(anonRateLimits.ip, ip), eq(anonRateLimits.date, today)),
        columns: { count: true },
    });

    return NextResponse.json({ count: row?.count ?? 0 });
};
