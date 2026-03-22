"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

type Tab = {
    href: string;
    label: string;
};

const TABS: Tab[] = [
    { href: "/", label: "🐾 Vent" },
    { href: "/care", label: "🧸 Self Care" },
    { href: "/whispers", label: "💬 Whispers" },
];

type TabNavProps = {
    badges?: Partial<Record<string, boolean>>;
};

const TabNav = ({ badges = {} }: TabNavProps) => {
    const pathname = usePathname();

    const isActive = (href: string) =>
        href === "/" ? pathname === "/" : pathname.startsWith(href);

    return (
        <nav className="flex gap-1 bg-sand-100 rounded-xl p-1 mb-7">
            {TABS.map((tab) => (
                <Link
                    key={tab.href}
                    href={tab.href}
                    className={[
                        "relative flex-1 py-2.5 rounded-[9px] text-sm font-medium transition-all duration-200 text-center no-underline font-body",
                        isActive(tab.href)
                            ? "bg-white text-sand-900 shadow-sm"
                            : "bg-transparent text-sand-600 hover:text-sand-900",
                    ].join(" ")}
                >
                    {tab.label}
                    {badges[tab.href] && (
                        <span className="absolute top-1.5 right-2 w-2 h-2 bg-terracotta-400 rounded-full" />
                    )}
                </Link>
            ))}
        </nav>
    );
};

export default TabNav;
