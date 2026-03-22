import type { ApiComment } from "@/types";

export const getPostDisplayName = (
    authorId: string | null,
    authorDisplayId: string | null,
    hideIdentity: boolean,
) => {
    if (!authorId || hideIdentity) return "Purrlynonymous";
    return `Purrlynonymous-${authorDisplayId}`;
};

export const getCommentDisplayName = (comment: ApiComment) => {
    if (comment.hideIdentity) return "Purrlynonymous";
    return `Purrlynonymous-${comment.authorDisplayId}`;
};
