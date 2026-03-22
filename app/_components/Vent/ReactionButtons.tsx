"use client";

import { useState } from "react";
import type { Reactions } from "@/types";

type ReactionButtonsProps = {
    reactions: Reactions;
};

const ReactionButtons = ({ reactions }: ReactionButtonsProps) => {
    const [hugs, setHugs] = useState(reactions.hugs);
    const [meToo, setMeToo] = useState(reactions.meToo);
    const [huggedByMe, setHuggedByMe] = useState(false);
    const [meTooByMe, setMeTooByMe] = useState(false);

    const toggleHug = () => {
        setHugs(huggedByMe ? hugs - 1 : hugs + 1);
        setHuggedByMe(!huggedByMe);
    };

    const toggleMeToo = () => {
        setMeToo(meTooByMe ? meToo - 1 : meToo + 1);
        setMeTooByMe(!meTooByMe);
    };

    return (
        <div className="flex gap-2">
            <button
                onClick={toggleHug}
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
                onClick={toggleMeToo}
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
