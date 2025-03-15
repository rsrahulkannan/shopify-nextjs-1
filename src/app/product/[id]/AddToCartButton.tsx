"use client";
import { createCart } from "@/lib/shopify";

export default function AddToCartButton({ productId }: { productId: string }) {
  const handleAddToCart = async () => {
    try {
      const cart = await createCart({ merchandiseId: productId });

      if (cart.id) {
        localStorage.setItem("cartId", cart.id);
        console.log("Cart Created:", cart);
      }

      // ✅ Log cart quantity
      cart.lines.edges.forEach((item) => {
        console.log("Cart Item:", item.node.merchandise.title, "Quantity:", item.node.quantity);
      });
      
    } catch (error) {
      console.error("Error adding to cart:", error);
    }
  };

  return (
    <button 
      className="mt-4 w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition"
      onClick={handleAddToCart}
    >
      Add to Cart
    </button>
  );
}
