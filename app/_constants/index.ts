import type { Post, SelfCareKey, SelfCareConfig, MoodOption } from "@/types";

export const SAMPLE_POSTS: Post[] = [
    {
        id: 1,
        text: "Today was rough. My manager completely dismissed my idea in the meeting and took credit for it later. I just needed to get this off my chest.",
        mood: "😤",
        commentsEnabled: false,
        comments: [],
        timestamp: Date.now() - 3600000 * 5,
        anonymous: true,
    },
    {
        id: 2,
        text: "Feeling weirdly grateful today. A stranger held the door and smiled at me and it genuinely made my whole afternoon better. Small things matter.",
        mood: "🙂",
        commentsEnabled: true,
        comments: [{ id: 1, text: "Love this energy 🌻", timestamp: Date.now() - 1800000 }],
        timestamp: Date.now() - 3600000 * 12,
        anonymous: false,
    },
    {
        id: 3,
        text: "I can't sleep. My brain won't stop replaying every embarrassing thing I've ever done. Why does 3am feel like a courtroom for your past self?",
        mood: "😐",
        commentsEnabled: true,
        comments: [],
        timestamp: Date.now() - 3600000 * 24,
        anonymous: true,
    },
];

export const SELF_CARE_CONFIG: Record<SelfCareKey, SelfCareConfig> = {
    water: { label: "Water", icon: "💧", goal: 8, unit: "glasses" },
    sleep: { label: "Sleep", icon: "🌙", goal: 8, unit: "hours" },
};

export const MOOD_OPTIONS: MoodOption[] = [
    { emoji: "😤", label: "Frustrated" },
    { emoji: "😢", label: "Sad" },
    { emoji: "😐", label: "Meh" },
    { emoji: "🙂", label: "Okay" },
    { emoji: "😊", label: "Good" },
    { emoji: "✨", label: "Great" },
];
