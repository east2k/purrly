"use client";

import { useState } from "react";
import Image from "next/image";

const AGE_GATE_KEY = "purrly_age_confirmed";

const AgeGate = () => {
    const [show, setShow] = useState(() => {
        if (typeof window === "undefined") return false;
        return localStorage.getItem(AGE_GATE_KEY) !== "true";
    });
    const [declined, setDeclined] = useState(false);

    if (!show) return null;

    const confirm = () => {
        localStorage.setItem(AGE_GATE_KEY, "true");
        setShow(false);
    };

    return (
        <div className="fixed inset-0 z-[100] bg-sand-50 flex items-center justify-center px-6">
            <div className="max-w-sm w-full text-center">
                <div className="flex justify-center mb-4">
                    <Image src="/logo.png" alt="Purrly" width={56} height={56} priority />
                </div>
                <h1 className="font-display text-2xl font-bold text-sand-900 mb-2">
                    purr<span className="text-terracotta-400">ly</span>
                </h1>

                {declined ? (
                    <>
                        <p className="text-sm text-sand-600 mt-4 leading-relaxed">
                            Sorry, Purrly is only for users 13 and older.
                        </p>
                        <p className="text-sm text-sand-400 mt-2">
                            If you&apos;re going through something difficult, please reach out to a trusted adult or{" "}
                            <a href="/resources" className="text-terracotta-400 underline">visit our resources page</a>.
                        </p>
                    </>
                ) : (
                    <>
                        <p className="text-sm text-sand-600 mt-4 mb-8 leading-relaxed">
                            Purrly covers sensitive topics like mental health and emotions.
                            <br />
                            Are you 13 or older?
                        </p>
                        <div className="flex gap-3">
                            <button
                                onClick={confirm}
                                className="flex-1 py-3 bg-terracotta-400 hover:bg-terracotta-500 text-white text-sm font-medium rounded-xl transition-colors cursor-pointer font-body"
                            >
                                Yes, I&apos;m 13+
                            </button>
                            <button
                                onClick={() => setDeclined(true)}
                                className="flex-1 py-3 bg-sand-100 hover:bg-sand-200 text-sand-600 text-sm font-medium rounded-xl transition-colors cursor-pointer font-body"
                            >
                                No
                            </button>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default AgeGate;
