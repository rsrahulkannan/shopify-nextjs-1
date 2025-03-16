"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import CartButton from "./CartButton";
import { useTranslations } from "next-intl";
import { routing } from "@/i18n/routing";
import { useLanguage } from "@/context/LanguageContext";

export default function Navbar() {
    const t = useTranslations('Product');
    const l = useTranslations('Language');
    const router = useRouter();
    const [searchInput, setSearchInput] = useState("");
    const { language, setLanguage } = useLanguage();

    const handleSearch = (term: string) => {
        setSearchInput(term);
        router.push(`/?search=${encodeURIComponent(term)}`);
    };

    return (
        <nav className="bg-white shadow-md fixed w-full z-10">
            <div className="container mx-auto px-4 py-4 flex flex-wrap items-center justify-between">
                <div className="w-full flex justify-between items-center md:w-auto">
                    <Link href="/">
                        <h1 className="text-2xl font-bold text-gray-800">Shopify Store</h1>
                    </Link>
                    <div className="flex items-center space-x-4">
                        <select
                            value={language}
                            onChange={(e) => setLanguage(e.target.value)}
                            className="px-2 py-1 border border-gray-300 rounded-md"
                        >
                            {routing.locales.map((locale) => (
                                <option value={locale} key={locale}>
                                    {l(`${locale}`)}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>
                <div className="w-full flex justify-between items-center md:w-auto py-2">
                    <input
                        type="text"
                        placeholder={t('search')}
                        value={searchInput}
                        onChange={(e) => handleSearch(e.target.value)}
                        className="w-full md:w-48 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600"
                    />
                    <CartButton />
                </div>
            </div>
        </nav >
    );
}
