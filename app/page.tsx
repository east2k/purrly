"use client";

import { useRef } from "react";
import { CalendarDays } from "lucide-react";
import PostComposer from "@/app/_components/PostComposer";
import PostCard from "@/app/_components/PostCard";
import usePostFeed, { FEED_FILTER_LABELS } from "@/app/_hooks/usePostFeed";
import { TIME_RANGE_OPTIONS, formatCustomDate } from "@/app/_utils/time";
import { LANGUAGE_OPTIONS } from "@/app/_constants";

const VentPage = () => {
    const dateInputRef = useRef<HTMLInputElement>(null);
    const {
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
    } = usePostFeed();

    return (
        <div>
            <PostComposer onPost={handlePost} />

            <div className="flex items-center justify-between mb-3">
                <p className="font-display text-lg font-medium text-sand-900">
                    Posts
                </p>
                <div className="flex gap-1">
                    {availableFilters.map((f) => (
                        <button
                            key={f}
                            onClick={() => handleFilterChange(f)}
                            className={[
                                "px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer border font-body",
                                filter === f
                                    ? "bg-terracotta-50 border-terracotta-300 text-terracotta-700"
                                    : "bg-sand-50 border-sand-200 text-sand-600 hover:border-sand-400",
                            ].join(" ")}
                        >
                            {FEED_FILTER_LABELS[f]}
                        </button>
                    ))}
                </div>
            </div>

            {filter !== "hidden" && (
                <div className="flex gap-1.5 mb-3 items-center">
                    <select
                        value={language}
                        onChange={(e) => handleLanguageChange(e.target.value)}
                        className="px-2.5 py-1 border border-sand-200 rounded-lg text-[11px] bg-white text-sand-600 outline-none focus:border-terracotta-400 transition-colors cursor-pointer font-body font-medium"
                    >
                        <option value="">Any language</option>
                        {LANGUAGE_OPTIONS.map((l) => (
                            <option key={l.code} value={l.code}>{l.label}</option>
                        ))}
                    </select>
                </div>
            )}

            {filter !== "hidden" && (
                <div className="flex gap-1.5 mb-4 items-center">
                    {TIME_RANGE_OPTIONS.map((t) => (
                        <button
                            key={t.value}
                            onClick={() => handleTimeRangeChange(t.value)}
                            className={[
                                "px-2.5 py-1 rounded-lg text-[11px] font-medium transition-all cursor-pointer border font-body",
                                timeRange === t.value
                                    ? "bg-sand-900 border-sand-900 text-white"
                                    : "bg-white border-sand-200 text-sand-500 hover:border-sand-400",
                            ].join(" ")}
                        >
                            {t.label}
                        </button>
                    ))}

                    <div className="relative">
                        <button
                            onClick={() => dateInputRef.current?.showPicker()}
                            className={[
                                "flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-medium transition-all cursor-pointer border font-body",
                                timeRange === "custom"
                                    ? "bg-sand-900 border-sand-900 text-white"
                                    : "bg-white border-sand-200 text-sand-500 hover:border-sand-400",
                            ].join(" ")}
                        >
                            <CalendarDays size={12} />
                            {timeRange === "custom" && customDate
                                ? formatCustomDate(customDate)
                                : "Pick date"}
                        </button>
                        <input
                            ref={dateInputRef}
                            type="date"
                            className="absolute top-0 left-0 w-0 h-0 opacity-0 pointer-events-none"
                            value={customDate ?? ""}
                            onChange={(e) => handleDatePick(e.target.value)}
                            max={new Date().toISOString().split("T")[0]}
                        />
                    </div>
                </div>
            )}

            {loading ? (
                <p className="text-center py-12 text-sm text-sand-500">Loading...</p>
            ) : posts.length === 0 ? (
                <p className="text-center py-12 text-sm text-sand-500">
                    {filter === "hidden"
                        ? "No hidden posts."
                        : filter === "myPosts"
                            ? "You haven\u2019t posted anything yet. Go ahead, let it out. \ud83d\udc31"
                            : timeRange === "custom" && customDate
                                ? `No posts on ${formatCustomDate(customDate)}.`
                                : "Nothing here yet. You\u2019re safe to go first. \ud83d\udc31"}
                </p>
            ) : (
                <>
                    {posts.map((p, i) => (
                        <PostCard
                            key={p.id}
                            post={p}
                            animationDelay={`${i * 0.05}s`}
                            onHide={handleHidePost}
                            onUnhide={handleUnhidePost}
                        />
                    ))}
                    {hasMore && (
                        <button
                            onClick={loadMore}
                            className="w-full py-3 text-sm font-medium text-sand-600 hover:text-terracotta-400 transition-colors cursor-pointer bg-sand-50 border border-sand-200 rounded-xl mt-2 font-body"
                        >
                            Load more
                        </button>
                    )}
                </>
            )}
        </div>
    );
};

export default VentPage;
