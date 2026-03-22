"use client";

import { useState, useEffect, useRef } from "react";
import { ArrowLeft } from "lucide-react";
import CountdownTimer from "./CountdownTimer";
import ReportButton from "@/app/_components/ReportButton";
import type { ApiWhisper, ApiWhisperMessage } from "@/types";

type WhisperThreadProps = {
    whisper: ApiWhisper;
    currentUserId: string;
    onBack: () => void;
    onExtend: () => Promise<boolean>;
};

const WhisperThread = ({ whisper, currentUserId, onBack, onExtend }: WhisperThreadProps) => {
    const [messages, setMessages] = useState<ApiWhisperMessage[]>([]);
    const [messageText, setMessageText] = useState("");
    const [extending, setExtending] = useState(false);
    const [extended, setExtended] = useState(whisper.extended);
    const bottomRef = useRef<HTMLDivElement>(null);

    const otherDisplayId =
        whisper.participantOneId === currentUserId
            ? whisper.participantTwo.displayId
            : whisper.participantOne.displayId;

    useEffect(() => {
        const load = async () => {
            const res = await fetch(`/api/whispers/${whisper.id}/messages`);
            if (res.ok) setMessages(await res.json());
        };
        load();
    }, [whisper.id]);

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    const handleSend = async () => {
        if (!messageText.trim()) return;
        const text = messageText.trim();
        setMessageText("");

        const res = await fetch(`/api/whispers/${whisper.id}/messages`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ text }),
        });

        if (res.ok) {
            const newMsg: ApiWhisperMessage = await res.json();
            setMessages((prev) => [...prev, newMsg]);
        }
    };

    const handleExtend = async () => {
        setExtending(true);
        const ok = await onExtend();
        if (ok) setExtended(true);
        setExtending(false);
    };

    return (
        <div className="flex flex-col h-full">
            <div className="flex items-center gap-3 mb-4">
                <button
                    onClick={onBack}
                    className="text-sand-500 hover:text-sand-700 transition-colors cursor-pointer"
                >
                    <ArrowLeft size={20} />
                </button>
                <div className="flex-1">
                    <p className="text-sm font-semibold text-sand-900">
                        Purrlynonymous-{otherDisplayId}
                    </p>
                    {whisper.expiresAt && (
                        <CountdownTimer expiresAt={new Date(whisper.expiresAt).getTime()} />
                    )}
                </div>
                {!extended && (
                    <button
                        onClick={handleExtend}
                        disabled={extending}
                        className="text-xs text-terracotta-400 hover:text-terracotta-500 transition-colors cursor-pointer font-body disabled:opacity-50"
                    >
                        {extending ? "Requesting..." : "Request more time"}
                    </button>
                )}
            </div>

            <div className="flex-1 space-y-3 mb-4 overflow-y-auto">
                {messages.map((m) => {
                    const isMine = m.senderId === currentUserId;
                    return (
                        <div key={m.id} className={`flex ${isMine ? "justify-end" : "justify-start"}`}>
                            <div
                                className={[
                                    "max-w-[75%] px-4 py-2.5 rounded-2xl",
                                    isMine
                                        ? "bg-terracotta-400 text-white rounded-br-sm"
                                        : "bg-sand-100 text-sand-900 rounded-bl-sm",
                                ].join(" ")}
                            >
                                <p className="text-sm leading-relaxed">{m.text}</p>
                                <div className={`flex items-center gap-2 mt-1 ${isMine ? "justify-end" : "justify-start"}`}>
                                    <span className={`text-[10px] ${isMine ? "text-white/60" : "text-sand-500"}`}>
                                        {new Date(m.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                                    </span>
                                    {!isMine && (
                                        <ReportButton contentType="WHISPER_MESSAGE" contentId={m.id} />
                                    )}
                                </div>
                            </div>
                        </div>
                    );
                })}
                <div ref={bottomRef} />
            </div>

            <div className="flex gap-2">
                <input
                    className="flex-1 px-4 py-2.5 border border-sand-300 rounded-[10px] text-sm bg-sand-50 text-sand-900 outline-none focus:border-terracotta-400 font-body placeholder:text-sand-500"
                    placeholder="Say something gentle..."
                    value={messageText}
                    onChange={(e) => setMessageText(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleSend()}
                />
                <button
                    onClick={handleSend}
                    disabled={!messageText.trim()}
                    className="px-5 py-2.5 bg-terracotta-400 text-white text-sm font-medium rounded-[10px] disabled:opacity-40 hover:bg-terracotta-500 transition-colors cursor-pointer font-body"
                >
                    Send
                </button>
            </div>
        </div>
    );
};

export default WhisperThread;
