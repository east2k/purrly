import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { db } from "@/lib/db";
import { dailyCheckIns } from "@/lib/schema";
import { eq, and, desc, sql } from "drizzle-orm";

const getTodayDate = () => new Date().toISOString().split("T")[0];

export const GET = async () => {
    const { userId } = await auth();
    if (!userId) {
        return NextResponse.json({ error: "Sign in to track self-care." }, { status: 401 });
    }

    const today = getTodayDate();
    const checkIn = await db.query.dailyCheckIns.findFirst({
        where: and(eq(dailyCheckIns.userId, userId), eq(dailyCheckIns.date, today)),
    });

    const recentCheckIns = await db
        .select({ date: dailyCheckIns.date })
        .from(dailyCheckIns)
        .where(eq(dailyCheckIns.userId, userId))
        .orderBy(desc(dailyCheckIns.date))
        .limit(30);

    let streak = 0;
    const dates = recentCheckIns.map((c) => c.date);
    const current = new Date();
    for (let i = 0; i < 30; i++) {
        const dateStr = new Date(current.getTime() - i * 86400000).toISOString().split("T")[0];
        if (dates.includes(dateStr)) {
            streak++;
        } else if (i > 0) {
            break;
        }
    }

    return NextResponse.json({
        water: checkIn?.water ?? 0,
        sleep: checkIn?.sleep ?? 0,
        streak,
    });
};

export const PUT = async (request: NextRequest) => {
    const { userId } = await auth();
    if (!userId) {
        return NextResponse.json({ error: "Sign in to track self-care." }, { status: 401 });
    }

    const body = await request.json();
    const { water, sleep } = body as { water?: number; sleep?: number };
    const today = getTodayDate();

    const existing = await db.query.dailyCheckIns.findFirst({
        where: and(eq(dailyCheckIns.userId, userId), eq(dailyCheckIns.date, today)),
    });

    if (existing) {
        const [updated] = await db
            .update(dailyCheckIns)
            .set({
                water: water ?? existing.water,
                sleep: sleep ?? existing.sleep,
                updatedAt: new Date(),
            })
            .where(eq(dailyCheckIns.id, existing.id))
            .returning();
        return NextResponse.json(updated);
    }

    const [created] = await db
        .insert(dailyCheckIns)
        .values({
            userId,
            date: today,
            water: water ?? 0,
            sleep: sleep ?? 0,
        })
        .returning();

    return NextResponse.json(created, { status: 201 });
};
