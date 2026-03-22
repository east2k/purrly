import { useState } from "react";
import type { ApiComment } from "@/types";

const usePostComments = (postId: number, initialCount: number, hideIdentity: boolean) => {
    const [comments, setComments] = useState<ApiComment[]>([]);
    const [commentsLoaded, setCommentsLoaded] = useState(false);
    const [showComments, setShowComments] = useState(false);
    const [commentText, setCommentText] = useState("");
    const [submitting, setSubmitting] = useState(false);
    const [count, setCount] = useState(Number(initialCount));

    const loadComments = async () => {
        if (commentsLoaded) return;
        const res = await fetch(`/api/posts/${postId}/comments`);
        if (!res.ok) return;
        const data: ApiComment[] = await res.json();
        setComments(data);
        setCommentsLoaded(true);
    };

    const toggleComments = () => {
        if (!showComments) loadComments();
        setShowComments((prev) => !prev);
    };

    const submitComment = async () => {
        if (!commentText.trim() || submitting) return;
        setSubmitting(true);
        const res = await fetch(`/api/posts/${postId}/comments`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ text: commentText.trim(), hideIdentity }),
        });
        setSubmitting(false);
        if (!res.ok) return;
        const newComment: ApiComment = await res.json();
        setComments((prev) => [...prev, newComment]);
        setCount((prev) => prev + 1);
        setCommentText("");
    };

    return {
        comments,
        showComments,
        commentText,
        setCommentText,
        submitting,
        count,
        toggleComments,
        submitComment,
    };
};

export default usePostComments;
