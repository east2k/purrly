"use client";

import { useState } from "react";
import {
    SAMPLE_WHISPERS,
    SAMPLE_WHISPER_REQUESTS,
    SAMPLE_WHISPER_MEMORIES,
} from "@/app/_constants";
import type { Whisper } from "@/types";
import WhisperThread from "./WhisperThread";
import MemoryCard from "./MemoryCard";
import WhisperRequestCard from "./WhisperRequestCard";
import CountdownTimer from "./CountdownTimer";

type SubTab = "active" | "requests" | "memories";

type WhispersTabProps = {
    currentUserId: string;
};

const SUB_TAB_LABELS: Record<SubTab, string> = {
    active: "Active",
    requests: "Requests",
    memories: "Memories",
};

const WhispersTab = ({ currentUserId }: WhispersTabProps) => {
    const [subTab, setSubTab] = useState<SubTab>("active");
    const [openThread, setOpenThread] = useState<Whisper | null>(null);
    const [requests, setRequests] = useState(SAMPLE_WHISPER_REQUESTS);

    if (openThread) {
        return (
            <WhisperThread
                whisper={openThread}
                currentUserId={currentUserId}
                onBack={() => setOpenThread(null)}
            />
        );
    }

    const requestCount = requests.length;

    return (
        <div>
            <div className="flex gap-1 bg-sand-100 rounded-lg p-1 mb-5">
                {(["active", "requests", "memories"] as const).map((t) => (
                    <button
                        key={t}
                        onClick={() => setSubTab(t)}
                        className={[
                            "relative flex-1 py-2 rounded-md text-xs font-medium transition-all cursor-pointer border-none font-body",
                            subTab === t
                                ? "bg-white text-sand-900 shadow-sm"
                                : "bg-transparent text-sand-600 hover:text-sand-900",
                        ].join(" ")}
                    >
                        {SUB_TAB_LABELS[t]}
                        {t === "requests" && requestCount > 0 && (
                            <span className="ml-1.5 inline-flex items-center justify-center w-4 h-4 text-[10px] font-bold bg-terracotta-400 text-white rounded-full">
                                {requestCount}
                            </span>
                        )}
                    </button>
                ))}
            </div>

            {subTab === "active" && (
                <div className="space-y-3">
                    {SAMPLE_WHISPERS.length === 0 ? (
                        <div className="text-center py-12">
                            <p className="text-sm text-sand-500">
                                No active whispers. Start one from a comment in the vent feed.
                            </p>
                        </div>
                    ) : (
                        SAMPLE_WHISPERS.map((w) => {
                            const otherDisplayId =
                                w.participantOneId === currentUserId
                                    ? w.participantTwoDisplayId
                                    : w.participantOneDisplayId;
                            const lastMessage = w.messages[w.messages.length - 1];
                            return (
                                <button
                                    key={w.id}
                                    onClick={() => setOpenThread(w)}
                                    className="w-full text-left bg-white rounded-2xl px-5 py-4 border border-sand-300 shadow-card hover:border-terracotta-300 transition-colors cursor-pointer"
                                >
                                    <div className="flex justify-between items-center mb-1">
                                        <span className="text-sm font-semibold text-sand-900">
                                            Purrlynonymous-{otherDisplayId}
                                        </span>
                                        <CountdownTimer expiresAt={w.expiresAt} />
                                    </div>
                                    {lastMessage && (
                                        <p className="text-sm text-sand-600 truncate">
                                            {lastMessage.text}
                                        </p>
                                    )}
                                </button>
                            );
                        })
                    )}
                </div>
            )}

            {subTab === "requests" && (
                <div className="space-y-3">
                    {requests.length === 0 ? (
                        <div className="text-center py-12">
                            <p className="text-sm text-sand-500">
                                No pending requests.
                            </p>
                        </div>
                    ) : (
                        requests.map((r) => {
                            const otherDisplayId =
                                r.requestedById === currentUserId
                                    ? (r.participantOneId === currentUserId
                                        ? r.participantTwoDisplayId
                                        : r.participantOneDisplayId)
                                    : (r.participantOneId === r.requestedById
                                        ? r.participantOneDisplayId
                                        : r.participantTwoDisplayId);
                            return (
                                <WhisperRequestCard
                                    key={r.id}
                                    displayId={otherDisplayId}
                                    createdAt={r.createdAt}
                                    onAccept={() =>
                                        setRequests(requests.filter((req) => req.id !== r.id))
                                    }
                                    onDecline={() =>
                                        setRequests(requests.filter((req) => req.id !== r.id))
                                    }
                                />
                            );
                        })
                    )}
                </div>
            )}

            {subTab === "memories" && (
                <div className="space-y-3">
                    {SAMPLE_WHISPER_MEMORIES.length === 0 ? (
                        <div className="text-center py-12">
                            <p className="text-sm text-sand-500">
                                No saved memories yet.
                            </p>
                        </div>
                    ) : (
                        SAMPLE_WHISPER_MEMORIES.map((m) => (
                            <MemoryCard
                                key={m.id}
                                memory={m}
                                currentUserId={currentUserId}
                                onReconnect={(memoryId) =>
                                    console.log("Reconnect requested for memory:", memoryId)
                                }
                            />
                        ))
                    )}
                </div>
            )}
        </div>
    );
};

export default WhispersTab;
