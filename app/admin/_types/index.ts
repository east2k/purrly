export type ContentReport = {
    id: number;
    reporterId: string | null;
    contentType: string;
    contentId: number;
    reason: string;
    status: "PENDING" | "REVIEWED" | "ACTIONED";
    createdAt: string;
};

export type BugReport = {
    id: number;
    category: string;
    description: string;
    userId: string | null;
    createdAt: string;
};

export type UserReport = {
    id: number;
    reportedById: string;
    participantOneId: string;
    participantTwoId: string;
    messagingAllowed: boolean;
    createdAt: string;
};

export type AdminTab = "reports" | "users" | "bugs";
