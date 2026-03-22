"use client";

import { useState, useRef } from "react";
import { useUser } from "@clerk/nextjs";
import { MOOD_OPTIONS, MAX_UNSIGNED_POSTS_PER_DAY } from "@/app/_constants";

type PostData = {
    text: string;
    mood: string | null;
    commentsEnabled: boolean;
    hideIdentity: boolean;
};

type PostComposerProps = {
    onPost: (post: PostData) => void;
};

const PostComposer = ({ onPost }: PostComposerProps) => {
    const [text, setText] = useState("");
    const [mood, setMood] = useState<string | null>(null);
    const [commentsEnabled, setCommentsEnabled] = useState(true);
    const [hideIdentity, setHideIdentity] = useState(true);
    const [showAllMoods, setShowAllMoods] = useState(false);
    const [postsToday, setPostsToday] = useState(0);
    const textRef = useRef<HTMLTextAreaElement>(null);
    const { isSignedIn } = useUser();

    const isRateLimited = !isSignedIn && postsToday >= MAX_UNSIGNED_POSTS_PER_DAY;
    const remainingPosts = MAX_UNSIGNED_POSTS_PER_DAY - postsToday;

    const visibleMoods = showAllMoods ? MOOD_OPTIONS : MOOD_OPTIONS.slice(0, 6);

    const handleSubmit = () => {
        if (!text.trim() || isRateLimited) return;
        onPost({
            text: text.trim(),
            mood,
            commentsEnabled,
            hideIdentity: isSignedIn ? hideIdentity : true,
        });
        setText("");
        setMood(null);
        if (!isSignedIn) setPostsToday(postsToday + 1);
    };

    return (
        <div className="bg-white rounded-2xl p-6 mb-6 border border-sand-300 shadow-card">
            <div className="mb-4">
                <span className="font-display text-xl font-medium block text-sand-900">
                    What&apos;s on your mind?
                </span>
                <span className="text-xs text-sand-500 block mt-0.5">
                    This is your safe corner. No judgment, just purrs.
                </span>
            </div>

            <textarea
                ref={textRef}
                className="w-full border border-sand-300 rounded-[10px] px-4 py-3.5 text-[15px] resize-y min-h-25 bg-sand-50 text-sand-900 outline-none focus:border-terracotta-400 transition-colors leading-relaxed font-body placeholder:text-sand-500"
                placeholder="Let it out..."
                value={text}
                onChange={(e) => setText(e.target.value)}
                rows={4}
            />

            <div className="flex items-center gap-1.5 mt-3.5 flex-wrap">
                <span className="text-xs text-sand-600 mr-1">Mood:</span>
                {visibleMoods.map((m) => (
                    <button
                        key={m.label}
                        title={m.label}
                        onClick={() => setMood(mood === m.emoji ? null : m.emoji)}
                        className={[
                            "w-9 h-9 rounded-full border-2 text-lg flex items-center justify-center transition-all cursor-pointer",
                            mood === m.emoji
                                ? "border-terracotta-400 bg-terracotta-50 scale-[1.15]"
                                : "border-transparent bg-sand-50 hover:border-sand-300 hover:scale-110",
                        ].join(" ")}
                    >
                        {m.emoji}
                    </button>
                ))}
                <button
                    onClick={() => setShowAllMoods(!showAllMoods)}
                    className="w-9 h-9 rounded-full border-2 border-transparent bg-sand-50 hover:border-sand-300 text-xs text-sand-500 flex items-center justify-center transition-all cursor-pointer"
                    title={showAllMoods ? "Show less" : "Show more"}
                >
                    {showAllMoods ? "−" : "···"}
                </button>
            </div>

            <div className="flex justify-between items-center mt-4 flex-wrap gap-3">
                <div className="flex gap-4">
                    <label className="flex items-center gap-1.5 text-xs text-sand-600 cursor-pointer">
                        <input
                            type="checkbox"
                            checked={commentsEnabled}
                            onChange={() => setCommentsEnabled(!commentsEnabled)}
                            className="accent-terracotta-400 w-3.75 h-3.75"
                        />
                        Allow comments
                    </label>
                    {isSignedIn && (
                        <label className="flex items-center gap-1.5 text-xs text-sand-600 cursor-pointer">
                            <input
                                type="checkbox"
                                checked={hideIdentity}
                                onChange={() => setHideIdentity(!hideIdentity)}
                                className="accent-terracotta-400 w-3.75 h-3.75"
                            />
                            Hide my ID
                        </label>
                    )}
                </div>
                <button
                    onClick={handleSubmit}
                    disabled={!text.trim() || isRateLimited}
                    className="px-7 py-2.5 bg-terracotta-400 text-white text-sm font-semibold rounded-[10px] disabled:opacity-45 hover:bg-terracotta-500 hover:-translate-y-px transition-all cursor-pointer font-body"
                >
                    Post
                </button>
            </div>

            {!isSignedIn && postsToday > 0 && (
                <p className="text-xs text-sand-500 mt-3 text-center">
                    {isRateLimited
                        ? "You've reached today's limit. Sign in to post more."
                        : `${remainingPosts} post${remainingPosts === 1 ? "" : "s"} remaining today`}
                </p>
            )}
        </div>
    );
};

export default PostComposer;
