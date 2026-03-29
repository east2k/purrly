"use client";

import { useState } from "react";
import { CheckCheck, Eye } from "lucide-react";
import useAdmin from "@/app/admin/_hooks/useAdmin";
import { TABS, STATUS_COLORS } from "@/app/admin/_constants";
import type { AdminTab } from "@/app/admin/_types";

const AdminPage = () => {
    const { contentReports, userReports, bugs, loading, actioning, updateStatus } = useAdmin();
    const [tab, setTab] = useState<AdminTab>("reports");

    const getBadge = (key: AdminTab) => {
        if (key === "reports") return contentReports.filter((report) => report.status === "PENDING").length;
        if (key === "users") return userReports.length;
        return bugs.length;
    };

    return (
        <div className="max-w-4xl mx-auto py-10 px-4">
            <h1 className="font-display text-2xl font-bold text-sand-900 mb-1">Admin Panel</h1>
            <p className="text-sm text-sand-500 mb-6">Moderation and bug reports</p>

            <div className="flex gap-2 mb-6 flex-wrap">
                {TABS.map(({ key, Icon, label }) => (
                    <button
                        key={key}
                        onClick={() => setTab(key)}
                        className={["flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium transition-colors cursor-pointer font-body border",
                            tab === key ? "bg-sand-900 text-white border-sand-900" : "bg-white text-sand-600 border-sand-200 hover:border-sand-400"
                        ].join(" ")}
                    >
                        <Icon size={14} />{label}
                        <span className={["ml-1 px-1.5 py-0.5 rounded text-xs font-bold",
                            tab === key ? "bg-white/20 text-white" : "bg-sand-100 text-sand-500"
                        ].join(" ")}>
                            {getBadge(key)}
                        </span>
                    </button>
                ))}
            </div>

            {loading ? (
                <p className="text-sm text-sand-500">Loading...</p>
            ) : tab === "reports" ? (
                <div className="flex flex-col gap-3">
                    {contentReports.length === 0 ? (
                        <p className="text-sm text-sand-400 text-center py-12">No reports yet.</p>
                    ) : contentReports.map((report) => (
                        <div key={report.id} className="bg-white border border-sand-200 rounded-2xl p-4 shadow-card">
                            <div className="flex items-start justify-between gap-3 mb-2">
                                <div>
                                    <span className="text-xs font-semibold text-sand-500 uppercase tracking-wide">{report.contentType.replace("_", " ")} #{report.contentId}</span>
                                    <p className="text-sm text-sand-900 mt-0.5">{report.reason}</p>
                                    <p className="text-[11px] text-sand-400 mt-1">
                                        {report.reporterId ? `By ${report.reporterId.slice(0, 12)}...` : "Anonymous"} · {new Date(report.createdAt).toLocaleDateString()}
                                    </p>
                                </div>
                                <span className={`text-[11px] font-medium px-2 py-0.5 rounded-full border shrink-0 ${STATUS_COLORS[report.status]}`}>
                                    {report.status}
                                </span>
                            </div>
                            {report.status === "PENDING" && (
                                <div className="flex gap-2 mt-3">
                                    <button onClick={() => updateStatus(report.id, "REVIEWED")} disabled={actioning === report.id}
                                        className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-sand-100 text-sand-700 hover:bg-sand-200 rounded-lg transition-colors cursor-pointer font-body disabled:opacity-50">
                                        <Eye size={12} /> Mark reviewed
                                    </button>
                                    <button onClick={() => updateStatus(report.id, "ACTIONED")} disabled={actioning === report.id}
                                        className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-terracotta-50 text-terracotta-600 hover:bg-terracotta-100 rounded-lg transition-colors cursor-pointer font-body disabled:opacity-50">
                                        <CheckCheck size={12} /> Action taken
                                    </button>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            ) : tab === "users" ? (
                <div className="flex flex-col gap-3">
                    {userReports.length === 0 ? (
                        <p className="text-sm text-sand-400 text-center py-12">No user reports yet.</p>
                    ) : userReports.map((userReport) => {
                        const reportedUserId = userReport.reportedById === userReport.participantOneId
                            ? userReport.participantTwoId
                            : userReport.participantOneId;
                        return (
                            <div key={userReport.id} className="bg-white border border-sand-200 rounded-2xl p-4 shadow-card">
                                <div className="flex items-start justify-between gap-3">
                                    <div>
                                        <span className="text-xs font-semibold text-sand-500 uppercase tracking-wide">Whisper #{userReport.id}</span>
                                        <p className="text-sm text-sand-900 mt-1">
                                            <span className="text-terracotta-500 font-medium">Reported:</span> {reportedUserId.slice(0, 20)}...
                                        </p>
                                        <p className="text-sm text-sand-600 mt-0.5">
                                            <span className="font-medium">By:</span> {userReport.reportedById.slice(0, 20)}...
                                        </p>
                                        <p className="text-[11px] text-sand-400 mt-1">
                                            Messaging {userReport.messagingAllowed ? "allowed" : "disabled"} · {new Date(userReport.createdAt).toLocaleDateString()}
                                        </p>
                                    </div>
                                    <span className={`text-[11px] font-medium px-2 py-0.5 rounded-full border shrink-0 ${userReport.messagingAllowed ? "bg-sand-50 text-sand-500 border-sand-200" : "bg-terracotta-50 text-terracotta-600 border-terracotta-200"}`}>
                                        {userReport.messagingAllowed ? "Messaging on" : "Messaging off"}
                                    </span>
                                </div>
                            </div>
                        );
                    })}
                </div>
            ) : (
                <div className="flex flex-col gap-3">
                    {bugs.length === 0 ? (
                        <p className="text-sm text-sand-400 text-center py-12">No bug reports yet.</p>
                    ) : bugs.map((bug) => (
                        <div key={bug.id} className="bg-white border border-sand-200 rounded-2xl p-4 shadow-card">
                            <span className="text-xs font-semibold text-terracotta-500 uppercase tracking-wide">{bug.category}</span>
                            <p className="text-sm text-sand-900 mt-0.5">{bug.description}</p>
                            <p className="text-[11px] text-sand-400 mt-1">
                                {bug.userId ? `By ${bug.userId.slice(0, 12)}...` : "Anonymous"} · {new Date(bug.createdAt).toLocaleDateString()}
                            </p>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default AdminPage;
