"use client";

import { useState } from "react";
import Image from "next/image";
import PostComposer from "./PostComposer";
import PostCard from "./PostCard";
import SelfCareCard from "./SelfCareCard";
import { SAMPLE_POSTS, SELF_CARE_CONFIG } from "@/app/_constants";
import type { Post, CareState, SelfCareKey } from "@/types";

type Tab = "vent" | "care";

const AppShell = () => {
    const [tab, setTab] = useState<Tab>("vent");
    const [posts, setPosts] = useState<Post[]>(SAMPLE_POSTS);
    const [care, setCare] = useState<CareState>({ water: 3, sleep: 6 });

    const handlePost = (data: Omit<Post, "id" | "timestamp" | "comments">) => {
        const newPost: Post = {
            ...data,
            id: Date.now(),
            comments: [],
            timestamp: Date.now(),
        };
        setPosts([newPost, ...posts]);
    };

    const handleAddComment = (postId: number, text: string) => {
        setPosts(
            posts.map((p) =>
                p.id === postId
                    ? {
                          ...p,
                          comments: [
                              ...p.comments,
                              { id: Date.now(), text, timestamp: Date.now() },
                          ],
                      }
                    : p,
            ),
        );
    };

    const handleCareChange = (key: SelfCareKey, value: number) => {
        setCare({ ...care, [key]: value });
    };

    return (
        <div className="max-w-[640px] mx-auto px-4 pb-24">
            <header className="text-center py-8">
                <div className="flex items-center justify-center gap-3 mb-1">
                    <Image src="/logo.png" alt="Purrly logo" width={48} height={48} priority />
                    <h1 className="font-display font-bold text-[32px] tracking-tight text-sand-900">
                        purr<span className="text-terracotta-400">ly</span>
                    </h1>
                </div>
                <p className="text-sm text-sand-600 font-light">
                    curl up. let it out. take care of you.
                </p>
            </header>

            <nav className="flex gap-1 bg-sand-100 rounded-xl p-1 mb-7">
                {(["vent", "care"] as const).map((t) => (
                    <button
                        key={t}
                        onClick={() => setTab(t)}
                        className={[
                            "flex-1 py-2.5 rounded-[9px] text-sm font-medium transition-all duration-200 cursor-pointer border-none font-body",
                            tab === t
                                ? "bg-white text-sand-900 shadow-sm"
                                : "bg-transparent text-sand-600 hover:text-sand-900",
                        ].join(" ")}
                    >
                        {t === "vent" ? "🐾 Vent" : "🧸 Self Care"}
                    </button>
                ))}
            </nav>

            {tab === "vent" && (
                <div>
                    <PostComposer onPost={handlePost} />
                    <p className="font-display text-lg font-medium mb-4 text-sand-900">
                        Recent Posts
                    </p>
                    {posts.length === 0 ? (
                        <p className="text-center py-12 text-sm text-sand-500">
                            Nothing here yet. You&apos;re safe to go first. 🐱
                        </p>
                    ) : (
                        posts.map((p, i) => (
                            <PostCard
                                key={p.id}
                                post={p}
                                onAddComment={handleAddComment}
                                animationDelay={`${i * 0.05}s`}
                            />
                        ))
                    )}
                </div>
            )}

            {tab === "care" && (
                <div>
                    <h2 className="font-display text-[22px] font-medium mb-1 text-sand-900">
                        Daily Check-in
                    </h2>
                    <p className="text-sm text-sand-600 font-light mb-6">
                        Small purrs of progress. You&apos;re doing great.
                    </p>
                    <div className="flex flex-col gap-3.5">
                        {(Object.keys(SELF_CARE_CONFIG) as SelfCareKey[]).map((key) => (
                            <SelfCareCard
                                key={key}
                                config={SELF_CARE_CONFIG[key]}
                                value={care[key]}
                                onChange={(v) => handleCareChange(key, v)}
                            />
                        ))}
                    </div>
                    <blockquote className="text-center rounded-2xl p-7 mt-7 bg-sand-100">
                        <p className="font-display italic text-base text-sand-600 leading-relaxed">
                            &ldquo;You don&apos;t have to be positive all the time. It&apos;s
                            perfectly okay to feel sad, angry, frustrated, or anxious. Having
                            feelings doesn&apos;t make you weak.&rdquo;
                        </p>
                    </blockquote>
                </div>
            )}
        </div>
    );
};

export default AppShell;
