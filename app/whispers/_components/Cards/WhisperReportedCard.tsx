"use client";

import type { ApiWhisper } from "@/types";

type WhisperReportedCardProps = {
    whisper: ApiWhisper;
    currentUserId: string;
    onClick: () => void;
};

const WhisperReportedCard = ({ whisper, currentUserId, onClick }: WhisperReportedCardProps) => {
    const otherDisplayId =
        whisper.participantOneId === currentUserId
            ? whisper.participantTwo.displayId
            : whisper.participantOne.displayId;

    return (
        <button
            onClick={onClick}
            className="w-full text-left bg-white rounded-2xl px-5 py-4 border border-sand-300 shadow-card hover:border-terracotta-300 transition-colors cursor-pointer"
        >
            <div className="flex justify-between items-center mb-1">
                <span className="text-sm font-semibold text-sand-900">
                    Purrlynonymous-{otherDisplayId}
                </span>
                <span className="text-[11px] text-sand-400">
                    {whisper.messagingAllowed ? "Messaging on" : "Messaging off"}
                </span>
            </div>
            <p className="text-xs text-sand-400">Reported</p>
        </button>
    );
};

export default WhisperReportedCard;
