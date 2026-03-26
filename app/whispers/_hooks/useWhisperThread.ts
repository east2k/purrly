"use client";

import { useState, useEffect } from "react";
import { getPusherClient } from "@/lib/pusher";
import type { ApiWhisper, ApiWhisperMessage } from "@/types";

export const MESSAGE_LIMIT = 15;

const useWhisperThread = (whisper: ApiWhisper, currentUserId: string) => {
    const [messages, setMessages] = useState<ApiWhisperMessage[]>([]);
    const [loadingMessages, setLoadingMessages] = useState(true);
    const [threadExpired, setThreadExpired] = useState(() =>
        !!whisper.expiresAt && new Date(whisper.expiresAt).getTime() <= Date.now()
    );
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

    const otherDisplayId =
        whisper.participantOneId === currentUserId
            ? whisper.participantTwo.displayId
            : whisper.participantOne.displayId;

    const otherIsRequester = whisper.requestedById !== currentUserId;
    const showOtherId = otherIsRequester ? whisper.requestedByRevealId : true;

    const iReported = reportedById === currentUserId;
    const iWasReported = reportedById !== null && reportedById !== currentUserId;
    const messagingBlocked = reportedById !== null && !messagingAllowed;
    const iExtended = extensionRequestedById === currentUserId;

    useEffect(() => {
        const load = async () => {
            const res = await fetch(`/api/whispers/${whisper.id}/messages?limit=${MESSAGE_LIMIT}`);
            if (res.status === 404) {
                setThreadExpired(true);
                setLoadingMessages(false);
                return;
            }
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

    const loadMore = async (scrollEl: HTMLDivElement | null) => {
        if (loadingMore || !hasMore || messages.length === 0) return;
        const oldestId = messages[0].id;
        setLoadingMore(true);
        const res = await fetch(`/api/whispers/${whisper.id}/messages?limit=${MESSAGE_LIMIT}&before=${oldestId}`);
        if (res.ok) {
            const older: ApiWhisperMessage[] = await res.json();
            const prevScrollHeight = scrollEl?.scrollHeight ?? 0;
            setMessages((prev) => [...older, ...prev]);
            setHasMore(older.length === MESSAGE_LIMIT);
            requestAnimationFrame(() => {
                if (scrollEl) scrollEl.scrollTop = scrollEl.scrollHeight - prevScrollHeight;
            });
        }
        setLoadingMore(false);
    };

    return {
        messages,
        loadingMessages,
        threadExpired,
        loadingMore,
        hasMore,
        messageText,
        setMessageText,
        extensionStatus,
        expiresAt,
        reportedById,
        messagingAllowed,
        reportPrompt,
        setReportPrompt,
        actioning,
        otherDisplayId,
        showOtherId,
        iReported,
        iWasReported,
        messagingBlocked,
        iExtended,
        callAction,
        handleSend,
        handleReport,
        handleToggleMessaging,
        loadMore,
    };
};

export default useWhisperThread;
