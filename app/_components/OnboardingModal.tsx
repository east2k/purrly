"use client";

import { useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";
import { Wind, Heart, MessageCircle, ChevronRight } from "lucide-react";

const STEPS = [
    {
        icon: <Wind size={28} className="text-terracotta-400" />,
        title: "Vent freely",
        body: "Post anonymously as Purrlynonymous. No judgement, no names — just honesty.",
    },
    {
        icon: <MessageCircle size={28} className="text-terracotta-400" />,
        title: "Whisper with someone",
        body: "Connect privately with someone who gets it. Conversations last 48 hours — just enough, not too much.",
    },
    {
        icon: <Heart size={28} className="text-terracotta-400" />,
        title: "Take care of yourself",
        body: "Track small daily habits like water and sleep. Progress, not perfection.",
    },
];

const OnboardingModal = () => {
    const { isSignedIn, isLoaded } = useUser();
    const [show, setShow] = useState(false);
    const [step, setStep] = useState(0);
    const [finishing, setFinishing] = useState(false);

    useEffect(() => {
        if (!isLoaded || !isSignedIn) return;
        const check = async () => {
            const res = await fetch("/api/me");
            if (!res.ok) return;
            const data = await res.json();
            if (!data.onboardedAt) setShow(true);
        };
        check();
    }, [isLoaded, isSignedIn]);

    if (!show) return null;

    const isLast = step === STEPS.length - 1;
    const current = STEPS[step];

    const finish = async () => {
        setFinishing(true);
        await fetch("/api/me/onboard", { method: "POST" });
        setShow(false);
    };

    return (
        <div className="fixed inset-0 z-[90] bg-sand-900/40 flex items-center justify-center px-6">
            <div className="bg-white rounded-2xl shadow-lg w-full max-w-sm p-6">
                <div className="flex gap-1.5 mb-6">
                    {STEPS.map((_, i) => (
                        <div key={i} className={["flex-1 h-1 rounded-full transition-colors", i <= step ? "bg-terracotta-400" : "bg-sand-200"].join(" ")} />
                    ))}
                </div>

                <div className="flex flex-col items-center text-center gap-3 mb-8">
                    {current.icon}
                    <h2 className="font-display text-xl font-semibold text-sand-900">{current.title}</h2>
                    <p className="text-sm text-sand-600 leading-relaxed">{current.body}</p>
                </div>

                <button
                    onClick={isLast ? finish : () => setStep((s) => s + 1)}
                    disabled={finishing}
                    className="w-full py-3 bg-terracotta-400 hover:bg-terracotta-500 text-white text-sm font-medium rounded-xl transition-colors cursor-pointer font-body disabled:opacity-50 flex items-center justify-center gap-1.5"
                >
                    {isLast ? (finishing ? "Getting started..." : "Get started") : (
                        <>Next <ChevronRight size={14} /></>
                    )}
                </button>

                {!isLast && (
                    <button onClick={finish} disabled={finishing} className="w-full mt-2 py-2 text-xs text-sand-400 hover:text-sand-600 transition-colors cursor-pointer font-body">
                        Skip
                    </button>
                )}
            </div>
        </div>
    );
};

export default OnboardingModal;
