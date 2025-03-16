"use client";
import { useCart } from "@/context/CartContext";
import { getCart } from "@/lib/cart";
import { createCheckout } from "@/lib/checkout";
import { useTranslations } from "next-intl";

export default function CheckoutButton() {
  const { cartCount } = useCart();
  const t = useTranslations("Product");

  const handleCheckout = async () => {
    try {
      const cartId = localStorage.getItem("cartId");
      if (!cartId) {
        alert("Your cart is empty.");
        return;
      }

      const cartData = await getCart(cartId);

      const lineItems = cartData.lines.edges.map(({ node }: any) => ({
        merchandiseId: node.merchandise.id,
        quantity: node.quantity,
      }));

      const checkoutUrl = await createCheckout(lineItems);

      window.location.href = checkoutUrl;
    } catch (error) {
      console.error("Error during checkout:", error);
      alert("An error occurred during checkout. Please try again.");
    }
  };

  return (
    <button
      onClick={handleCheckout}
      disabled={cartCount === 0}
      className="mt-6 w-full bg-green-600 text-white py-2 rounded-md hover:bg-green-700 transition disabled:bg-gray-400 disabled:cursor-not-allowed"
    >
      {t('checkout')}
    </button>
  );
}