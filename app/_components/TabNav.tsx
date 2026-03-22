"use client";

type Tab = "vent" | "care" | "whispers";

type TabNavProps = {
    activeTab: Tab;
    onTabChange: (tab: Tab) => void;
    badges?: Partial<Record<Tab, boolean>>;
};

const TAB_LABELS: Record<Tab, string> = {
    vent: "🐾 Vent",
    care: "🧸 Self Care",
    whispers: "💬 Whispers",
};

const TabNav = ({ activeTab, onTabChange, badges = {} }: TabNavProps) => (
    <nav className="flex gap-1 bg-sand-100 rounded-xl p-1 mb-7">
        {(["vent", "care", "whispers"] as const).map((t) => (
            <button
                key={t}
                onClick={() => onTabChange(t)}
                className={[
                    "relative flex-1 py-2.5 rounded-[9px] text-sm font-medium transition-all duration-200 cursor-pointer border-none font-body",
                    activeTab === t
                        ? "bg-white text-sand-900 shadow-sm"
                        : "bg-transparent text-sand-600 hover:text-sand-900",
                ].join(" ")}
            >
                {TAB_LABELS[t]}
                {badges[t] && (
                    <span className="absolute top-1.5 right-2 w-2 h-2 bg-terracotta-400 rounded-full" />
                )}
            </button>
        ))}
    </nav>
);

export default TabNav;
