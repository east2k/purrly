"use client";

import { useState } from "react";
import useWhispers from "../_hooks/useWhispers";
import type { ApiWhisper } from "@/types";
import WhisperThread from "./Thread/WhisperThread";
import WhisperActiveCard from "./Cards/WhisperActiveCard";
import WhisperReportedCard from "./Cards/WhisperReportedCard";
import WhisperRequestCard from "./Cards/WhisperRequestCard";
import MemoryCard from "./Cards/MemoryCard";

type SubTab = "active" | "requests" | "memories" | "reported";

type WhispersTabProps = {
    currentUserId: string;
};

const SUB_TAB_LABELS: Record<SubTab, string> = {
    active: "Active",
    requests: "Requests",
    memories: "Memories",
    reported: "Reported",
};

const WhispersTab = ({ currentUserId }: WhispersTabProps) => {
    const [subTab, setSubTab] = useState<SubTab>("active");
    const [openThread, setOpenThread] = useState<ApiWhisper | null>(null);
    const [now] = useState(() => Date.now());
    const { whispers, memories, loading, acceptRequest, declineRequest, reconnect } = useWhispers();

    const active = whispers.filter((w) => w.status === "ACTIVE");
    const incoming = whispers.filter((w) => w.status === "PENDING" && w.requestedById !== currentUserId);
    const reported = whispers.filter((w) => w.reportedById === currentUserId);

    if (openThread) return <WhisperThread whisper={openThread} currentUserId={currentUserId} onBack={() => setOpenThread(null)} />;

    return (
        <div>
            <div className="flex gap-1 bg-sand-100 rounded-lg p-1 mb-5">
                {(["active", "requests", "memories", "reported"] as const).map((t) => (
                    <button key={t} onClick={() => setSubTab(t)}
                        className={["relative flex-1 py-2 rounded-md text-xs font-medium transition-all cursor-pointer border-none font-body", subTab === t ? "bg-white text-sand-900 shadow-sm" : "bg-transparent text-sand-600 hover:text-sand-900"].join(" ")}>
                        {SUB_TAB_LABELS[t]}
                        {t === "requests" && incoming.length > 0 && (
                            <span className="ml-1.5 inline-flex items-center justify-center w-4 h-4 text-[10px] font-bold bg-terracotta-400 text-white rounded-full">
                                {incoming.length}
                            </span>
                        )}
                    </button>
                ))}
            </div>

            {loading ? (
                <div className="space-y-3">
                    {[0, 1, 2].map((i) => (
                        <div key={i} className="bg-white rounded-2xl px-5 py-4 border border-sand-200 shadow-card animate-pulse">
                            <div className="flex justify-between items-center mb-2">
                                <div className="h-3.5 w-36 bg-sand-200 rounded-full" />
                                <div className="h-3 w-14 bg-sand-100 rounded-full" />
                            </div>
                            <div className="h-3 w-3/4 bg-sand-100 rounded-full" />
                        </div>
                    ))}
                </div>
            ) : (
                <>
                    {subTab === "active" && (
                        <div className="space-y-3">
                            {active.length === 0
                                ? <p className="text-center py-12 text-sm text-sand-500">No active whispers. Start one from a comment in the vent feed.</p>
                                : active.map((w) => <WhisperActiveCard key={w.id} whisper={w} currentUserId={currentUserId} now={now} onClick={() => setOpenThread(w)} />)
                            }
                        </div>
                    )}
                    {subTab === "requests" && (
                        <div className="space-y-3">
                            {incoming.length === 0
                                ? <p className="text-center py-12 text-sm text-sand-500">No pending requests.</p>
                                : incoming.map((r) => {
                                    const requesterDisplayId = r.participantOneId === r.requestedById ? r.participantOne.displayId : r.participantTwo.displayId;
                                    return <WhisperRequestCard key={r.id} displayId={requesterDisplayId} revealId={r.requestedByRevealId} createdAt={r.createdAt} onAccept={() => acceptRequest(r.id)} onDecline={() => declineRequest(r.id)} />;
                                })
                            }
                        </div>
                    )}
                    {subTab === "memories" && (
                        <div className="space-y-3">
                            {memories.length === 0
                                ? <p className="text-center py-12 text-sm text-sand-500">No saved memories yet.</p>
                                : memories.map((m) => <MemoryCard key={m.id} memory={m} currentUserId={currentUserId} onReconnect={(memoryId) => reconnect(memoryId)} />)
                            }
                        </div>
                    )}
                    {subTab === "reported" && (
                        <div className="space-y-3">
                            {reported.length === 0
                                ? <p className="text-center py-12 text-sm text-sand-500">No reported whispers.</p>
                                : reported.map((w) => <WhisperReportedCard key={w.id} whisper={w} currentUserId={currentUserId} onClick={() => setOpenThread(w)} />)
                            }
                        </div>
                    )}
                </>
            )}
        </div>
    );
};

export default WhispersTab;
