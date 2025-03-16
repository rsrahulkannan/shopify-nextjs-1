"use client";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { useState } from "react";
import CartButton from "./CartButton";
import { useTranslations } from "next-intl";

export default function Navbar() {
    const t = useTranslations('Product');
    const router = useRouter();
    const pathname = usePathname();
    const [searchInput, setSearchInput] = useState("");

    const handleSearch = (term: string) => {
        setSearchInput(term);
        router.push(`/?search=${encodeURIComponent(term)}`);
    };

    const handleLanguageChange = (lang: string) => {
        const newPath = `/${lang}${pathname.replace(/^\/(en|de)/, '')}`;
        router.push(newPath);
    };

    return (
        <nav className="bg-white shadow-md fixed w-full z-10">
            <div className="container mx-auto px-4 py-4 flex justify-between items-center">
                <Link href="/">
                    <h1 className="text-2xl font-bold text-gray-800">Shopify Store</h1>
                </Link>
                <div className="flex items-center space-x-4">
                    <input
                        type="text"
                        placeholder={t('search')}
                        value={searchInput}
                        onChange={(e) => handleSearch(e.target.value)}
                        className="w-48 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600"
                    />
                    <select
                        onChange={(e) => handleLanguageChange(e.target.value)}
                        className="px-2 py-1 border border-gray-300 rounded-md"
                    >
                        <option value="en">English</option>
                        <option value="de">German</option>
                    </select>
                    <CartButton />
                </div>
            </div>
        </nav>
    );
}
