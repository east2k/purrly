import { useState, useEffect } from "react";
import type { ApiWhisper, ApiWhisperMemory } from "@/types";

const useWhispers = () => {
    const [whispers, setWhispers] = useState<ApiWhisper[]>([]);
    const [memories, setMemories] = useState<ApiWhisperMemory[]>([]);
    const [loading, setLoading] = useState(true);
    const [tick, setTick] = useState(0);

    useEffect(() => {
        let cancelled = false;
        const run = async () => {
            const [wRes, mRes] = await Promise.all([
                fetch("/api/whispers"),
                fetch("/api/whispers/memories"),
            ]);
            if (cancelled) return;
            if (wRes.ok) setWhispers(await wRes.json());
            if (mRes.ok) setMemories(await mRes.json());
            setLoading(false);
        };
        run();
        return () => { cancelled = true; };
    }, [tick]);

    const refresh = () => setTick((t) => t + 1);

    const acceptRequest = async (whisperId: number) => {
        const res = await fetch(`/api/whispers/${whisperId}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ action: "accept" }),
        });
        if (res.ok) refresh();
    };

    const declineRequest = async (whisperId: number) => {
        const res = await fetch(`/api/whispers/${whisperId}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ action: "decline" }),
        });
        if (res.ok) refresh();
    };

    const extendWhisper = async (whisperId: number): Promise<boolean> => {
        const res = await fetch(`/api/whispers/${whisperId}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ action: "extend" }),
        });
        if (res.ok) refresh();
        return res.ok;
    };

    const reconnect = async (memoryId: number): Promise<boolean> => {
        const res = await fetch("/api/reconnect", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ memoryId }),
        });
        return res.ok;
    };

    return { whispers, memories, loading, acceptRequest, declineRequest, extendWhisper, reconnect };
};

export default useWhispers;
