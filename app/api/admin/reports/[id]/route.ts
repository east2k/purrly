import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { db } from "@/lib/db";
import { reports } from "@/lib/schema";
import { eq } from "drizzle-orm";

type RouteParams = { params: Promise<{ id: string }> };

const isAdmin = async () => {
    const { sessionClaims } = await auth();
    return (sessionClaims?.metadata as { role?: string } | undefined)?.role === "admin";
};

export const PUT = async (request: NextRequest, { params }: RouteParams) => {
    if (!await isAdmin()) return NextResponse.json({ error: "Forbidden." }, { status: 403 });

    const { id } = await params;
    const { status } = await request.json() as { status: "REVIEWED" | "ACTIONED" };

    const [updated] = await db
        .update(reports)
        .set({ status })
        .where(eq(reports.id, Number(id)))
        .returning();

    return NextResponse.json(updated);
};
