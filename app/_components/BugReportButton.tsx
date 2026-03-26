"use client";

import { useState } from "react";
import { Bug, X } from "lucide-react";

const CATEGORIES = ["UI Bug", "Performance", "Content", "Feature Request", "Other"];

const BugReportButton = () => {
    const [open, setOpen] = useState(false);
    const [category, setCategory] = useState("");
    const [description, setDescription] = useState("");
    const [submitting, setSubmitting] = useState(false);
    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = async () => {
        if (!category || description.trim().length < 5) return;
        setSubmitting(true);
        const res = await fetch("/api/bug-reports", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ category, description }),
        });
        setSubmitting(false);
        if (res.ok) {
            setSubmitted(true);
            setTimeout(() => {
                setOpen(false);
                setSubmitted(false);
                setCategory("");
                setDescription("");
            }, 2000);
        }
    };

    return (
        <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-2">
            {open && (
                <div className="bg-white border border-sand-200 rounded-2xl shadow-lg w-72 p-4">
                    <div className="flex items-center justify-between mb-3">
                        <p className="text-sm font-semibold text-sand-900 font-body">Report a bug</p>
                        <button onClick={() => setOpen(false)} className="text-sand-400 hover:text-sand-600 transition-colors cursor-pointer">
                            <X size={14} />
                        </button>
                    </div>

                    {submitted ? (
                        <p className="text-sm text-center text-sand-600 py-4">Thanks for the report! 🐱</p>
                    ) : (
                        <>
                            <select
                                value={category}
                                onChange={(e) => setCategory(e.target.value)}
                                className="w-full px-3 py-2 mb-3 border border-sand-300 rounded-lg text-sm bg-sand-50 text-sand-900 outline-none focus:border-terracotta-400 font-body cursor-pointer"
                            >
                                <option value="">Select category</option>
                                {CATEGORIES.map((c) => (
                                    <option key={c} value={c}>{c}</option>
                                ))}
                            </select>
                            <textarea
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                placeholder="Describe the issue..."
                                rows={3}
                                className="w-full px-3 py-2 mb-3 border border-sand-300 rounded-lg text-sm bg-sand-50 text-sand-900 outline-none focus:border-terracotta-400 font-body placeholder:text-sand-400 resize-none"
                            />
                            <button
                                onClick={handleSubmit}
                                disabled={!category || description.trim().length < 5 || submitting}
                                className="w-full py-2 bg-terracotta-400 text-white text-sm font-medium rounded-lg disabled:opacity-40 hover:bg-terracotta-500 transition-colors cursor-pointer font-body"
                            >
                                {submitting ? "Sending..." : "Submit"}
                            </button>
                        </>
                    )}
                </div>
            )}

            <button
                onClick={() => setOpen((o) => !o)}
                className="w-10 h-10 bg-sand-700 hover:bg-sand-300 text-sand-50 rounded-full flex items-center justify-center transition-colors cursor-pointer shadow-sm"
                title="Report a bug"
            >
                <Bug size={16} />
            </button>
        </div>
    );
};

export default BugReportButton;
