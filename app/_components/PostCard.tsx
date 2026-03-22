"use client";

import { useState } from "react";
import { UserRound } from "lucide-react";
import { timeAgo } from "@/app/_utils/time";
import type { Post } from "@/types";

type PostCardProps = {
    post: Post;
    onAddComment: (postId: number, text: string) => void;
    animationDelay?: string;
};

const PostCard = ({ post, onAddComment, animationDelay = "0s" }: PostCardProps) => {
    const [showComments, setShowComments] = useState(false);
    const [commentText, setCommentText] = useState("");

    const handleComment = () => {
        if (!commentText.trim()) return;
        onAddComment(post.id, commentText.trim());
        setCommentText("");
    };

    return (
        <div
            className="bg-white rounded-2xl px-6 py-5 mb-3.5 border border-sand-300 shadow-card animate-fade-up"
            style={{ animationDelay }}
        >
            <div className="flex justify-between items-center mb-2">
                <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-full bg-sand-200 flex items-center justify-center shrink-0">
                        <UserRound size={15} className="text-sand-500" />
                    </div>
                    <span className="text-xs font-semibold text-sand-600">
                        {post.anonymous ? "Anonymous" : "You"}
                    </span>
                </div>
                <span className="text-xs text-sand-500">{timeAgo(post.timestamp)}</span>
            </div>

            {post.mood && <span className="text-[22px] inline-block mb-1.5">{post.mood}</span>}

            <p className="text-[15px] leading-[1.65] text-sand-900 mb-3">{post.text}</p>

            <div className="border-t border-sand-300 pt-2.5">
                {post.commentsEnabled ? (
                    <button
                        className="text-xs text-sand-600 hover:text-terracotta-400 transition-colors bg-transparent border-none cursor-pointer py-1 font-body"
                        onClick={() => setShowComments(!showComments)}
                    >
                        💬 {post.comments.length > 0 ? post.comments.length : ""}{" "}
                        {showComments ? "Hide" : "Comments"}
                    </button>
                ) : (
                    <span className="text-xs text-sand-500 italic">Comments off</span>
                )}
            </div>

            {showComments && post.commentsEnabled && (
                <div className="mt-3 pt-3 border-t border-dashed border-sand-300">
                    {post.comments.map((c) => (
                        <div key={c.id} className="flex items-start gap-2 py-2">
                            <div className="w-6 h-6 rounded-full bg-sand-200 flex items-center justify-center shrink-0 mt-0.5">
                                <UserRound size={13} className="text-sand-500" />
                            </div>
                            <span className="text-sm text-sand-900 flex-1">{c.text}</span>
                            <span className="text-[11px] text-sand-500 whitespace-nowrap mt-0.5">
                                {timeAgo(c.timestamp)}
                            </span>
                        </div>
                    ))}
                    <div className="flex gap-2 mt-2.5">
                        <input
                            className="flex-1 px-3.5 py-2 border border-sand-300 rounded-lg text-sm bg-sand-50 text-sand-900 outline-none focus:border-terracotta-400 font-body placeholder:text-sand-500"
                            placeholder="Be kind..."
                            value={commentText}
                            onChange={(e) => setCommentText(e.target.value)}
                            onKeyDown={(e) => e.key === "Enter" && handleComment()}
                        />
                        <button
                            onClick={handleComment}
                            disabled={!commentText.trim()}
                            className="px-4 py-2 bg-terracotta-400 text-white text-sm font-medium rounded-lg disabled:opacity-40 hover:bg-terracotta-500 transition-colors cursor-pointer font-body"
                        >
                            Send
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default PostCard;
