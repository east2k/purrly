"use client";

import { useState } from "react";
import { Flag } from "lucide-react";
import type { ReportContentType } from "@/types";

type ReportButtonProps = {
    contentType: ReportContentType;
    contentId: number;
};

const ReportButton = ({ contentType, contentId }: ReportButtonProps) => {
    const [showForm, setShowForm] = useState(false);
    const [reason, setReason] = useState("");
    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = async () => {
        if (!reason.trim()) return;
        const res = await fetch("/api/reports", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ contentType, contentId, reason: reason.trim() }),
        });
        if (!res.ok) return;
        setSubmitted(true);
        setTimeout(() => {
            setShowForm(false);
            setSubmitted(false);
            setReason("");
        }, 2000);
    };

    if (submitted) {
        return <span className="text-xs text-sage-600">Thanks for reporting</span>;
    }

    return (
        <div className="relative">
            <button
                onClick={() => setShowForm(!showForm)}
                className="text-sand-400 hover:text-sand-600 transition-colors cursor-pointer p-1"
                title="Report"
            >
                <Flag size={14} />
            </button>
            {showForm && (
                <div className="absolute right-0 top-full mt-1 bg-white border border-sand-300 rounded-xl shadow-card-lg p-3 z-10 w-56">
                    <p className="text-xs text-sand-600 mb-2">Why are you reporting this?</p>
                    <textarea
                        className="w-full px-3 py-2 border border-sand-300 rounded-lg text-xs bg-sand-50 text-sand-900 outline-none focus:border-terracotta-400 font-body placeholder:text-sand-500 resize-none"
                        placeholder="Tell us what's wrong..."
                        rows={2}
                        value={reason}
                        onChange={(e) => setReason(e.target.value)}
                    />
                    <div className="flex justify-end gap-2 mt-2">
                        <button
                            onClick={() => {
                                setShowForm(false);
                                setReason("");
                            }}
                            className="text-xs text-sand-500 hover:text-sand-700 cursor-pointer"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleSubmit}
                            disabled={!reason.trim()}
                            className="px-3 py-1 bg-terracotta-400 text-white text-xs font-medium rounded-lg disabled:opacity-40 hover:bg-terracotta-500 transition-colors cursor-pointer font-body"
                        >
                            Report
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ReportButton;
