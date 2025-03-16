"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import CartButton from "./CartButton";

export default function Navbar() {
    const router = useRouter();
    const [searchInput, setSearchInput] = useState("");

    const handleSearch = (term: string) => {
        console.log(term);
        setSearchInput(term);
        router.push(`/?search=${encodeURIComponent(term)}`);
    }

    return (
        <nav className="bg-white shadow-md fixed w-full z-10">
            <div className="container mx-auto px-4 py-4 flex justify-between items-center">
                <Link href="/">
                    <h1 className="text-2xl font-bold text-gray-800">Shopify Store</h1>
                </Link>
                <div className="flex items-center space-x-4">
                    <input
                        type="text"
                        placeholder="Search products..."
                        value={searchInput}
                        onChange={(e) => {
                            handleSearch(e.target.value);
                        }}
                        className="w-48 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600"
                    />
                    <CartButton />
                </div>
            </div>
        </nav>
    );
}