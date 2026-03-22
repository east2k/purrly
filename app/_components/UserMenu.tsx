"use client";

import { useState, useEffect } from "react";
import { useClerk, useUser } from "@clerk/nextjs";

const UserMenu = () => {
    const { signOut } = useClerk();
    const { isSignedIn } = useUser();
    const [displayId, setDisplayId] = useState<string | null>(null);

    useEffect(() => {
        if (!isSignedIn) return;
        let cancelled = false;
        const run = async () => {
            const res = await fetch("/api/me");
            if (!res.ok || cancelled) return;
            const data: { displayId: string | null } = await res.json();
            setDisplayId(data.displayId);
        };
        run();
        return () => { cancelled = true; };
    }, [isSignedIn]);

    return (
        <div className="flex flex-col items-end gap-2.5">
            <span className="text-xs font-medium text-sand-600">
                Purrlynonymous{displayId ? `-${displayId}` : ""}
            </span>
            <button
                onClick={() => signOut({ redirectUrl: "/" })}
                className="text-xs font-medium text-sand-400 hover:text-terracotta-400 transition-colors cursor-pointer font-body"
            >
                Sign out
            </button>
        </div>
    );
};

export default UserMenu;
