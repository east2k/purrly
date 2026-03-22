export type MoodOption = {
    emoji: string;
    label: string;
};

export type Comment = {
    id: number;
    text: string;
    timestamp: number;
    authorId: string;
    authorDisplayId: string;
    hideIdentity: boolean;
};

export type Reactions = {
    hugs: number;
    meToo: number;
};

export type Post = {
    id: number;
    text: string;
    mood: string | null;
    commentsEnabled: boolean;
    hideIdentity: boolean;
    authorId: string | null;
    authorDisplayId: string | null;
    comments: Comment[];
    reactions: Reactions;
    timestamp: number;
};

export type SelfCareKey = "water" | "sleep";

export type SelfCareConfig = {
    label: string;
    icon: string;
    goal: number;
    unit: string;
};

export type CareState = Record<SelfCareKey, number>;

export type WhisperStatus = "pending" | "active" | "expired";

export type WhisperMessage = {
    id: number;
    senderId: string;
    senderDisplayId: string;
    text: string;
    timestamp: number;
};

export type Whisper = {
    id: number;
    participantOneId: string;
    participantTwoId: string;
    participantOneDisplayId: string;
    participantTwoDisplayId: string;
    status: WhisperStatus;
    expiresAt: number;
    extended: boolean;
    requestedById: string;
    messages: WhisperMessage[];
    createdAt: number;
};

export type WhisperMemory = {
    id: number;
    whisperId: number;
    whisper: Whisper;
    savedAt: number;
};

export type ReconnectRequestStatus = "pending" | "accepted" | "declined" | "expired";

export type ReconnectRequest = {
    id: number;
    memoryId: number;
    requestedById: string;
    requestedToId: string;
    status: ReconnectRequestStatus;
    createdAt: number;
};

export type ReportContentType = "post" | "comment" | "whisper_message";
export type ReportStatus = "pending" | "reviewed" | "actioned";

export type Report = {
    id: number;
    reporterId: string | null;
    contentType: ReportContentType;
    contentId: number;
    reason: string;
    status: ReportStatus;
    createdAt: number;
};
