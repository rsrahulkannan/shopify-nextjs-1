"use client";
import { createContext, useContext, useState, useEffect } from "react";
import { getCart } from "@/lib/shopify";

// Define the context type
type CartContextType = {
    cartCount: number;
    updateCartCount: () => void;
};

// Create the context
const CartContext = createContext<CartContextType | undefined>(undefined);

// Create a provider component
export function CartProvider({ children }: { children: React.ReactNode }) {
    const [cartCount, setCartCount] = useState(0);

    // Function to fetch and update the cart count
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

    // Fetch the cart count on initial load
    useEffect(() => {
        updateCartCount();
    }, []);

    return (
        <CartContext.Provider value={{ cartCount, updateCartCount }}>
            {children}
        </CartContext.Provider>
    );
}

// Custom hook to use the cart context
export function useCart() {
    const context = useContext(CartContext);
    if (!context) {
        throw new Error("useCart must be used within a CartProvider");
    }
    return context;
}