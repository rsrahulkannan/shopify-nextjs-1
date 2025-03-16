"use client";
import { useCart } from "@/context/CartContext";
import { createCart, updateCart } from "@/lib/cart";
import { useTranslations } from "next-intl";

export default function AddToCartButton({ productId }: { productId: string }) {
  const { updateCartCount } = useCart();
  const t = useTranslations("Product");

  const handleAddToCart = async () => {
    try {
      const cartId = localStorage.getItem("cartId");

      if (cartId) {
        const updatedCart = await updateCart(cartId, productId, 1); 
      } else {
        const cart = await createCart({ merchandiseId: productId, quantity: 1 });
        if (cart.id) {
          localStorage.setItem("cartId", cart.id);
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
      {t('addCart')}
    </button>
  );
}