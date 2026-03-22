"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useUser } from "@clerk/nextjs";

type Tab = { href: string; label: string };

const TABS: Tab[] = [
    { href: "/", label: "🐾 Vent" },
    { href: "/care", label: "🧸 Self Care" },
    { href: "/whispers", label: "💬 Whispers" },
];

const TabNav = () => {
    const pathname = usePathname();
    const { isSignedIn, user } = useUser();
    const [hasWhisperRequests, setHasWhisperRequests] = useState(false);

    useEffect(() => {
        let cancelled = false;
        const check = async () => {
            if (!isSignedIn || !user) {
                if (!cancelled) setHasWhisperRequests(false);
                return;
            }
            const res = await fetch("/api/whispers");
            if (cancelled || !res.ok) return;
            const whispers: { status: string; requestedById: string }[] = await res.json();
            if (!cancelled) {
                setHasWhisperRequests(
                    whispers.some((w) => w.status === "PENDING" && w.requestedById !== user.id)
                );
            }
        };
        check();
        return () => { cancelled = true; };
    }, [isSignedIn, user, pathname]);

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
                    {tab.href === "/whispers" && hasWhisperRequests && (
                        <span className="absolute top-1.5 right-2 w-2 h-2 bg-terracotta-400 rounded-full" />
                    )}
                </Link>
            ))}
        </nav>
    );
};

export default TabNav;
