import { getProductById } from "@/lib/shopify";
import AddToCartButton from "../../../components/AddToCartButton";
import Link from "next/link";
import CartButton from "@/components/CartButton";

export default async function ProductPage({ params }: { params: { id: string } }) {
  const product = await getProductById(params.id);
  if (!product?.data?.product) return <p>Product not found</p>;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <Link href="/">
          <h1 className="text-3xl font-bold text-gray-800">Shopify Store</h1>
        </Link>
        <h1 className="text-3xl font-bold mb-4">Detail View</h1>
        <CartButton />
      </div>
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-lg overflow-hidden border">
        <img src={product.data.product.featuredImage?.url} alt={product.data.product.title} className="w-50 h-50 object-cover" />
        <div className="p-6">
          <h1 className="text-3xl font-bold text-gray-900">{product.data.product.title}</h1>
          <p className="text-gray-700 mt-4">{product.data.product.description}</p>
          <p className="text-lg font-bold text-gray-800 mt-2">
            ${product.data.product.priceRange.minVariantPrice.amount}
          </p>
          <AddToCartButton productId={product.data.product.variants.edges[0]?.node.id} />
        </div>
      </div>
    </div>
    </div>
  );
}
