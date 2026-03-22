"use client";

import { useState } from "react";
import { useUser, SignInButton } from "@clerk/nextjs";

type ReactionButtonsProps = {
    postId: number;
    hugCount: number;
    huggedByMe: boolean;
};

const ReactionButtons = ({ postId, hugCount, huggedByMe: initialHuggedByMe }: ReactionButtonsProps) => {
    const [hugs, setHugs] = useState(Number(hugCount));
    const [huggedByMe, setHuggedByMe] = useState(initialHuggedByMe);
    const [showNudge, setShowNudge] = useState(false);
    const { isSignedIn } = useUser();

    const toggleHug = async () => {
        const wasActive = huggedByMe;
        setHugs(wasActive ? hugs - 1 : hugs + 1);
        setHuggedByMe(!wasActive);

        const res = await fetch(`/api/posts/${postId}/reactions`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ type: "HUG" }),
        });

        if (!res.ok) {
            setHugs(wasActive ? hugs : hugs - 1);
            setHuggedByMe(wasActive);
        }
    };

    if (!isSignedIn) {
        return (
            <div className="flex items-center gap-2">
                <button
                    onClick={() => setShowNudge(!showNudge)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all border bg-sand-50 border-sand-300 text-sand-400 cursor-pointer hover:border-sand-400"
                >
                    🫂 {hugs > 0 && <span>{hugs}</span>}
                </button>
                {showNudge && (
                    <SignInButton mode="modal">
                        <button className="text-xs text-terracotta-500 hover:text-terracotta-600 transition-colors cursor-pointer font-body underline underline-offset-2">
                            Sign in to send hugs
                        </button>
                    </SignInButton>
                )}
            </div>
        );
    }

    return (
        <div className="flex gap-2">
            <button
                onClick={toggleHug}
                className={[
                    "flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all border cursor-pointer",
                    huggedByMe
                        ? "bg-terracotta-50 border-terracotta-300 text-terracotta-700"
                        : "bg-sand-50 border-sand-300 text-sand-600 hover:border-sand-400",
                ].join(" ")}
            >
                🫂 {hugs > 0 && <span>{hugs}</span>}
            </button>
        </div>
    );
};

export default ReactionButtons;
