"use client";

import { createContext, useContext, useState } from "react";
import type { ReactNode } from "react";

const PREF_KEY = "purrly_hide_identity";

const readPreference = () => {
    if (typeof window === "undefined") return true;
    const stored = localStorage.getItem(PREF_KEY);
    return stored !== null ? stored === "true" : true;
};

type IdentityPreferenceContextType = {
    hideIdentity: boolean;
    updatePreference: (value: boolean) => void;
};

const IdentityPreferenceContext = createContext<IdentityPreferenceContextType>({
    hideIdentity: true,
    updatePreference: () => {},
});

export const IdentityPreferenceProvider = ({ children }: { children: ReactNode }) => {
    const [hideIdentity, setHideIdentity] = useState(readPreference);

    const updatePreference = (value: boolean) => {
        setHideIdentity(value);
        localStorage.setItem(PREF_KEY, String(value));
    };

    return (
        <IdentityPreferenceContext.Provider value={{ hideIdentity, updatePreference }}>
            {children}
        </IdentityPreferenceContext.Provider>
    );
};

export const useIdentityPreference = () => useContext(IdentityPreferenceContext);
