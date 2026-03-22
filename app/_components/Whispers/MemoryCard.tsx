"use client";

import { UserRound } from "lucide-react";
import type { ApiWhisperMemory } from "@/types";

type MemoryCardProps = {
    memory: ApiWhisperMemory;
    currentUserId: string;
    onReconnect: (memoryId: number) => void;
};

const MemoryCard = ({ memory, currentUserId, onReconnect }: MemoryCardProps) => {
    const otherDisplayId =
        memory.whisper.participantOneId === currentUserId
            ? memory.whisper.participantTwo.displayId
            : memory.whisper.participantOne.displayId;

    const lastMessage = memory.whisper.messages[0];
    const savedDate = new Date(memory.savedAt).toLocaleDateString(undefined, {
        month: "short",
        day: "numeric",
    });

    return (
        <div className="bg-white rounded-2xl px-5 py-4 border border-sand-300 shadow-card">
            <div className="flex items-center gap-3 mb-3">
                <div className="w-9 h-9 rounded-full bg-sand-200 flex items-center justify-center shrink-0">
                    <UserRound size={17} className="text-sand-500" />
                </div>
                <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-sand-900">
                        Purrlynonymous-{otherDisplayId}
                    </p>
                    <p className="text-xs text-sand-500">Saved {savedDate}</p>
                </div>
            </div>

            {lastMessage && (
                <p className="text-sm text-sand-600 mb-3 line-clamp-2 italic">
                    &ldquo;{lastMessage.text}&rdquo;
                </p>
            )}

            <p className="text-xs text-sand-500 mb-3">
                This whisper has faded. Want to reconnect?
            </p>

            <button
                onClick={() => onReconnect(memory.id)}
                className="w-full py-2 bg-terracotta-50 text-terracotta-600 text-sm font-medium rounded-[10px] hover:bg-terracotta-100 transition-colors cursor-pointer font-body border border-terracotta-200"
            >
                Reconnect
            </button>
        </div>
    );
};

export default MemoryCard;
