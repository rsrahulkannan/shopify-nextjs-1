"use client";
import { useEffect, useState } from "react";
import { getCart } from "@/lib/shopify";

export default function CartPage() {
  const [cart, setCart] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCart = async () => {
      const cartId = localStorage.getItem("cartId");
      if (!cartId) {
        setLoading(false);
        return;
      }
      try {
        const cartData = await getCart(cartId);
        console.log(cartData);
        
        setCart(cartData);
      } catch (error) {
        console.error("Error fetching cart:", error);
      }
      setLoading(false);
    };

    fetchCart();
  }, []);

  if (loading) return <p>Loading cart...</p>;
  if (!cart) return <p>Your cart is empty.</p>;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-4">Shopping Cart</h1>
      {cart.lines.edges.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        <div className="space-y-4">
          {cart.lines.edges.map(({ node }: any) => (
            <div key={node.id} className="flex items-center border p-4 rounded-md">
              <img
                src={node.merchandise.product.featuredImage?.url}
                alt={node.merchandise.product.title}
                className="w-20 h-20 object-cover mr-4"
              />
              <div className="flex-1">
                <h2 className="text-lg font-semibold">{node.merchandise.product.title}</h2>
                <p className="text-gray-600">{node.merchandise.title}</p>
                <p className="font-bold">${node.merchandise.priceV2.amount}</p>
              </div>
              <p className="text-gray-800">Qty: {node.quantity}</p>
            </div>
          ))}
        </div>
      )}
      <h2 className="text-2xl font-bold mt-6">
        Total: ${cart.cost.totalAmount.amount} {cart.cost.totalAmount.currencyCode}
      </h2>
    </div>
  );
}
