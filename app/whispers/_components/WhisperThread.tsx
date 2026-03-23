"use client";

import { useState, useEffect, useRef } from "react";
import { ArrowLeft, Flag } from "lucide-react";
import CountdownTimer from "./CountdownTimer";
import ReportButton from "@/app/_components/ReportButton";
import { getPusherClient } from "@/lib/pusher";
import type { ApiWhisper, ApiWhisperMessage } from "@/types";

const MESSAGE_LIMIT = 15;

type WhisperThreadProps = {
    whisper: ApiWhisper;
    currentUserId: string;
    onBack: () => void;
};

const WhisperThread = ({ whisper, currentUserId, onBack }: WhisperThreadProps) => {
    const [messages, setMessages] = useState<ApiWhisperMessage[]>([]);
    const [loadingMessages, setLoadingMessages] = useState(true);
    const [loadingMore, setLoadingMore] = useState(false);
    const [hasMore, setHasMore] = useState(false);
    const [messageText, setMessageText] = useState("");
    const [extensionStatus, setExtensionStatus] = useState(whisper.extensionStatus);
    const [extensionRequestedById, setExtensionRequestedById] = useState(whisper.extensionRequestedById);
    const [expiresAt, setExpiresAt] = useState(whisper.expiresAt);
    const [reportedById, setReportedById] = useState(whisper.reportedById);
    const [messagingAllowed, setMessagingAllowed] = useState(whisper.messagingAllowed);
    const [reportPrompt, setReportPrompt] = useState(false);
    const [actioning, setActioning] = useState(false);
    const scrollRef = useRef<HTMLDivElement>(null);
    const bottomRef = useRef<HTMLDivElement>(null);

    const otherDisplayId =
        whisper.participantOneId === currentUserId
            ? whisper.participantTwo.displayId
            : whisper.participantOne.displayId;

    const iReported = reportedById === currentUserId;
    const iWasReported = reportedById !== null && reportedById !== currentUserId;
    const messagingBlocked = reportedById !== null && !messagingAllowed;

    useEffect(() => {
        const load = async () => {
            const res = await fetch(`/api/whispers/${whisper.id}/messages?limit=${MESSAGE_LIMIT}`);
            if (res.ok) {
                const data: ApiWhisperMessage[] = await res.json();
                setMessages(data);
                setHasMore(data.length === MESSAGE_LIMIT);
            }
            setLoadingMessages(false);
        };
        load();
    }, [whisper.id]);

    useEffect(() => {
        if (!loadingMessages) {
            bottomRef.current?.scrollIntoView({ behavior: "instant" });
        }
    }, [loadingMessages]);

    useEffect(() => {
        if (loadingMessages) return;
        const el = scrollRef.current;
        if (!el) return;
        const nearBottom = el.scrollHeight - el.scrollTop - el.clientHeight < 120;
        if (nearBottom) bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages, loadingMessages]);

    useEffect(() => {
        const client = getPusherClient();
        const channel = client.subscribe(`whisper-${whisper.id}`);
        channel.bind("new-message", (msg: ApiWhisperMessage) => {
            setMessages((prev) => {
                if (prev.some((m) => m.id === msg.id)) return prev;
                return [...prev, msg];
            });
        });
        channel.bind("extension-update", (data: {
            extensionStatus: "PENDING" | "ACCEPTED" | "DECLINED";
            extensionRequestedById: string;
            expiresAt?: string;
        }) => {
            setExtensionStatus(data.extensionStatus);
            setExtensionRequestedById(data.extensionRequestedById);
            if (data.expiresAt) setExpiresAt(data.expiresAt);
        });
        channel.bind("report-update", (data: { reportedById: string; messagingAllowed: boolean }) => {
            setReportedById(data.reportedById);
            setMessagingAllowed(data.messagingAllowed);
        });
        return () => {
            channel.unbind_all();
            client.unsubscribe(`whisper-${whisper.id}`);
        };
    }, [whisper.id]);

    const loadMore = async () => {
        if (loadingMore || !hasMore || messages.length === 0) return;
        const oldestId = messages[0].id;
        setLoadingMore(true);
        const res = await fetch(`/api/whispers/${whisper.id}/messages?limit=${MESSAGE_LIMIT}&before=${oldestId}`);
        if (res.ok) {
            const older: ApiWhisperMessage[] = await res.json();
            const el = scrollRef.current;
            const prevScrollHeight = el?.scrollHeight ?? 0;
            setMessages((prev) => [...older, ...prev]);
            setHasMore(older.length === MESSAGE_LIMIT);
            requestAnimationFrame(() => {
                if (el) el.scrollTop = el.scrollHeight - prevScrollHeight;
            });
        }
        setLoadingMore(false);
    };

    const handleScroll = () => {
        const el = scrollRef.current;
        if (el && el.scrollTop < 60) loadMore();
    };

    const handleSend = async () => {
        if (!messageText.trim() || messagingBlocked) return;
        const text = messageText.trim();
        setMessageText("");
        const res = await fetch(`/api/whispers/${whisper.id}/messages`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ text }),
        });
        if (res.ok) {
            const newMsg: ApiWhisperMessage = await res.json();
            setMessages((prev) => prev.some((m) => m.id === newMsg.id) ? prev : [...prev, newMsg]);
        }
    };

    const callAction = async (action: string, extra?: Record<string, unknown>) => {
        setActioning(true);
        const res = await fetch(`/api/whispers/${whisper.id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ action, ...extra }),
        });
        setActioning(false);
        return res.ok;
    };

    const handleReport = async (allowMessaging: boolean) => {
        const ok = await callAction("report", { messagingAllowed: allowMessaging });
        if (ok) {
            setReportedById(currentUserId);
            setMessagingAllowed(allowMessaging);
            setReportPrompt(false);
        }
    };

    const handleToggleMessaging = async () => {
        const ok = await callAction("toggle-messaging");
        if (ok) setMessagingAllowed((prev) => !prev);
    };

    const iExtended = extensionRequestedById === currentUserId;

    const renderExtensionArea = () => {
        if (!extensionStatus) {
            return (
                <button
                    onClick={() => callAction("extend")}
                    disabled={actioning}
                    className="text-xs text-terracotta-400 hover:text-terracotta-500 transition-colors cursor-pointer font-body disabled:opacity-50"
                >
                    {actioning ? "Sending..." : "Request more time"}
                </button>
            );
        }
        if (extensionStatus === "PENDING" && iExtended) {
            return <p className="text-xs text-sand-400 italic">Extension requested, waiting for a response</p>;
        }
        if (extensionStatus === "PENDING" && !iExtended) {
            return (
                <div className="flex gap-2">
                    <button onClick={() => callAction("accept-extension")} disabled={actioning} className="text-xs text-terracotta-400 hover:text-terracotta-500 transition-colors cursor-pointer font-body disabled:opacity-50">Accept</button>
                    <button onClick={() => callAction("decline-extension")} disabled={actioning} className="text-xs text-sand-400 hover:text-sand-600 transition-colors cursor-pointer font-body disabled:opacity-50">Decline</button>
                </div>
            );
        }
        if (extensionStatus === "ACCEPTED" || extensionStatus === "DECLINED") {
            return (
                <p className="text-xs text-sand-400 italic">
                    {iExtended ? "The other person has responded to your request" : extensionStatus === "ACCEPTED" ? "You accepted this extension request" : "You declined this extension request"}
                </p>
            );
        }
        return null;
    };

    return (
        <div className="flex flex-col">
            {/* Header */}
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
                        <button
                            onClick={handleToggleMessaging}
                            disabled={actioning}
                            className={[
                                "text-xs transition-colors cursor-pointer font-body disabled:opacity-50",
                                messagingAllowed ? "text-sand-400 hover:text-sand-600" : "text-terracotta-400 hover:text-terracotta-500",
                            ].join(" ")}
                        >
                            {messagingAllowed ? "Disable messaging" : "Allow messaging"}
                        </button>
                    )}
                    {!reportedById && (
                        <button
                            onClick={() => setReportPrompt(true)}
                            className="text-sand-300 hover:text-terracotta-400 transition-colors cursor-pointer"
                            title="Report user"
                        >
                            <Flag size={14} />
                        </button>
                    )}
                    {renderExtensionArea()}
                </div>
            </div>

            {/* Report prompt */}
            {reportPrompt && (
                <div className="mb-4 border border-sand-200 rounded-xl p-4 bg-sand-50">
                    <p className="text-sm font-medium text-sand-900 mb-1">Report this user?</p>
                    <p className="text-xs text-sand-500 mb-3">Would you like to allow or disable messaging after reporting?</p>
                    <div className="flex flex-col gap-2">
                        <button
                            onClick={() => handleReport(true)}
                            disabled={actioning}
                            className="w-full py-2 text-xs font-medium text-sand-700 bg-white border border-sand-200 rounded-lg hover:border-sand-300 transition-colors cursor-pointer disabled:opacity-50"
                        >
                            Report — Allow messaging
                        </button>
                        <button
                            onClick={() => handleReport(false)}
                            disabled={actioning}
                            className="w-full py-2 text-xs font-medium text-white bg-terracotta-400 rounded-lg hover:bg-terracotta-500 transition-colors cursor-pointer disabled:opacity-50"
                        >
                            Report — Disable messaging
                        </button>
                        <button
                            onClick={() => setReportPrompt(false)}
                            className="text-xs text-sand-400 hover:text-sand-600 transition-colors cursor-pointer mt-1"
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            )}

            {/* Messaging blocked banner (shown to the reported user) */}
            {messagingBlocked && iWasReported && (
                <div className="mb-4 px-4 py-3 bg-sand-100 rounded-xl text-xs text-sand-500 text-center">
                    This user no longer wants to message.
                </div>
            )}

            {/* Messages */}
            <div ref={scrollRef} onScroll={handleScroll} className="h-[50vh] overflow-y-auto space-y-3 mb-4 pr-1">
                {loadingMore && <p className="text-center text-xs text-sand-400 py-2">Loading older messages...</p>}

                {loadingMessages ? (
                    <>
                        {[false, true, false, true].map((isMine, i) => (
                            <div key={i} className={`flex ${isMine ? "justify-end" : "justify-start"} animate-pulse`}>
                                <div className={`h-9 rounded-2xl bg-sand-200 ${isMine ? "w-2/5 rounded-br-sm" : "w-3/5 rounded-bl-sm"}`} />
                            </div>
                        ))}
                    </>
                ) : null}

                {!loadingMessages && messages.map((m) => {
                    const isMine = m.senderId === currentUserId;
                    return (
                        <div key={m.id} className={`flex ${isMine ? "justify-end" : "justify-start"}`}>
                            <div className={["max-w-[75%] px-4 py-2.5 rounded-2xl", isMine ? "bg-terracotta-400 text-white rounded-br-sm" : "bg-sand-100 text-sand-900 rounded-bl-sm"].join(" ")}>
                                <p className="text-sm leading-relaxed">{m.text}</p>
                                <div className={`flex items-center gap-2 mt-1 ${isMine ? "justify-end" : "justify-start"}`}>
                                    <span className={`text-[10px] ${isMine ? "text-white/60" : "text-sand-500"}`}>
                                        {new Date(m.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                                    </span>
                                    {!isMine && !reportedById && (
                                        <ReportButton contentType="WHISPER_MESSAGE" contentId={m.id} />
                                    )}
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

            {/* Input */}
            <div className="flex gap-2">
                <input
                    className="flex-1 px-4 py-2.5 border border-sand-300 rounded-[10px] text-sm bg-sand-50 text-sand-900 outline-none focus:border-terracotta-400 font-body placeholder:text-sand-500 disabled:opacity-50 disabled:cursor-not-allowed"
                    placeholder={messagingBlocked ? "Messaging is disabled" : "Say something gentle..."}
                    value={messageText}
                    onChange={(e) => setMessageText(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleSend()}
                    disabled={messagingBlocked}
                />
                <button
                    onClick={handleSend}
                    disabled={!messageText.trim() || messagingBlocked}
                    className="px-5 py-2.5 bg-terracotta-400 text-white text-sm font-medium rounded-[10px] disabled:opacity-40 hover:bg-terracotta-500 transition-colors cursor-pointer font-body"
                >
                    Send
                </button>
            </div>
        </div>
    );
};

export default WhisperThread;
