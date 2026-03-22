"use client";

import { UserRound } from "lucide-react";
import { timeAgo } from "@/app/_utils/time";

type WhisperRequestCardProps = {
    displayId: string | null;
    createdAt: string;
    onAccept: () => void;
    onDecline: () => void;
};

const WhisperRequestCard = ({ displayId, createdAt, onAccept, onDecline }: WhisperRequestCardProps) => (
    <div className="bg-white rounded-2xl px-5 py-4 border border-sand-300 shadow-card">
        <div className="flex items-center gap-3 mb-3">
            <div className="w-9 h-9 rounded-full bg-sand-200 flex items-center justify-center shrink-0">
                <UserRound size={17} className="text-sand-500" />
            </div>
            <div>
                <p className="text-sm font-semibold text-sand-900">
                    Purrlynonymous-{displayId}
                </p>
                <p className="text-xs text-sand-500">wants to whisper with you</p>
            </div>
            <span className="text-xs text-sand-500 ml-auto">{timeAgo(new Date(createdAt).getTime())}</span>
        </div>
        <div className="flex gap-2">
            <button
                onClick={onAccept}
                className="flex-1 py-2 bg-terracotta-400 text-white text-sm font-medium rounded-[10px] hover:bg-terracotta-500 transition-colors cursor-pointer font-body"
            >
                Accept
            </button>
            <button
                onClick={onDecline}
                className="flex-1 py-2 bg-sand-100 text-sand-600 text-sm font-medium rounded-[10px] hover:bg-sand-200 transition-colors cursor-pointer font-body"
            >
                Decline
            </button>
        </div>
    </div>
);

export default WhisperRequestCard;
