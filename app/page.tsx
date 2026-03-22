"use client";

import { useState } from "react";
import { useUser } from "@clerk/nextjs";
import PostComposer from "@/app/_components/Vent/PostComposer";
import PostCard from "@/app/_components/Vent/PostCard";
import { SAMPLE_POSTS } from "@/app/_constants";
import type { Post, Comment } from "@/types";

const VentPage = () => {
    const [posts, setPosts] = useState<Post[]>(SAMPLE_POSTS);
    const { user } = useUser();

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

    return (
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
    );
};

export default VentPage;
