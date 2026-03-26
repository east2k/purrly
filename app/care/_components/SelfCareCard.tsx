"use client";

import ProgressRing from "./ProgressRing";
import type { SelfCareConfig } from "@/types";

type SelfCareCardProps = {
    config: SelfCareConfig;
    value: number;
    onChange: (value: number) => void;
};

const SelfCareCard = ({ config, value, onChange }: SelfCareCardProps) => {
    const done = value >= config.goal;
    const ringColor = done ? "#7BAE7F" : "#D4845A";

    return (
        <div
            className={[
                "flex items-center gap-4 rounded-2xl p-5 border transition-colors duration-300 shadow-card",
                done ? "border-sage-400 bg-sage-50" : "bg-white border-sand-300",
            ].join(" ")}
        >
            <div className="relative w-[72px] h-[72px] shrink-0">
                <ProgressRing value={value} max={config.goal} color={ringColor} />
                <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-2xl select-none">
                    {config.icon}
                </span>
            </div>

            <div className="flex-1">
                <p className="font-semibold text-base text-sand-900">{config.label}</p>
                <p className="text-sm text-sand-600 mt-0.5">
                    {value} / {config.goal} {config.unit}
                </p>
                {done && <p className="text-xs font-semibold text-sage-500 mt-1">Goal reached ✓</p>}
            </div>

            <div className="flex gap-2">
                <button
                    onClick={() => onChange(Math.max(0, value - 1))}
                    aria-label="Decrease"
                    className="w-10 h-10 rounded-full border border-sand-300 bg-sand-50 text-sand-600 text-lg flex items-center justify-center transition-colors hover:border-terracotta-400 hover:text-terracotta-400 cursor-pointer"
                >
                    −
                </button>
                <button
                    onClick={() => onChange(value + 1)}
                    aria-label="Increase"
                    className="w-10 h-10 rounded-full bg-terracotta-400 border border-terracotta-400 text-white text-lg flex items-center justify-center transition-colors hover:bg-terracotta-500 cursor-pointer"
                >
                    +
                </button>
            </div>
        </div>
    );
};

export default SelfCareCard;
