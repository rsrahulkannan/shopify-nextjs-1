"use client";
import { useEffect, useState } from "react";
import { getCart, updateCartQuantity, removeFromCart } from "@/lib/shopify";
import { FaTrash } from "react-icons/fa";
import Link from "next/link";
import CartButton from "../CartButton";

export default function CartPage() {
  const [cart, setCart] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);

    const fetchCart = async () => {
      const cartId = localStorage.getItem("cartId");
      if (!cartId) {
        setLoading(false);
        return;
      }
      try {
        const cartData = await getCart(cartId);
        setCart(cartData);
      } catch (error) {
        console.error("Error fetching cart:", error);
      }
      setLoading(false);
    };

    fetchCart();
  }, []);

  const handleQuantityChange = async (lineId: string, newQuantity: number) => {
    if (newQuantity < 1) return;
    const cartId = localStorage.getItem("cartId");
    if (!cartId) return;

    try {
      const updatedCart = await updateCartQuantity(cartId, lineId, newQuantity);
      setCart(updatedCart);
    } catch (error) {
      console.error("Error updating quantity:", error);
    }
  };

  const handleRemoveFromCart = async (lineId: string) => {
    const cartId = localStorage.getItem("cartId");
    if (!cartId) return;

    try {
      const updatedCart = await removeFromCart(cartId, lineId);
      setCart(updatedCart);
    } catch (error) {
      console.error("Error removing item from cart:", error);
    }
  };

  if (!isClient) return null;
  if (loading) return <p>Loading cart...</p>;
  if (!cart || !cart.lines?.edges.length) return <p>Your cart is empty.</p>;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <Link href="/">
          <h1 className="text-3xl font-bold text-gray-800">Shopify Store</h1>
        </Link>
        <h1 className="text-3xl font-bold mb-4">My Cart</h1>
        <CartButton />
      </div>
      <div className="space-y-4">
        {cart.lines.edges.map(({ node }: any) => {
          const product = node.merchandise?.product || {}; // Ensure product exists
          const featuredImage = product.featuredImage || {}; // Ensure featuredImage exists
          const title = product.title || "Unknown Product"; // Fallback for title
          const variantTitle = node.merchandise?.title || "No Variant"; // Fallback for variant title
          const price = node.merchandise?.priceV2?.amount || "0.00"; // Fallback for price

          return (
            <div key={node.id} className="flex items-center border p-4 rounded-md">
              {featuredImage.url ? (
                <img
                  src={featuredImage.url}
                  alt={title}
                  className="w-20 h-20 object-cover mr-4"
                />
              ) : (
                <div className="w-20 h-20 bg-gray-200 flex items-center justify-center text-sm">
                  No Image
                </div>
              )}
              <div className="flex-1">
                <h2 className="text-lg font-semibold">{title}</h2>
                <p className="text-gray-600">{variantTitle}</p>
                <p className="font-bold">${price}</p>
              </div>
              <div className="flex items-center">
                <button 
                  onClick={() => handleQuantityChange(node.id, node.quantity - 1)} 
                  className="px-3 py-1 bg-gray-300 rounded-md"
                >
                  -
                </button>
                <span className="mx-2">{node.quantity}</span>
                <button 
                  onClick={() => handleQuantityChange(node.id, node.quantity + 1)} 
                  className="px-3 py-1 bg-gray-300 rounded-md"
                >
                  +
                </button>
                <button
                  onClick={() => handleRemoveFromCart(node.id)}
                  className="ml-4 px-3 py-2 bg-red-800 text-white rounded-md hover:bg-red-600"
                >
                  <FaTrash />
                </button>
              </div>
            </div>
          );
        })}
      </div>
      <h2 className="text-2xl font-bold mt-6">
        Total: ${cart.cost?.totalAmount?.amount || "0.00"} {cart.cost?.totalAmount?.currencyCode || ""}
      </h2>
    </div>
  );
}