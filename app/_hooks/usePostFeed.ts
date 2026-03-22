import { useState, useMemo } from "react";
import { useUser } from "@clerk/nextjs";
import { getTimeRange } from "@/app/_utils/time";
import { SAMPLE_POSTS, POSTS_PER_PAGE, MOCK_CURRENT_USER_ID } from "@/app/_constants";
import type { Post, Comment } from "@/types";
import type { TimeRange } from "@/app/_utils/time";

export type FeedFilter = "recent" | "mostHugged" | "myPosts";

export const FEED_FILTER_LABELS: Record<FeedFilter, string> = {
    recent: "Recent",
    mostHugged: "Most hugged",
    myPosts: "My posts",
};

const usePostFeed = () => {
    const [posts, setPosts] = useState<Post[]>(SAMPLE_POSTS);
    const [filter, setFilter] = useState<FeedFilter>("recent");
    const [timeRange, setTimeRange] = useState<TimeRange>("all");
    const [customDate, setCustomDate] = useState<string | null>(null);
    const [visibleCount, setVisibleCount] = useState(POSTS_PER_PAGE);
    const { isSignedIn, user } = useUser();

    const currentUserId = user?.id ?? MOCK_CURRENT_USER_ID;

    const filteredPosts = useMemo(() => {
        const { from, to } = getTimeRange(timeRange, customDate);
        const timeFiltered = posts.filter((p) => p.timestamp >= from && p.timestamp <= to);

        switch (filter) {
            case "recent":
                return [...timeFiltered].sort((a, b) => b.timestamp - a.timestamp);
            case "mostHugged":
                return [...timeFiltered].sort((a, b) =>
                    (b.reactions.hugs + b.reactions.meToo) - (a.reactions.hugs + a.reactions.meToo),
                );
            case "myPosts":
                return timeFiltered.filter((p) => p.authorId === currentUserId);
        }
    }, [posts, filter, timeRange, customDate, currentUserId]);

    const visiblePosts = filteredPosts.slice(0, visibleCount);
    const hasMore = visibleCount < filteredPosts.length;

    const handlePost = (data: Omit<Post, "id" | "timestamp" | "comments" | "reactions">) => {
        const newPost: Post = {
            ...data,
            id: Date.now(),
            comments: [],
            reactions: { hugs: 0, meToo: 0 },
            timestamp: Date.now(),
        };
        setPosts([newPost, ...posts]);
        setFilter("recent");
        setTimeRange("all");
        setCustomDate(null);
        setVisibleCount(POSTS_PER_PAGE);
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

    const handleFilterChange = (f: FeedFilter) => {
        setFilter(f);
        setVisibleCount(POSTS_PER_PAGE);
    };

    const handleTimeRangeChange = (t: TimeRange) => {
        setTimeRange(t);
        if (t !== "custom") setCustomDate(null);
        setVisibleCount(POSTS_PER_PAGE);
    };

    const handleDatePick = (value: string) => {
        setCustomDate(value);
        setTimeRange("custom");
        setVisibleCount(POSTS_PER_PAGE);
    };

    const loadMore = () => setVisibleCount(visibleCount + POSTS_PER_PAGE);

    const availableFilters: FeedFilter[] = isSignedIn
        ? ["recent", "mostHugged", "myPosts"]
        : ["recent", "mostHugged"];

    return {
        visiblePosts,
        hasMore,
        filter,
        timeRange,
        customDate,
        availableFilters,
        handlePost,
        handleAddComment,
        handleFilterChange,
        handleTimeRangeChange,
        handleDatePick,
        loadMore,
    };
};

export default usePostFeed;
