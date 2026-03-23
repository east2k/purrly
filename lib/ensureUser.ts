import { db } from "@/lib/db";
import { users } from "@/lib/schema";
import { generateDisplayId } from "@/lib/identity";
import { eq } from "drizzle-orm";

export const ensureUser = async (userId: string): Promise<void> => {
    const existing = await db.query.users.findFirst({
        where: eq(users.id, userId),
        columns: { id: true },
    });
    if (existing) return;

    let displayId = generateDisplayId();
    for (let i = 0; i < 10; i++) {
        const taken = await db.query.users.findFirst({
            where: eq(users.displayId, displayId),
            columns: { id: true },
        });
        if (!taken) break;
        displayId = generateDisplayId();
    }

    await db.insert(users).values({ id: userId, displayId }).onConflictDoNothing();
};
