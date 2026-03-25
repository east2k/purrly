"use client";

import { useEffect, useRef } from "react";
import { ArrowLeft, Flag } from "lucide-react";
import CountdownTimer from "@/app/whispers/_components/Thread/CountdownTimer";
import WhisperReportPrompt from "@/app/whispers/_components/Thread/WhisperReportPrompt";
import ReportButton from "@/app/_components/ReportButton";
import useWhisperThread from "@/app/whispers/_hooks/useWhisperThread";
import type { ApiWhisper } from "@/types";

type WhisperThreadProps = {
    whisper: ApiWhisper;
    currentUserId: string;
    onBack: () => void;
};

const WhisperThread = ({ whisper, currentUserId, onBack }: WhisperThreadProps) => {
    const scrollRef = useRef<HTMLDivElement>(null);
    const bottomRef = useRef<HTMLDivElement>(null);

    const {
        messages, loadingMessages, threadExpired, loadingMore,
        messageText, setMessageText, extensionStatus, expiresAt,
        reportedById, messagingAllowed, reportPrompt, setReportPrompt,
        actioning, otherDisplayId, iReported, iWasReported, messagingBlocked,
        iExtended, callAction, handleSend, handleReport, handleToggleMessaging, loadMore,
    } = useWhisperThread(whisper, currentUserId);

    useEffect(() => {
        if (!loadingMessages) bottomRef.current?.scrollIntoView({ behavior: "instant" });
    }, [loadingMessages]);

    useEffect(() => {
        if (loadingMessages) return;
        const el = scrollRef.current;
        if (!el) return;
        if (el.scrollHeight - el.scrollTop - el.clientHeight < 120)
            bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages, loadingMessages]);

    const handleScroll = () => {
        const el = scrollRef.current;
        if (el && el.scrollTop < 60) loadMore(el);
    };

    const renderExtensionArea = () => {
        if (!extensionStatus) return (
            <button onClick={() => callAction("extend")} disabled={actioning}
                className="text-xs text-terracotta-400 hover:text-terracotta-500 transition-colors cursor-pointer font-body disabled:opacity-50">
                {actioning ? "Sending..." : "Request more time"}
            </button>
        );
        if (extensionStatus === "PENDING" && iExtended)
            return <p className="text-xs text-sand-400 italic">Extension requested, waiting for a response</p>;
        if (extensionStatus === "PENDING" && !iExtended) return (
            <div className="flex gap-2">
                <button onClick={() => callAction("accept-extension")} disabled={actioning} className="text-xs text-terracotta-400 hover:text-terracotta-500 transition-colors cursor-pointer font-body disabled:opacity-50">Accept</button>
                <button onClick={() => callAction("decline-extension")} disabled={actioning} className="text-xs text-sand-400 hover:text-sand-600 transition-colors cursor-pointer font-body disabled:opacity-50">Decline</button>
            </div>
        );
        return (
            <p className="text-xs text-sand-400 italic">
                {iExtended ? "The other person has responded to your request" : extensionStatus === "ACCEPTED" ? "You accepted this extension request" : "You declined this extension request"}
            </p>
        );
    };

    return (
        <div className="flex flex-col">
            <div className="flex items-center gap-3 mb-4">
                <button onClick={onBack} className="text-sand-500 hover:text-sand-700 transition-colors cursor-pointer">
                    <ArrowLeft size={20} />
                </button>
                <div className="flex-1">
                    <p className="text-sm font-semibold text-sand-900">Purrlynonymous-{otherDisplayId}</p>
                    {expiresAt && <CountdownTimer expiresAt={new Date(expiresAt).getTime()} />}
                </div>
                <div className="flex items-center gap-3">
                    {iReported && (
                        <button onClick={handleToggleMessaging} disabled={actioning}
                            className={["text-xs transition-colors cursor-pointer font-body disabled:opacity-50", messagingAllowed ? "text-sand-400 hover:text-sand-600" : "text-terracotta-400 hover:text-terracotta-500"].join(" ")}>
                            {messagingAllowed ? "Disable messaging" : "Allow messaging"}
                        </button>
                    )}
                    {!reportedById && (
                        <button onClick={() => setReportPrompt(true)} className="text-sand-300 hover:text-terracotta-400 transition-colors cursor-pointer" title="Report user">
                            <Flag size={14} />
                        </button>
                    )}
                    {renderExtensionArea()}
                </div>
            </div>

            {reportPrompt && <WhisperReportPrompt actioning={actioning} onReport={handleReport} onCancel={() => setReportPrompt(false)} />}

            {messagingBlocked && iWasReported && (
                <div className="mb-4 px-4 py-3 bg-sand-100 rounded-xl text-xs text-sand-500 text-center">
                    This user no longer wants to message.
                </div>
            )}

            <div ref={scrollRef} onScroll={handleScroll} className="h-[50vh] overflow-y-auto space-y-3 mb-4 pr-1">
                {loadingMore && <p className="text-center text-xs text-sand-400 py-2">Loading older messages...</p>}
                {loadingMessages ? (
                    [false, true, false, true].map((isMine, i) => (
                        <div key={i} className={`flex ${isMine ? "justify-end" : "justify-start"} animate-pulse`}>
                            <div className={`h-9 rounded-2xl bg-sand-200 ${isMine ? "w-2/5 rounded-br-sm" : "w-3/5 rounded-bl-sm"}`} />
                        </div>
                    ))
                ) : messages.map((m) => {
                    const isMine = m.senderId === currentUserId;
                    return (
                        <div key={m.id} className={`flex ${isMine ? "justify-end" : "justify-start"}`}>
                            <div className={["max-w-[75%] px-4 py-2.5 rounded-2xl", isMine ? "bg-terracotta-400 text-white rounded-br-sm" : "bg-sand-100 text-sand-900 rounded-bl-sm"].join(" ")}>
                                <p className="text-sm leading-relaxed">{m.text}</p>
                                <div className={`flex items-center gap-2 mt-1 ${isMine ? "justify-end" : "justify-start"}`}>
                                    <span className={`text-[10px] ${isMine ? "text-white/60" : "text-sand-500"}`}>
                                        {new Date(m.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                                    </span>
                                    {!isMine && !reportedById && <ReportButton contentType="WHISPER_MESSAGE" contentId={m.id} dropUp />}
                                </div>
                            </div>
                        </div>
                    );
                })}
                {!loadingMessages && messages.length === 0 && (
                    <p className="text-center text-sm text-sand-400 py-8">No messages yet. Say something gentle.</p>
                )}
                <div ref={bottomRef} />
            </div>

            <div className="flex gap-2">
                <input
                    className="flex-1 px-4 py-2.5 border border-sand-300 rounded-[10px] text-sm bg-sand-50 text-sand-900 outline-none focus:border-terracotta-400 font-body placeholder:text-sand-500 disabled:opacity-50 disabled:cursor-not-allowed"
                    placeholder={threadExpired ? "This chat has expired" : messagingBlocked ? "Messaging is disabled" : "Say something gentle..."}
                    value={messageText}
                    onChange={(e) => setMessageText(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleSend()}
                    disabled={messagingBlocked || threadExpired}
                />
                <button onClick={handleSend} disabled={!messageText.trim() || messagingBlocked || threadExpired}
                    className="px-5 py-2.5 bg-terracotta-400 text-white text-sm font-medium rounded-[10px] disabled:opacity-40 hover:bg-terracotta-500 transition-colors cursor-pointer font-body">
                    Send
                </button>
            </div>
        </div>
    );
};

export default WhisperThread;
