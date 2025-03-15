"use client";
import { getCart } from "@/lib/cart";
import { createContext, useContext, useState, useEffect } from "react";

type CartContextType = {
    cartCount: number;
    updateCartCount: () => void;
};

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
    const [cartCount, setCartCount] = useState(0);

    const updateCartCount = async () => {
        const cartId = localStorage.getItem("cartId");
        if (!cartId) {
            setCartCount(0);
            return;
        }
        try {
            const cartData = await getCart(cartId);
            setCartCount(cartData.lines.edges.length);
        } catch (error) {
            console.error("Error fetching cart:", error);
        }
    };

    useEffect(() => {
        updateCartCount();
    }, []);

    return (
        <CartContext.Provider value={{ cartCount, updateCartCount }}>
            {children}
        </CartContext.Provider>
    );
}

export function useCart() {
    const context = useContext(CartContext);
    if (!context) {
        throw new Error("useCart must be used within a CartProvider");
    }
    return context;
}