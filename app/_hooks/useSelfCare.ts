import { useState } from "react";
import type { CareState, SelfCareKey } from "@/types";

const useSelfCare = () => {
    const [care, setCare] = useState<CareState>({ water: 3, sleep: 6 });

    const handleCareChange = (key: SelfCareKey, value: number) => {
        setCare({ ...care, [key]: value });
    };

    return { care, handleCareChange };
};

export default useSelfCare;
