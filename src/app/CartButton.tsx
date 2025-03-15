"use client";
import { getCart } from "@/lib/shopify";
import Link from "next/link";
import { useEffect, useState } from "react";
import { FaShoppingCart } from "react-icons/fa";

export default function CartButton() {
  const [count, setCount] = useState<any>(0);

  useEffect(() => {
    const fetchCart = async () => {
      const cartId = localStorage.getItem("cartId");
      if (!cartId) {
        return;
      }
      try {
        const cartData = await getCart(cartId);
        setCount(cartData.lines.edges.length);
      } catch (error) {
        console.error("Error fetching cart:", error);
      }
    };

    fetchCart();
  }, []);
    return (
        <Link href="/cart">
            <div className="relative cursor-pointer">
                <FaShoppingCart className="text-2xl text-gray-800 hover:text-blue-600" />
                <span className="absolute top-0 right-0 bg-blue-600 text-white text-xs rounded-full px-1.5 py-0.5">
                    {count}
                </span>
            </div>
        </Link>
    );
}