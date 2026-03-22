"use client";

import { useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";
import { useIdentityPreference } from "@/app/_context/IdentityPreferenceContext";

const IdentityToggle = () => {
    const { isSignedIn, isLoaded } = useUser();
    const { hideIdentity, updatePreference } = useIdentityPreference();
    const [displayId, setDisplayId] = useState<string | null>(null);

    useEffect(() => {
        if (!isSignedIn) return;
        const fetchId = async () => {
            const res = await fetch("/api/me");
            if (res.ok) {
                const data: { displayId: string | null } = await res.json();
                setDisplayId(data.displayId);
            }
        };
        fetchId();
    }, [isSignedIn]);

    if (!isLoaded || !isSignedIn) return null;

    return (
        <div className="flex items-center justify-between px-4 py-2.5 mb-5 bg-white border border-sand-200 rounded-xl shadow-card">
            <div>
                <p className="text-xs font-medium text-sand-800">Posting as</p>
                <p className="text-xs text-sand-500">
                    {hideIdentity ? "Purrlynonymous" : `Purrlynonymous-${displayId ?? "..."}`}
                </p>
            </div>
            <label className="flex items-center gap-2 cursor-pointer select-none">
                <span className="text-xs text-sand-600 font-medium">
                    {hideIdentity ? "Hidden" : "Visible"}
                </span>
                <button
                    role="switch"
                    aria-checked={!hideIdentity}
                    onClick={() => updatePreference(!hideIdentity)}
                    className={[
                        "relative w-11 h-6 rounded-full transition-colors cursor-pointer shrink-0",
                        !hideIdentity ? "bg-terracotta-400" : "bg-sand-300",
                    ].join(" ")}
                >
                    <span
                        className={[
                            "absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow-sm transition-transform",
                            !hideIdentity ? "translate-x-5" : "translate-x-0",
                        ].join(" ")}
                    />
                </button>
                <span className="text-xs text-sand-600 font-medium">Show ID</span>
            </label>
        </div>
    );
};

export default IdentityToggle;
