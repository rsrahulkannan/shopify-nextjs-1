"use client";
import Link from "next/link";
import { FaShoppingCart } from "react-icons/fa";
import { useCart } from "../context/CartContext";

export default function CartButton() {
  const { cartCount } = useCart();

  return (
    <Link href="/cart">
      <div className="relative cursor-pointer">
        <FaShoppingCart className="text-2xl text-gray-800 hover:text-blue-600" />
        <span className="absolute top-0 right-0 bg-blue-600 text-white text-xs rounded-full px-1.5 py-0.5">
          {cartCount}
        </span>
      </div>
    </Link>
  );
}