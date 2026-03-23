"use client";

import { useState, useRef, useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import { MOOD_OPTIONS, MAX_UNSIGNED_POSTS_PER_DAY, LANGUAGE_OPTIONS } from "@/app/_constants";
import { useIdentityPreference } from "@/app/_context/IdentityPreferenceContext";

type PostData = {
    text: string;
    mood: string | null;
    language: string;
    commentsEnabled: boolean;
    hideIdentity: boolean;
};

type PostComposerProps = {
    onPost: (post: PostData) => Promise<string | null>;
};

const PostComposer = ({ onPost }: PostComposerProps) => {
    const [text, setText] = useState("");
    const [mood, setMood] = useState<string | null>(null);
    const [language, setLanguage] = useState("")
    const [commentsEnabled, setCommentsEnabled] = useState(true);
    const [showAllMoods, setShowAllMoods] = useState(false);
    const [postsToday, setPostsToday] = useState(0);
    const [postError, setPostError] = useState<string | null>(null);
    const textRef = useRef<HTMLTextAreaElement>(null);
    const { isSignedIn } = useUser();
    const { hideIdentity } = useIdentityPreference();

    useEffect(() => {
        if (isSignedIn) return;
        fetch("/api/posts/rate-limit")
            .then((r) => r.json())
            .then((data) => setPostsToday(data.count ?? 0))
            .catch(() => {});
    }, [isSignedIn]);

    const isRateLimited = !isSignedIn && postsToday >= MAX_UNSIGNED_POSTS_PER_DAY;
    const remainingPosts = MAX_UNSIGNED_POSTS_PER_DAY - postsToday;

    const visibleMoods = showAllMoods ? MOOD_OPTIONS : MOOD_OPTIONS.slice(0, 6);

    const handleSubmit = async () => {
        if (!text.trim() || !language || isRateLimited) return;
        setPostError(null);
        const error = await onPost({
            text: text.trim(),
            mood,
            language,
            commentsEnabled,
            hideIdentity: isSignedIn ? hideIdentity : true,
        });
        if (error) {
            setPostError(error);
            if (!isSignedIn) setPostsToday(MAX_UNSIGNED_POSTS_PER_DAY);
            return;
        }
        setText("");
        setMood(null);
        setLanguage("");
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

            <div className="flex items-center gap-2 mb-3">
                <span className="text-xs font-medium text-sand-700 shrink-0">Posting in</span>
                <select
                    value={language}
                    onChange={(e) => setLanguage(e.target.value)}
                    className={[
                        "flex-1 px-3 py-2 border rounded-lg text-sm outline-none transition-colors cursor-pointer font-body bg-sand-50",
                        !language
                            ? "border-terracotta-300 text-sand-400 focus:border-terracotta-400"
                            : "border-sand-300 text-sand-800 focus:border-terracotta-400",
                    ].join(" ")}
                >
                    <option value="" disabled>Select a language — required</option>
                    {LANGUAGE_OPTIONS.map((l) => (
                        <option key={l.code} value={l.code}>{l.label}</option>
                    ))}
                </select>
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
                <div className="flex items-center gap-4">
                    <label className="flex items-center gap-1.5 text-xs text-sand-600 cursor-pointer">
                        <input
                            type="checkbox"
                            checked={commentsEnabled}
                            onChange={() => setCommentsEnabled(!commentsEnabled)}
                            className="accent-terracotta-400 w-3.75 h-3.75"
                        />
                        Allow comments
                    </label>
                </div>
                <button
                    onClick={handleSubmit}
                    disabled={!text.trim() || !language || isRateLimited}
                    className="px-7 py-2.5 bg-terracotta-400 text-white text-sm font-semibold rounded-[10px] disabled:opacity-45 hover:bg-terracotta-500 hover:-translate-y-px transition-all cursor-pointer font-body"
                >
                    Post
                </button>
            </div>

            {postError && (
                <p className="text-xs text-red-400 mt-3 text-center">{postError}</p>
            )}
            {!isSignedIn && !postError && postsToday > 0 && (
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
