"use client";

import { useUser } from "@clerk/nextjs";
import SelfCareCard from "@/app/_components/SelfCare/SelfCareCard";
import SignupNudge from "@/app/_components/SignupNudge";
import useSelfCare from "@/app/_hooks/useSelfCare";
import { SELF_CARE_CONFIG } from "@/app/_constants";
import type { SelfCareKey } from "@/types";

const CarePage = () => {
    const { isSignedIn, isLoaded } = useUser();
    const { care, streak, loading, handleCareChange } = useSelfCare();

    if (!isLoaded) return null;

    if (!isSignedIn) {
        return (
            <div className="bg-white rounded-2xl border border-sand-300 shadow-card">
                <SignupNudge message="Sign up to start tracking your self-care. It takes 5 seconds, and your data stays yours. 🐱" />
            </div>
        );
    }

    return (
        <div>
            <h2 className="font-display text-[22px] font-medium mb-1 text-sand-900">
                Daily Check-in
            </h2>
            <p className="text-sm text-sand-600 font-light mb-6">
                Small purrs of progress. You&apos;re doing great.
            </p>
            <div className="flex flex-col gap-3.5">
                {(Object.keys(SELF_CARE_CONFIG) as SelfCareKey[]).map((key) => (
                    <SelfCareCard
                        key={key}
                        config={SELF_CARE_CONFIG[key]}
                        value={care[key]}
                        onChange={(v) => handleCareChange(key, v)}
                    />
                ))}
            </div>
            {!loading && (
                <div className="text-center mt-6 py-3">
                    <p className="text-sm text-sand-600">
                        {streak > 1
                            ? `You've checked in ${streak} days in a row 🐱`
                            : streak === 1
                                ? "You checked in today 🐱"
                                : "Start your streak — check in today 🐱"}
                    </p>
                </div>
            )}
            <blockquote className="text-center rounded-2xl p-7 mt-4 bg-sand-100">
                <p className="font-display italic text-base text-sand-600 leading-relaxed">
                    &ldquo;You don&apos;t have to be positive all the time. It&apos;s
                    perfectly okay to feel sad, angry, frustrated, or anxious. Having
                    feelings doesn&apos;t make you weak.&rdquo;
                </p>
            </blockquote>
        </div>
    );
};

export default CarePage;
