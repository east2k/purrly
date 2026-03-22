"use client";

import { useState, useEffect, useCallback } from "react";

type CountdownTimerProps = {
    expiresAt: number;
};

const getRemaining = (expiresAt: number) => {
    const remaining = Math.max(0, expiresAt - Date.now());
    const hours = Math.floor(remaining / (1000 * 60 * 60));
    const minutes = Math.floor((remaining % (1000 * 60 * 60)) / (1000 * 60));
    return { remaining, hours, minutes };
};

const CountdownTimer = ({ expiresAt }: CountdownTimerProps) => {
    const [tick, setTick] = useState(0);

    const bump = useCallback(() => setTick((t) => t + 1), []);

    useEffect(() => {
        const interval = setInterval(bump, 60000);
        return () => clearInterval(interval);
    }, [bump]);

    void tick;
    const { remaining, hours, minutes } = getRemaining(expiresAt);

    if (remaining <= 0) {
        return <span className="text-xs text-sand-500 italic">Expired</span>;
    }

    return (
        <span className="text-xs text-sand-500">
            {hours}h {minutes}m remaining
        </span>
    );
};

export default CountdownTimer;
