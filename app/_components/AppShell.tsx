"use client";

import { useState } from "react";
import Image from "next/image";
import { useUser, Show, SignInButton, UserButton } from "@clerk/nextjs";
import PostComposer from "./Vent/PostComposer";
import PostCard from "./Vent/PostCard";
import SelfCareCard from "./SelfCare/SelfCareCard";
import TabNav from "./TabNav";
import SignupNudge from "./SignupNudge";
import WhispersTab from "./Whispers/WhispersTab";
import { SAMPLE_POSTS, SELF_CARE_CONFIG, MOCK_CURRENT_USER_ID } from "@/app/_constants";
import type { Post, Comment, CareState, SelfCareKey } from "@/types";

type Tab = "vent" | "care" | "whispers";

const AppShell = () => {
    const [tab, setTab] = useState<Tab>("vent");
    const [posts, setPosts] = useState<Post[]>(SAMPLE_POSTS);
    const [care, setCare] = useState<CareState>({ water: 3, sleep: 6 });
    const { isSignedIn, user } = useUser();

    const handlePost = (data: Omit<Post, "id" | "timestamp" | "comments" | "reactions">) => {
        const newPost: Post = {
            ...data,
            id: Date.now(),
            comments: [],
            reactions: { hugs: 0, meToo: 0 },
            timestamp: Date.now(),
        };
        setPosts([newPost, ...posts]);
    };

    const handleAddComment = (postId: number, text: string) => {
        const newComment: Comment = {
            id: Date.now(),
            text,
            timestamp: Date.now(),
            authorId: user?.id ?? "unknown",
            authorDisplayId: "7382",
            hideIdentity: false,
        };
        setPosts(
            posts.map((p) =>
                p.id === postId
                    ? { ...p, comments: [...p.comments, newComment] }
                    : p,
            ),
        );
    };

    const handleCareChange = (key: SelfCareKey, value: number) => {
        setCare({ ...care, [key]: value });
    };

    return (
        <div className="max-w-160 mx-auto px-4 pb-24">
            <header className="relative text-center py-8">
                <div className="flex items-center justify-center gap-3 mb-1">
                    <Image src="/logo.png" alt="Purrly logo" width={48} height={48} priority />
                    <h1 className="font-display font-bold text-[32px] tracking-tight text-sand-900">
                        purr<span className="text-terracotta-400">ly</span>
                    </h1>
                </div>
                <p className="text-sm text-sand-600 font-light">
                    curl up. let it out. take care of you.
                </p>
                <div className="absolute right-0 top-1/2 -translate-y-1/2">
                    <Show when="signed-in">
                        <UserButton />
                    </Show>
                    <Show when="signed-out">
                        <SignInButton mode="modal">
                            <button className="text-sm font-medium text-terracotta-400 hover:text-terracotta-500 transition-colors cursor-pointer">
                                Sign in
                            </button>
                        </SignInButton>
                    </Show>
                </div>
            </header>

            <TabNav
                activeTab={tab}
                onTabChange={setTab}
                badges={{ whispers: true }}
            />

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
                isSignedIn ? (
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
                        <div className="text-center mt-6 py-3">
                            <p className="text-sm text-sand-600">
                                You&apos;ve checked in 5 days in a row 🐱
                            </p>
                        </div>
                        <blockquote className="text-center rounded-2xl p-7 mt-4 bg-sand-100">
                            <p className="font-display italic text-base text-sand-600 leading-relaxed">
                                &ldquo;You don&apos;t have to be positive all the time. It&apos;s
                                perfectly okay to feel sad, angry, frustrated, or anxious. Having
                                feelings doesn&apos;t make you weak.&rdquo;
                            </p>
                        </blockquote>
                    </div>
                ) : (
                    <div className="bg-white rounded-2xl border border-sand-300 shadow-card">
                        <SignupNudge message="Sign up to start tracking your self-care. It takes 5 seconds, and your data stays yours. 🐱" />
                    </div>
                )
            )}

            {tab === "whispers" && (
                isSignedIn ? (
                    <WhispersTab currentUserId={user?.id ?? MOCK_CURRENT_USER_ID} />
                ) : (
                    <div className="bg-white rounded-2xl border border-sand-300 shadow-card">
                        <SignupNudge message="Sign up to start whispering. Connect with someone who gets it. 💬" />
                    </div>
                )
            )}
        </div>
    );
};

export default AppShell;
