import { useState, useEffect } from "react";
import type { ContentReport, BugReport, UserReport } from "@/app/admin/_types";

const useAdmin = () => {
    const [contentReports, setContentReports] = useState<ContentReport[]>([]);
    const [userReports, setUserReports] = useState<UserReport[]>([]);
    const [bugs, setBugs] = useState<BugReport[]>([]);
    const [loading, setLoading] = useState(true);
    const [actioning, setActioning] = useState<number | null>(null);

    useEffect(() => {
        let cancelled = false;
        const fetchData = async () => {
            const response = await fetch("/api/admin");
            if (cancelled) return;
            const data = await response.json();
            setContentReports(data.contentReports);
            setUserReports(data.userReports);
            setBugs(data.bugs);
            setLoading(false);
        };
        fetchData();
        return () => { cancelled = true; };
    }, []);

    const updateStatus = async (id: number, status: "REVIEWED" | "ACTIONED") => {
        setActioning(id);
        const response = await fetch(`/api/admin/reports/${id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ status }),
        });
        if (response.ok) {
            setContentReports((prev) => prev.map((report) => (report.id === id ? { ...report, status } : report)));
        }
        setActioning(null);
    };

    return { contentReports, userReports, bugs, loading, actioning, updateStatus };
};

export default useAdmin;
