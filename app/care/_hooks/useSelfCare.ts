import { useState, useEffect, useCallback } from "react";
import type { CareState, SelfCareKey } from "@/types";

type SelfCareData = CareState & { streak: number };

const useSelfCare = () => {
    const [care, setCare] = useState<CareState>({ water: 0, sleep: 0 });
    const [streak, setStreak] = useState(0);
    const [loading, setLoading] = useState(true);

    const fetchToday = useCallback(async () => {
        const res = await fetch("/api/selfcare");
        if (!res.ok) return;
        const data: SelfCareData = await res.json();
        setCare({ water: data.water, sleep: data.sleep });
        setStreak(data.streak);
        setLoading(false);
    }, []);

    useEffect(() => {
        fetchToday();
    }, [fetchToday]);

    const handleCareChange = async (key: SelfCareKey, value: number) => {
        setCare((prev) => ({ ...prev, [key]: value }));
        await fetch("/api/selfcare", {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ [key]: value }),
        });
    };

    return { care, streak, loading, handleCareChange };
};

export default useSelfCare;
