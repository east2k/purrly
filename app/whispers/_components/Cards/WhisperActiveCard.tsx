"use client";

import CountdownTimer from "@/app/whispers/_components/Thread/CountdownTimer";
import type { ApiWhisper } from "@/types";

type WhisperActiveCardProps = {
    whisper: ApiWhisper;
    currentUserId: string;
    now: number;
    onClick: () => void;
};

const WhisperActiveCard = ({ whisper, currentUserId, now, onClick }: WhisperActiveCardProps) => {
    const otherIsRequester = whisper.requestedById !== currentUserId;
    const otherDisplayId =
        whisper.participantOneId === currentUserId
            ? whisper.participantTwo.displayId
            : whisper.participantOne.displayId;
    const showOtherId = otherIsRequester ? whisper.requestedByRevealId : true;
    const lastMessage = whisper.messages[0];
    const isExpired = whisper.expiresAt && new Date(whisper.expiresAt).getTime() <= now;

    return (
        <button
            onClick={onClick}
            className={[
                "w-full text-left rounded-2xl px-5 py-4 border shadow-card transition-colors cursor-pointer",
                isExpired
                    ? "bg-sand-50 border-sand-200 hover:border-sand-300"
                    : "bg-white border-sand-300 hover:border-terracotta-300",
            ].join(" ")}
        >
            <div className="flex justify-between items-start mb-1">
                <div>
                    <span className={`text-sm font-semibold ${isExpired ? "text-sand-400" : "text-sand-900"}`}>
                        Purrlynonymous{showOtherId && otherDisplayId ? `-${otherDisplayId}` : ""}
                    </span>
                    <p className={`text-[10px] mt-0.5 ${isExpired ? "text-sand-300" : "text-sand-400"}`}>
                        Started {new Date(whisper.createdAt).toLocaleDateString([], { month: "short", day: "numeric", year: "numeric" })}
                    </p>
                </div>
                {isExpired ? (
                    <span className="text-[11px] text-sand-400 font-medium">Expired</span>
                ) : whisper.expiresAt ? (
                    <CountdownTimer expiresAt={new Date(whisper.expiresAt).getTime()} />
                ) : null}
            </div>
            {lastMessage && (
                <p className={`text-sm truncate ${isExpired ? "text-sand-400" : "text-sand-600"}`}>
                    {lastMessage.text}
                </p>
            )}
        </button>
    );
};

export default WhisperActiveCard;
