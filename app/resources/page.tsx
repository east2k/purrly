import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Crisis Resources - Purrly",
    description: "If you or someone you know is struggling, these crisis lines and resources are here to help.",
};

const RESOURCES = [
    {
        region: "International",
        lines: [
            { name: "Befrienders Worldwide", contact: "befrienders.org", note: "Find a crisis center near you" },
            { name: "International Association for Suicide Prevention", contact: "https://www.iasp.info/resources/Crisis_Centres/", note: "Global crisis centre directory" },
        ],
    },
    {
        region: "United States",
        lines: [
            { name: "988 Suicide & Crisis Lifeline", contact: "Call or text 988", note: "24/7, free and confidential" },
            { name: "Crisis Text Line", contact: "Text HOME to 741741", note: "24/7 text-based crisis support" },
            { name: "SAMHSA Helpline", contact: "1-800-662-4357", note: "Mental health & substance use, 24/7" },
        ],
    },
    {
        region: "United Kingdom",
        lines: [
            { name: "Samaritans", contact: "116 123", note: "24/7, free to call" },
            { name: "Crisis Text Line UK", contact: "Text SHOUT to 85258", note: "24/7 text-based support" },
            { name: "PAPYRUS (under 35)", contact: "0800 068 4141", note: "Mon–Fri 10am–10pm, weekends 2pm–10pm" },
        ],
    },
    {
        region: "Australia",
        lines: [
            { name: "Lifeline", contact: "13 11 14", note: "24/7 crisis support" },
            { name: "Beyond Blue", contact: "1300 22 4636", note: "24/7 mental health support" },
            { name: "Kids Helpline (under 25)", contact: "1800 55 1800", note: "24/7, free and confidential" },
        ],
    },
    {
        region: "Philippines",
        lines: [
            { name: "Hopeline", contact: "02-8804-4673 / 0917-558-4673", note: "24/7 crisis hotline" },
            { name: "In Touch Crisis Line", contact: "02-8893-7603", note: "Mon–Fri 9am–5pm" },
            { name: "NCMH Crisis Hotline", contact: "1553", note: "24/7, toll-free" },
        ],
    },
    {
        region: "Canada",
        lines: [
            { name: "Talk Suicide Canada", contact: "1-833-456-4566", note: "24/7 crisis support" },
            { name: "Crisis Text Line Canada", contact: "Text HOME to 686868", note: "24/7 text-based support" },
        ],
    },
    {
        region: "India",
        lines: [
            { name: "iCall", contact: "9152987821", note: "Mon–Sat 8am–10pm" },
            { name: "Vandrevala Foundation", contact: "1860-2662-345", note: "24/7 mental health helpline" },
        ],
    },
];

const ResourcesPage = () => (
    <div className="max-w-2xl mx-auto">
        <div className="mb-8">
            <h2 className="font-display text-2xl font-semibold text-sand-900 mb-2">
                You are not alone.
            </h2>
            <p className="text-sm text-sand-600 leading-relaxed">
                If you or someone you know is struggling, please reach out. These lines are free,
                confidential, and staffed by people who genuinely care.
            </p>
        </div>

        <div className="space-y-6">
            {RESOURCES.map((group) => (
                <div key={group.region}>
                    <h3 className="text-xs font-semibold uppercase tracking-widest text-terracotta-400 mb-3">
                        {group.region}
                    </h3>
                    <div className="space-y-2">
                        {group.lines.map((line) => (
                            <div
                                key={line.name}
                                className="bg-white rounded-xl px-5 py-4 border border-sand-200 shadow-card"
                            >
                                <div className="flex items-start justify-between gap-4">
                                    <div>
                                        <p className="text-sm font-semibold text-sand-900">{line.name}</p>
                                        <p className="text-xs text-sand-500 mt-0.5">{line.note}</p>
                                    </div>
                                    <span className="text-sm font-medium text-terracotta-500 shrink-0 text-right">
                                        {line.contact}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            ))}
        </div>

        <p className="text-xs text-sand-400 text-center mt-10 leading-relaxed">
            If you are in immediate danger, please call your local emergency number (911, 999, 112, etc.)
        </p>
    </div>
);

export default ResourcesPage;
