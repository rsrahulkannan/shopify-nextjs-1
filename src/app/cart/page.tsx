"use client";
import { useEffect, useState } from "react";
import { FaTrash } from "react-icons/fa";
import CheckoutButton from "../../components/CheckoutButton";
import Navbar from "../../components/Navbar";
import LoadingOverlay from "../../components/LoadingOverlay";
import { getCart, removeFromCart, updateCartQuantity } from "@/lib/cart";
import Image from "next/image";

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
  if (loading) return <LoadingOverlay />;
  if (!cart || !cart.lines?.edges.length) return <p>Your cart is empty.</p>;

  return (
    <div>
      <Navbar />

      <div className="container mx-auto px-4 py-24">
        <div className="flex flex-col lg:flex-row gap-8">
          <div className="flex-1 space-y-4">
            {cart.lines.edges.map(({ node }: any) => {
              const product = node.merchandise?.product || {};
              const featuredImage = product.featuredImage || {};
              const title = product.title || "Unknown Product";
              const variantTitle = node.merchandise?.title || "No Variant";
              const price = node.merchandise?.priceV2?.amount || "0.00";

              return (
                <div
                  key={node.id}
                  className="flex flex-col sm:flex-row items-center justify-between bg-white shadow-lg rounded-lg p-4 hover:shadow-xl transition-shadow duration-300"
                >
                  <div className="flex items-center flex-1">
                    {featuredImage.url ? (
                      <Image
                        width={224}
                        height={224}
                        src={featuredImage.url}
                        alt={title}
                        className="w-20 h-20 object-cover rounded-lg mr-4"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      />
                    ) : (
                      <div className="w-20 h-20 bg-gray-200 flex items-center justify-center text-sm rounded-lg">
                        No Image
                      </div>
                    )}
                    <div className="flex-1">
                      <h2 className="text-lg font-semibold">{title}</h2>
                      <p className="font-bold">${price}</p>
                    </div>
                  </div>

                  <div className="flex items-center mt-4 sm:mt-0">
                    <div className="flex items-center border border-gray-300 rounded-md">
                      <button
                        onClick={() => handleQuantityChange(node.id, node.quantity - 1)}
                        className="px-3 py-1 bg-gray-100 hover:bg-gray-200 rounded-l-md"
                      >
                        -
                      </button>
                      <span className="px-3 py-1 border-x border-gray-300">{node.quantity}</span>
                      <button
                        onClick={() => handleQuantityChange(node.id, node.quantity + 1)}
                        className="px-3 py-1 bg-gray-100 hover:bg-gray-200 rounded-r-md"
                      >
                        +
                      </button>
                    </div>
                    <button
                      onClick={() => handleRemoveFromCart(node.id)}
                      className="ml-4 px-3 py-2 text-red-500 rounded-md transition-colors duration-300"
                    >
                      <FaTrash />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="w-full lg:w-1/4">
            <div className="p-6 bg-white shadow-lg rounded-lg">
              <h2 className="text-2xl font-bold">
                Total: ${cart.cost?.totalAmount?.amount || "0.00"} {cart.cost?.totalAmount?.currencyCode || ""}
              </h2>
              <div className="mt-4">
                <CheckoutButton />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}