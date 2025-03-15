"use client";
import { useCart } from "@/context/CartContext";
import { getCart } from "@/lib/cart";
import { createCheckout } from "@/lib/checkout";

export default function CheckoutButton() {
  const { cartCount } = useCart();

  const handleCheckout = async () => {
    try {
      const cartId = localStorage.getItem("cartId");
      if (!cartId) {
        alert("Your cart is empty.");
        return;
      }

      // Fetch the cart data
      const cartData = await getCart(cartId);

      // Prepare line items for checkout
      const lineItems = cartData.lines.edges.map(({ node }: any) => ({
        merchandiseId: node.merchandise.id,
        quantity: node.quantity,
      }));

      // Create the checkout
      const checkoutUrl = await createCheckout(lineItems);

      // Redirect to the Shopify checkout page
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
      Proceed to Checkout
    </button>
  );
}