"use client";

type WhisperReportPromptProps = {
    actioning: boolean;
    onReport: (allowMessaging: boolean) => void;
    onCancel: () => void;
};

const WhisperReportPrompt = ({ actioning, onReport, onCancel }: WhisperReportPromptProps) => (
    <div className="mb-4 border border-sand-200 rounded-xl p-4 bg-sand-50">
        <p className="text-sm font-medium text-sand-900 mb-1">Report this user?</p>
        <p className="text-xs text-sand-500 mb-3">Would you like to allow or disable messaging after reporting?</p>
        <div className="flex flex-col gap-2">
            <button
                onClick={() => onReport(true)}
                disabled={actioning}
                className="w-full py-2 text-xs font-medium text-sand-700 bg-white border border-sand-200 rounded-lg hover:border-sand-300 transition-colors cursor-pointer disabled:opacity-50"
            >
                {actioning ? "Reporting..." : "Report — Allow messaging"}
            </button>
            <button
                onClick={() => onReport(false)}
                disabled={actioning}
                className="w-full py-2 text-xs font-medium text-white bg-terracotta-400 rounded-lg hover:bg-terracotta-500 transition-colors cursor-pointer disabled:opacity-50"
            >
                {actioning ? "Reporting..." : "Report — Disable messaging"}
            </button>
            <button
                onClick={onCancel}
                className="text-xs text-sand-400 hover:text-sand-600 transition-colors cursor-pointer mt-1"
            >
                Cancel
            </button>
        </div>
    </div>
);

export default WhisperReportPrompt;
