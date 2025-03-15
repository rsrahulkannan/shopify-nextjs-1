"use client";
import { useCart } from "@/context/CartContext";
import { createCart, updateCart } from "@/lib/shopify";

export default function AddToCartButton({ productId }: { productId: string }) {
  const { updateCartCount } = useCart();

  const handleAddToCart = async () => {
    try {
      const cartId = localStorage.getItem("cartId");

      if (cartId) {
        const updatedCart = await updateCart(cartId, productId, 1); 
        console.log("Cart Updated:", updatedCart);
      } else {
        const cart = await createCart({ merchandiseId: productId, quantity: 1 });
        if (cart.id) {
          localStorage.setItem("cartId", cart.id);
          console.log("Cart Created:", cart);
        }
      }

      updateCartCount();
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