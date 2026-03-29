import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { db } from "@/lib/db";
import { reports, bugReports, whispers } from "@/lib/schema";
import { desc, isNotNull } from "drizzle-orm";

const isAdmin = async () => {
    const { sessionClaims } = await auth();
    return (sessionClaims?.metadata as { role?: string } | undefined)?.role === "admin";
};

export const GET = async () => {
    if (!await isAdmin()) return NextResponse.json({ error: "Forbidden." }, { status: 403 });

    const [contentReports, bugs, userReports] = await Promise.all([
        db.select().from(reports).orderBy(desc(reports.createdAt)).limit(100),
        db.select().from(bugReports).orderBy(desc(bugReports.createdAt)).limit(100),
        db.select({
            id: whispers.id,
            reportedById: whispers.reportedById,
            participantOneId: whispers.participantOneId,
            participantTwoId: whispers.participantTwoId,
            messagingAllowed: whispers.messagingAllowed,
            createdAt: whispers.createdAt,
        }).from(whispers).where(isNotNull(whispers.reportedById)).orderBy(desc(whispers.createdAt)).limit(100),
    ]);

    return NextResponse.json({ contentReports, bugs, userReports });
};
