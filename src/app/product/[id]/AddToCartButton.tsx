"use client";
import { createCart, updateCart } from "@/lib/shopify"; // Import updateCart function

export default function AddToCartButton({ productId }: { productId: string }) {
  const handleAddToCart = async () => {
    try {
      const cartId = localStorage.getItem("cartId");

      if (cartId) {
        // If cartId exists, update the existing cart
        const updatedCart = await updateCart(cartId, productId, 1); // Add 1 quantity of the product
        console.log("Cart Updated:", updatedCart);
      } else {
        // If cartId does not exist, create a new cart
        const cart = await createCart({ merchandiseId: productId, quantity: 1 });
        if (cart.id) {
          localStorage.setItem("cartId", cart.id);
          console.log("Cart Created:", cart);
        }
      }
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