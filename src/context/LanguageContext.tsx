"use client";
import { createContext, useContext, useState, ReactNode, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { routing } from "@/i18n/routing";

interface LanguageContextType {
    language: string;
    setLanguage: (lang: string) => void;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
    const router = useRouter();
    const pathname = usePathname();

    const [language, setLanguageState] = useState<string>(() => {
        if (typeof window !== "undefined") {
            return localStorage.getItem("language") || routing.defaultLocale;
        }
        return routing.defaultLocale;
    });

    useEffect(() => {
        localStorage.setItem("language", language);
    }, [language]);

    const setLanguage = (lang: string) => {
        setLanguageState(lang);
        localStorage.setItem("language", lang);
        const newPath = `/${lang}${pathname.replace(/^\/(en|de|hi)/, "")}`;
        router.push(newPath);
    };

    return (
        <LanguageContext.Provider value={{ language, setLanguage }}>
            {children}
        </LanguageContext.Provider>
    );
}

export function useLanguage() {
    const context = useContext(LanguageContext);
    if (!context) {
        throw new Error("useLanguage must be used within a LanguageProvider");
    }
    return context;
}
