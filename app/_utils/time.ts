export const timeAgo = (ts: number): string => {
    const diff = Date.now() - ts;
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return "just now";
    if (mins < 60) return `${mins}m ago`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return `${hrs}h ago`;
    return `${Math.floor(hrs / 24)}d ago`;
};

export type TimeRange = "today" | "week" | "month" | "all" | "custom";

export const TIME_RANGE_OPTIONS: { value: TimeRange; label: string }[] = [
    { value: "today", label: "Today" },
    { value: "week", label: "This week" },
    { value: "month", label: "This month" },
    { value: "all", label: "All time" },
];

export const getTimeRange = (range: TimeRange, customDate: string | null): { from: number; to: number } => {
    const now = Date.now();
    const day = 24 * 60 * 60 * 1000;
    const startOfToday = new Date().setHours(0, 0, 0, 0);

    switch (range) {
        case "today":
            return { from: startOfToday, to: now };
        case "week":
            return { from: now - 7 * day, to: now };
        case "month":
            return { from: now - 30 * day, to: now };
        case "custom": {
            if (!customDate) return { from: 0, to: now };
            const dayStart = new Date(customDate).setHours(0, 0, 0, 0);
            return { from: dayStart, to: dayStart + day };
        }
        case "all":
            return { from: 0, to: now };
    }
};

export const formatCustomDate = (dateStr: string): string => {
    const date = new Date(dateStr + "T00:00:00");
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
};
