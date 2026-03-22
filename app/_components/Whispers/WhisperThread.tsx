"use client";

import { useState } from "react";
import { ArrowLeft } from "lucide-react";
import CountdownTimer from "./CountdownTimer";
import ReportButton from "../ReportButton";
import type { Whisper } from "@/types";

type WhisperThreadProps = {
    whisper: Whisper;
    currentUserId: string;
    onBack: () => void;
};

const WhisperThread = ({ whisper, currentUserId, onBack }: WhisperThreadProps) => {
    const [messageText, setMessageText] = useState("");
    const [messages, setMessages] = useState(whisper.messages);

    const otherDisplayId =
        whisper.participantOneId === currentUserId
            ? whisper.participantTwoDisplayId
            : whisper.participantOneDisplayId;

    const handleSend = () => {
        if (!messageText.trim()) return;
        setMessages([
            ...messages,
            {
                id: Date.now(),
                senderId: currentUserId,
                senderDisplayId: "7382",
                text: messageText.trim(),
                timestamp: Date.now(),
            },
        ]);
        setMessageText("");
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
                    <CountdownTimer expiresAt={whisper.expiresAt} />
                </div>
                {!whisper.extended && (
                    <button className="text-xs text-terracotta-400 hover:text-terracotta-500 transition-colors cursor-pointer font-body">
                        Request more time
                    </button>
                )}
            </div>

            <div className="flex-1 space-y-3 mb-4 overflow-y-auto">
                {messages.map((m) => {
                    const isMine = m.senderId === currentUserId;
                    return (
                        <div
                            key={m.id}
                            className={`flex ${isMine ? "justify-end" : "justify-start"}`}
                        >
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
                                        {new Date(m.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                                    </span>
                                    {!isMine && (
                                        <ReportButton contentType="whisper_message" contentId={m.id} />
                                    )}
                                </div>
                            </div>
                        </div>
                    );
                })}
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
