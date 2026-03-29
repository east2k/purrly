import { Bug, Flag, UserX } from "lucide-react";
import type { AdminTab } from "@/app/admin/_types";

export const STATUS_COLORS: Record<string, string> = {
    PENDING: "bg-terracotta-50 text-terracotta-600 border-terracotta-200",
    REVIEWED: "bg-sand-100 text-sand-600 border-sand-200",
    ACTIONED: "bg-sage-50 text-sage-600 border-sage-200",
};

export const TABS: { key: AdminTab; Icon: React.ElementType; label: string }[] = [
    { key: "reports", Icon: Flag, label: "Content Reports" },
    { key: "users", Icon: UserX, label: "User Reports" },
    { key: "bugs", Icon: Bug, label: "Bug Reports" },
];
