"use client";

import { useState } from "react";
import { UserRound } from "lucide-react";
import { useUser } from "@clerk/nextjs";
import { timeAgo } from "@/app/_utils/time";
import { getPostDisplayName, getCommentDisplayName } from "@/app/_utils/identity";
import usePostComments from "@/app/_hooks/usePostComments";
import { useIdentityPreference } from "@/app/_context/IdentityPreferenceContext";
import { REPORT_THRESHOLD } from "@/app/_constants";
import ReactionButtons from "./ReactionButtons";
import ReportButton from "../ReportButton";
import SignupNudge from "../SignupNudge";
import type { ApiPost } from "@/types";

type PostCardProps = {
    post: ApiPost;
    animationDelay?: string;
    onHide?: (postId: number) => void;
    onUnhide?: (postId: number) => void;
};

const PostCard = ({ post, animationDelay = "0s", onHide, onUnhide }: PostCardProps) => {
    const [whisperPrompt, setWhisperPrompt] = useState<number | null>(null);
    const [showFlaggedPost, setShowFlaggedPost] = useState(false);
    const [shownFlaggedComments, setShownFlaggedComments] = useState<Set<number>>(new Set());
    const postFlagged = Number(post.reportCount) > REPORT_THRESHOLD;
    const { isSignedIn, user } = useUser();
    const { hideIdentity } = useIdentityPreference();
    const {
        comments,
        showComments,
        commentText,
        setCommentText,
        submitting,
        count,
        toggleComments,
        submitComment,
    } = usePostComments(post.id, post.commentCount, hideIdentity);

    const isAuthor = !!user && post.authorId === user.id;
    const timestamp = new Date(post.createdAt).getTime();

    const handleHide = async () => {
        const res = await fetch(`/api/posts/${post.id}`, { method: "DELETE" });
        if (res.ok) onHide?.(post.id);
    };

    const handleWhisperRequest = async (targetUserId: string) => {
        const res = await fetch("/api/whispers", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ targetUserId }),
        });
        if (!res.ok) {
            const err = await res.json();
            alert(err.error ?? "Something went wrong. Take a breath, we'll try again.");
        }
        setWhisperPrompt(null);
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
                        {getPostDisplayName(post.authorId, post.authorDisplayId, post.hideIdentity)}
                    </span>
                </div>
                <div className="flex items-center gap-2">
                    <span className="text-xs text-sand-500">{timeAgo(timestamp)}</span>
                    {isAuthor ? (
                        post.deletedAt ? (
                            <button
                                onClick={() => onUnhide?.(post.id)}
                                className="text-[11px] text-sand-400 hover:text-terracotta-400 transition-colors cursor-pointer font-body"
                            >
                                Unhide
                            </button>
                        ) : (
                            <button
                                onClick={handleHide}
                                className="text-[11px] text-sand-400 hover:text-red-400 transition-colors cursor-pointer font-body"
                            >
                                Hide
                            </button>
                        )
                    ) : (
                        <ReportButton contentType="POST" contentId={post.id} />
                    )}
                </div>
            </div>

            {post.mood && <span className="text-[22px] inline-block mb-1.5">{post.mood}</span>}

            {postFlagged && !showFlaggedPost ? (
                <div className="mb-3 py-3 px-4 bg-sand-100 rounded-xl border border-sand-200 text-center">
                    <p className="text-xs text-sand-500 mb-2">This post has been reported numerous times.</p>
                    <button
                        onClick={() => setShowFlaggedPost(true)}
                        className="text-xs text-terracotta-400 hover:text-terracotta-500 font-medium cursor-pointer font-body"
                    >
                        See anyway
                    </button>
                </div>
            ) : (
                <div>
                    <p className="text-[15px] leading-[1.65] text-sand-900 mb-3">{post.text}</p>
                    {postFlagged && (
                        <button
                            onClick={() => setShowFlaggedPost(false)}
                            className="text-[11px] text-sand-400 hover:text-sand-600 cursor-pointer font-body mb-3 block"
                        >
                            Hide again
                        </button>
                    )}
                </div>
            )}

            <ReactionButtons postId={post.id} hugCount={post.hugCount} huggedByMe={post.huggedByMe} />

            <div className="border-t border-sand-300 pt-2.5 mt-3">
                {post.commentsEnabled ? (
                    <button
                        className="text-xs text-sand-600 hover:text-terracotta-400 transition-colors bg-transparent border-none cursor-pointer py-1 font-body"
                        onClick={toggleComments}
                    >
                        💬{count > 0 ? ` ${count} ` : " "}
                        {showComments ? "Hide" : "Comments"}
                    </button>
                ) : (
                    <span className="text-xs text-sand-500 italic">Comments off</span>
                )}
            </div>

            {showComments && post.commentsEnabled && (
                <div className="mt-3 pt-3 border-t border-dashed border-sand-300">
                    {comments.map((c) => (
                        <div key={c.id} className="flex items-start gap-2 py-2">
                            <div className="w-6 h-6 rounded-full bg-sand-200 flex items-center justify-center shrink-0 mt-0.5">
                                <UserRound size={13} className="text-sand-500" />
                            </div>
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 mb-0.5">
                                    <span className="text-xs font-semibold text-sand-600">
                                        {getCommentDisplayName(c)}
                                    </span>
                                    <span className="text-[11px] text-sand-500">
                                        {timeAgo(new Date(c.createdAt).getTime())}
                                    </span>
                                </div>
                                {Number(c.reportCount) > REPORT_THRESHOLD && !shownFlaggedComments.has(c.id) ? (
                                    <div className="py-1.5 px-3 bg-sand-100 rounded-lg border border-sand-200 text-center">
                                        <p className="text-[11px] text-sand-500 mb-1">Reported numerous times.</p>
                                        <button
                                            onClick={() => setShownFlaggedComments(new Set([...shownFlaggedComments, c.id]))}
                                            className="text-[11px] text-terracotta-400 hover:text-terracotta-500 font-medium cursor-pointer font-body"
                                        >
                                            See anyway
                                        </button>
                                    </div>
                                ) : (
                                    <div>
                                        <span className="text-sm text-sand-900">{c.text}</span>
                                        {Number(c.reportCount) > REPORT_THRESHOLD && (
                                            <button
                                                onClick={() => setShownFlaggedComments((prev) => { const next = new Set(prev); next.delete(c.id); return next; })}
                                                className="text-[10px] text-sand-400 hover:text-sand-600 cursor-pointer font-body block mt-0.5"
                                            >
                                                Hide again
                                            </button>
                                        )}
                                    </div>
                                )}
                            </div>
                            <div className="flex items-center gap-1.5 shrink-0">
                                {isSignedIn && c.authorId !== user?.id && (
                                    <div className="relative">
                                        <button
                                            onClick={() => setWhisperPrompt(whisperPrompt === c.id ? null : c.id)}
                                            className="text-[11px] text-sand-500 hover:text-terracotta-400 transition-colors cursor-pointer font-body"
                                            title="Start a whisper with this person"
                                        >
                                            💬 Whisper
                                        </button>
                                        {whisperPrompt === c.id && (
                                            <div className="absolute right-0 top-full mt-1 bg-white border border-sand-300 rounded-xl shadow-card-lg p-3 z-10 w-52">
                                                <p className="text-xs text-sand-600 mb-2">Send a whisper request to this person?</p>
                                                <div className="flex gap-2">
                                                    <button
                                                        onClick={() => handleWhisperRequest(c.authorId)}
                                                        className="flex-1 py-1.5 bg-terracotta-400 text-white text-xs font-medium rounded-lg hover:bg-terracotta-500 transition-colors cursor-pointer font-body"
                                                    >
                                                        Send
                                                    </button>
                                                    <button
                                                        onClick={() => setWhisperPrompt(null)}
                                                        className="flex-1 py-1.5 bg-sand-100 text-sand-600 text-xs font-medium rounded-lg hover:bg-sand-200 transition-colors cursor-pointer font-body"
                                                    >
                                                        Cancel
                                                    </button>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                )}
                                {c.authorId !== user?.id && (
                                    <ReportButton contentType="COMMENT" contentId={c.id} />
                                )}
                            </div>
                        </div>
                    ))}

                    {isSignedIn ? (
                        <div className="flex gap-2 mt-2.5">
                            <input
                                className="flex-1 px-3.5 py-2 border border-sand-300 rounded-lg text-sm bg-sand-50 text-sand-900 outline-none focus:border-terracotta-400 font-body placeholder:text-sand-500"
                                placeholder="Be kind..."
                                value={commentText}
                                onChange={(e) => setCommentText(e.target.value)}
                                onKeyDown={(e) => e.key === "Enter" && !submitting && submitComment()}
                                disabled={submitting}
                            />
                            <button
                                onClick={submitComment}
                                disabled={!commentText.trim() || submitting}
                                className="px-4 py-2 bg-terracotta-400 text-white text-sm font-medium rounded-lg disabled:opacity-40 hover:bg-terracotta-500 transition-colors cursor-pointer font-body"
                            >
                                Send
                            </button>
                        </div>
                    ) : (
                        <SignupNudge message="Sign up to join the conversation — it takes 5 seconds 🐱" />
                    )}
                </div>
            )}
        </div>
    );
};

export default PostCard;
