import { NextRequest, NextResponse } from "next/server";
import { verifyWebhook } from "@clerk/nextjs/webhooks";
import { db } from "@/lib/db";
import { users } from "@/lib/schema";
import { eq } from "drizzle-orm";
import { generateDisplayId } from "@/lib/identity";

export const POST = async (request: NextRequest) => {
    const payload = await verifyWebhook(request);

    const { type } = payload;

    if (type === "user.created") {
        const { id } = payload.data;

        let displayId = generateDisplayId();
        let attempts = 0;
        while (attempts < 10) {
            const existing = await db.query.users.findFirst({
                where: eq(users.displayId, displayId),
            });
            if (!existing) break;
            displayId = generateDisplayId();
            attempts++;
        }

        await db.insert(users).values({
            id,
            displayId,
        });
    }

    if (type === "user.deleted") {
        const { id } = payload.data;
        if (id) {
            await db.update(users).set({ updatedAt: new Date() }).where(eq(users.id, id));
        }
    }

    return NextResponse.json({ received: true });
};
