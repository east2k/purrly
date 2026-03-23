import { useState, useEffect, useCallback } from "react";
import { useUser } from "@clerk/nextjs";
import { getTimeRange } from "@/app/_utils/time";
import { POSTS_PER_PAGE } from "@/app/_constants";
import type { ApiPost } from "@/types";
import type { TimeRange } from "@/app/_utils/time";

export type FeedFilter = "recent" | "mostHugged" | "myPosts" | "hidden";

export const FEED_FILTER_LABELS: Record<FeedFilter, string> = {
    recent: "Recent",
    mostHugged: "Most hugged",
    myPosts: "My posts",
    hidden: "Hidden",
};

const usePostFeed = () => {
    const [posts, setPosts] = useState<ApiPost[]>([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState<FeedFilter>("recent");
    const [timeRange, setTimeRange] = useState<TimeRange>("all");
    const [customDate, setCustomDate] = useState<string | null>(null);
    const [offset, setOffset] = useState(0);
    const [hasMore, setHasMore] = useState(true);
    const [language, setLanguage] = useState("");
    const { isSignedIn } = useUser();

    const fetchPosts = useCallback(async (reset: boolean, currentFilter: FeedFilter, currentTimeRange: TimeRange, currentCustomDate: string | null, currentLanguage: string) => {
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

        if (currentFilter === "myPosts") params.set("mine", "true");
        if (currentFilter === "hidden") params.set("hidden", "true");
        if (currentLanguage) params.set("lang", currentLanguage);

        const res = await fetch(`/api/posts?${params}`);
        if (!res.ok) return;

        const data: ApiPost[] = await res.json();

        if (reset) {
            setPosts(data);
            setOffset(data.length);
        } else {
            setPosts((prev) => {
                const existingIds = new Set(prev.map((p) => p.id));
                return [...prev, ...data.filter((p) => !existingIds.has(p.id))];
            });
            setOffset((prev) => prev + data.length);
        }
        setHasMore(data.length >= POSTS_PER_PAGE);
        setLoading(false);
    }, [offset]);

    useEffect(() => {
        let cancelled = false;
        const run = async () => {
            setLoading(true);
            await fetchPosts(true, filter, timeRange, customDate, language);
            if (cancelled) return;
        };
        run();
        return () => { cancelled = true; };
    }, [filter, timeRange, customDate, language]);

    const handlePost = async (data: {
        text: string;
        mood: string | null;
        language: string;
        commentsEnabled: boolean;
        hideIdentity: boolean;
    }): Promise<string | null> => {
        const res = await fetch("/api/posts", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data),
        });

        if (!res.ok) {
            const body = await res.json().catch(() => ({}));
            return (body.error as string) ?? "Something went wrong. Take a breath, we'll try again.";
        }

        const newPost: ApiPost = await res.json();
        setPosts((prev) => prev.some((p) => p.id === newPost.id) ? prev : [newPost, ...prev]);
        setFilter("recent");
        setTimeRange("all");
        setCustomDate(null);
        return null;
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

    const handleLanguageChange = (l: string) => {
        setLanguage(l);
        setOffset(0);
    };

    const loadMore = () => {
        fetchPosts(false, filter, timeRange, customDate, language);
    };

    const handleHidePost = (postId: number) => {
        setPosts((prev) => prev.filter((p) => p.id !== postId));
    };

    const handleUnhidePost = async (postId: number) => {
        const res = await fetch(`/api/posts/${postId}`, { method: "PATCH" });
        if (res.ok) setPosts((prev) => prev.filter((p) => p.id !== postId));
    };

    const availableFilters: FeedFilter[] = isSignedIn
        ? ["recent", "mostHugged", "myPosts", "hidden"]
        : ["recent", "mostHugged"];

    return {
        posts,
        loading,
        hasMore,
        filter,
        timeRange,
        customDate,
        language,
        availableFilters,
        handlePost,
        handleHidePost,
        handleUnhidePost,
        handleFilterChange,
        handleTimeRangeChange,
        handleDatePick,
        handleLanguageChange,
        loadMore,
    };
};

export default usePostFeed;
