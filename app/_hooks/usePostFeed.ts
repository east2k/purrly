import { useState, useEffect, useCallback } from "react";
import { useUser } from "@clerk/nextjs";
import { getTimeRange } from "@/app/_utils/time";
import { POSTS_PER_PAGE } from "@/app/_constants";
import type { ApiPost } from "@/types";
import type { TimeRange } from "@/app/_utils/time";

export type FeedFilter = "recent" | "mostHugged" | "myPosts";

export const FEED_FILTER_LABELS: Record<FeedFilter, string> = {
    recent: "Recent",
    mostHugged: "Most hugged",
    myPosts: "My posts",
};

const usePostFeed = () => {
    const [posts, setPosts] = useState<ApiPost[]>([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState<FeedFilter>("recent");
    const [timeRange, setTimeRange] = useState<TimeRange>("all");
    const [customDate, setCustomDate] = useState<string | null>(null);
    const [offset, setOffset] = useState(0);
    const [hasMore, setHasMore] = useState(true);
    const { isSignedIn } = useUser();

    const fetchPosts = useCallback(async (reset: boolean, currentFilter: FeedFilter, currentTimeRange: TimeRange, currentCustomDate: string | null) => {
        const { from, to } = getTimeRange(currentTimeRange, currentCustomDate);
        const params = new URLSearchParams({
            limit: String(POSTS_PER_PAGE),
            offset: reset ? "0" : String(offset),
            sort: currentFilter === "mostHugged" ? "mostHugged" : "recent",
        });

        if (currentTimeRange !== "all") {
            params.set("from", String(from));
            params.set("to", String(to));
        }

        if (currentFilter === "myPosts") {
            params.set("mine", "true");
        }

        const res = await fetch(`/api/posts?${params}`);
        if (!res.ok) return;

        const data: ApiPost[] = await res.json();

        if (reset) {
            setPosts(data);
            setOffset(data.length);
        } else {
            setPosts((prev) => [...prev, ...data]);
            setOffset((prev) => prev + data.length);
        }
        setHasMore(data.length >= POSTS_PER_PAGE);
        setLoading(false);
    }, [offset]);

    useEffect(() => {
        setLoading(true);
        fetchPosts(true, filter, timeRange, customDate);
    }, [filter, timeRange, customDate]);

    const handlePost = async (data: {
        text: string;
        mood: string | null;
        commentsEnabled: boolean;
        hideIdentity: boolean;
    }) => {
        const res = await fetch("/api/posts", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data),
        });

        if (!res.ok) return;

        const newPost: ApiPost = await res.json();
        setPosts((prev) => [newPost, ...prev]);
        setFilter("recent");
        setTimeRange("all");
        setCustomDate(null);
    };

    const handleFilterChange = (f: FeedFilter) => {
        setFilter(f);
        setOffset(0);
    };

    const handleTimeRangeChange = (t: TimeRange) => {
        setTimeRange(t);
        if (t !== "custom") setCustomDate(null);
        setOffset(0);
    };

    const handleDatePick = (value: string) => {
        setCustomDate(value);
        setTimeRange("custom");
        setOffset(0);
    };

    const loadMore = () => {
        fetchPosts(false, filter, timeRange, customDate);
    };

    const availableFilters: FeedFilter[] = isSignedIn
        ? ["recent", "mostHugged", "myPosts"]
        : ["recent", "mostHugged"];

    return {
        posts,
        loading,
        hasMore,
        filter,
        timeRange,
        customDate,
        availableFilters,
        handlePost,
        handleFilterChange,
        handleTimeRangeChange,
        handleDatePick,
        loadMore,
    };
};

export default usePostFeed;
