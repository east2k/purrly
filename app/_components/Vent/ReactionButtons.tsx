"use client";

import { useState } from "react";
import { useUser } from "@clerk/nextjs";
import { getSessionId } from "@/app/_utils/session";

type ReactionButtonsProps = {
    postId: number;
    hugCount: number;
    meTooCount: number;
};

const ReactionButtons = ({ postId, hugCount, meTooCount }: ReactionButtonsProps) => {
    const [hugs, setHugs] = useState(hugCount);
    const [meToo, setMeToo] = useState(meTooCount);
    const [huggedByMe, setHuggedByMe] = useState(false);
    const [meTooByMe, setMeTooByMe] = useState(false);
    const { isSignedIn } = useUser();

    const toggleReaction = async (type: "HUG" | "ME_TOO") => {
        const isHug = type === "HUG";
        const active = isHug ? huggedByMe : meTooByMe;

        if (isHug) {
            setHugs(active ? hugs - 1 : hugs + 1);
            setHuggedByMe(!active);
        } else {
            setMeToo(active ? meToo - 1 : meToo + 1);
            setMeTooByMe(!active);
        }

        const body: Record<string, string> = { type };
        if (!isSignedIn) {
            body.sessionId = getSessionId();
        }

        const res = await fetch(`/api/posts/${postId}/reactions`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(body),
        });

        if (!res.ok) {
            if (isHug) {
                setHugs(active ? hugs : hugs - 1);
                setHuggedByMe(active);
            } else {
                setMeToo(active ? meToo : meToo - 1);
                setMeTooByMe(active);
            }
        }
    };

    return (
        <div className="flex gap-2">
            <button
                onClick={() => toggleReaction("HUG")}
                className={[
                    "flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all cursor-pointer border",
                    huggedByMe
                        ? "bg-terracotta-50 border-terracotta-300 text-terracotta-700"
                        : "bg-sand-50 border-sand-300 text-sand-600 hover:border-sand-400",
                ].join(" ")}
            >
                🫂 {hugs > 0 && <span>{hugs}</span>}
            </button>
            <button
                onClick={() => toggleReaction("ME_TOO")}
                className={[
                    "flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all cursor-pointer border",
                    meTooByMe
                        ? "bg-sage-50 border-sage-300 text-sage-700"
                        : "bg-sand-50 border-sand-300 text-sand-600 hover:border-sand-400",
                ].join(" ")}
            >
                me too {meToo > 0 && <span>{meToo}</span>}
            </button>
        </div>
    );
};

export default ReactionButtons;
