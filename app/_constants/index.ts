import type { Whisper, WhisperMemory, SelfCareKey, SelfCareConfig, MoodOption } from "@/types";

export const MAX_UNSIGNED_POSTS_PER_DAY = 3;

export const LANGUAGE_OPTIONS: { code: string; label: string }[] = [
    { code: "en", label: "English" },
    { code: "es", label: "Español" },
    { code: "fr", label: "Français" },
    { code: "pt", label: "Português" },
    { code: "de", label: "Deutsch" },
    { code: "it", label: "Italiano" },
    { code: "ja", label: "日本語" },
    { code: "ko", label: "한국어" },
    { code: "zh", label: "中文" },
    { code: "ar", label: "العربية" },
    { code: "hi", label: "हिन्दी" },
    { code: "tl", label: "Filipino" },
    { code: "id", label: "Bahasa Indonesia" },
    { code: "th", label: "ภาษาไทย" },
    { code: "vi", label: "Tiếng Việt" },
];
export const REPORT_THRESHOLD = 5;
export const WHISPER_DURATION_MS = 48 * 60 * 60 * 1000;
export const POSTS_PER_PAGE = 5;
export const MOCK_CURRENT_USER_ID = "user_current";

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
    { emoji: "😭", label: "Crying" },
    { emoji: "😩", label: "Exhausted" },
    { emoji: "😔", label: "Down" },
    { emoji: "💔", label: "Heartbroken" },
    { emoji: "🥺", label: "Pleading" },
    { emoji: "😞", label: "Disappointed" },
    { emoji: "😡", label: "Angry" },
    { emoji: "🤬", label: "Furious" },
    { emoji: "😰", label: "Anxious" },
    { emoji: "😱", label: "Shocked" },
    { emoji: "🫠", label: "Melting" },
    { emoji: "😮‍💨", label: "Relieved" },
    { emoji: "🤯", label: "Mind blown" },
    { emoji: "😴", label: "Sleepy" },
    { emoji: "🥱", label: "Bored" },
    { emoji: "🥳", label: "Celebrating" },
    { emoji: "🤩", label: "Starstruck" },
    { emoji: "😎", label: "Cool" },
    { emoji: "🥰", label: "Loved" },
    { emoji: "🤗", label: "Hugging" },
    { emoji: "😌", label: "Peaceful" },
    { emoji: "🤷", label: "Unsure" },
    { emoji: "🤔", label: "Thinking" },
    { emoji: "😬", label: "Nervous" },
    { emoji: "🥲", label: "Bittersweet" },
    { emoji: "😏", label: "Smug" },
    { emoji: "💀", label: "Dead inside" },
    { emoji: "🙈", label: "Can't look" },
    { emoji: "🫶", label: "Grateful" },
    { emoji: "🔥", label: "On fire" },
    { emoji: "💭", label: "Overthinking" },
    { emoji: "🌊", label: "Overwhelmed" },
    { emoji: "🌸", label: "Soft" },
    { emoji: "🌈", label: "Hopeful" },
];

export const SAMPLE_WHISPERS: Whisper[] = [
    {
        id: 1,
        participantOneId: MOCK_CURRENT_USER_ID,
        participantTwoId: "user_abc123",
        participantOneDisplayId: "7382",
        participantTwoDisplayId: "4519",
        status: "active",
        expiresAt: Date.now() + 36 * 60 * 60 * 1000,
        extended: false,
        requestedById: "user_abc123",
        messages: [
            { id: 1, senderId: "user_abc123", senderDisplayId: "4519", text: "Hey, I saw your comment about the late night thoughts. I totally get it.", timestamp: Date.now() - 3600000 * 2 },
            { id: 2, senderId: MOCK_CURRENT_USER_ID, senderDisplayId: "7382", text: "Right? It's like 3am is when your brain decides to replay every cringy moment.", timestamp: Date.now() - 3600000 },
            { id: 3, senderId: "user_abc123", senderDisplayId: "4519", text: "Exactly. I've started keeping a notebook by my bed. Sometimes writing it down helps.", timestamp: Date.now() - 1800000 },
        ],
        createdAt: Date.now() - 3600000 * 24,
    },
];

export const SAMPLE_WHISPER_REQUESTS: Whisper[] = [
    {
        id: 2,
        participantOneId: "user_def456",
        participantTwoId: MOCK_CURRENT_USER_ID,
        participantOneDisplayId: "2091",
        participantTwoDisplayId: "7382",
        status: "pending",
        expiresAt: 0,
        extended: false,
        requestedById: "user_def456",
        messages: [],
        createdAt: Date.now() - 3600000,
    },
];

export const SAMPLE_WHISPER_MEMORIES: WhisperMemory[] = [
    {
        id: 1,
        whisperId: 3,
        whisper: {
            id: 3,
            participantOneId: MOCK_CURRENT_USER_ID,
            participantTwoId: "user_ghi789",
            participantOneDisplayId: "7382",
            participantTwoDisplayId: "8901",
            status: "expired",
            expiresAt: Date.now() - 3600000 * 48,
            extended: true,
            requestedById: MOCK_CURRENT_USER_ID,
            messages: [
                { id: 1, senderId: "user_ghi789", senderDisplayId: "8901", text: "Thanks for reaching out. It helped talking to someone.", timestamp: Date.now() - 3600000 * 96 },
                { id: 2, senderId: MOCK_CURRENT_USER_ID, senderDisplayId: "7382", text: "Same here. Take care of yourself.", timestamp: Date.now() - 3600000 * 95 },
            ],
            createdAt: Date.now() - 3600000 * 120,
        },
        savedAt: Date.now() - 3600000 * 48,
    },
];
