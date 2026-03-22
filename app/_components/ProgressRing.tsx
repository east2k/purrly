type ProgressRingProps = {
    value: number;
    max: number;
    size?: number;
    stroke?: number;
    color: string;
};

const ProgressRing = ({ value, max, size = 72, stroke = 5, color }: ProgressRingProps) => {
    const radius = (size - stroke) / 2;
    const circ = 2 * Math.PI * radius;
    const pct = Math.min(value / max, 1);

    return (
        <svg width={size} height={size} className="-rotate-90">
            <circle
                cx={size / 2}
                cy={size / 2}
                r={radius}
                fill="none"
                stroke="#EDEBE8"
                strokeWidth={stroke}
            />
            <circle
                cx={size / 2}
                cy={size / 2}
                r={radius}
                fill="none"
                stroke={color}
                strokeWidth={stroke}
                strokeLinecap="round"
                strokeDasharray={circ}
                strokeDashoffset={circ * (1 - pct)}
                className="[transition:stroke-dashoffset_0.6s_cubic-bezier(0.4,0,0.2,1)]"
            />
        </svg>
    );
};

export default ProgressRing;
