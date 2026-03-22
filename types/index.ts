export type MoodOption = {
    emoji: string;
    label: string;
};

export type ApiComment = {
    id: number;
    text: string;
    authorId: string;
    authorDisplayId: string | null;
    hideIdentity: boolean;
    createdAt: string;
    reportCount: number;
};

export type ApiPost = {
    id: number;
    text: string;
    mood: string | null;
    language: string | null;
    commentsEnabled: boolean;
    hideIdentity: boolean;
    authorId: string | null;
    authorDisplayId: string | null;
    createdAt: string;
    hugCount: number;
    huggedByMe: boolean;
    commentCount: number;
    reportCount: number;
    deletedAt: string | null;
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

export type ApiWhisperMessage = {
    id: number;
    senderId: string;
    senderDisplayId: string | null;
    text: string;
    createdAt: string;
};

export type ApiWhisper = {
    id: number;
    participantOneId: string;
    participantTwoId: string;
    participantOne: { displayId: string | null };
    participantTwo: { displayId: string | null };
    status: "PENDING" | "ACTIVE" | "EXPIRED";
    expiresAt: string | null;
    extended: boolean;
    requestedById: string;
    requestedByRevealId: boolean;
    createdAt: string;
    updatedAt: string;
    messages: { id: number; senderId: string; text: string; createdAt: string }[];
};

export type ApiWhisperMemory = {
    id: number;
    whisperId: number;
    savedAt: string;
    whisper: {
        id: number;
        participantOneId: string;
        participantTwoId: string;
        participantOne: { displayId: string | null };
        participantTwo: { displayId: string | null };
        messages: { text: string; createdAt: string }[];
    };
};

export type ReportContentType = "POST" | "COMMENT" | "WHISPER_MESSAGE";
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
