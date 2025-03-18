import AddToCartButton from "../../../../components/AddToCartButton";
import Navbar from "@/components/Navbar";
import { getProductById } from "@/lib/product";
import Image from "next/image";

export default async function ProductPage({ params }: { params: { id: string } }) {
  const product = await getProductById(params.id);
  if (!product?.data?.product) return <p>Product not found</p>;

  return (
    <div>
      <Navbar />

      <div className="container mx-auto px-4 py-24">
        <div className="max-w-6xl mx-auto bg-white shadow-lg rounded-lg overflow-hidden border  mt-8">
          <div className="flex flex-col md:flex-row">
            <div className="md:w-1/2 p-6">
              <Image
                width={224}
                height={224}
                src={product.data.product.featuredImage?.url ? product.data.product.featuredImage?.url : "/no-image.jpeg"}
                alt={product.data.product.title}
                className="w-50 h-auto object-cover rounded-lg"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              />
            </div>

            <div className="md:w-1/2 p-6 flex flex-col justify-center">
              <h1 className="text-3xl font-bold text-gray-900 mb-4">{product.data.product.title}</h1>
              <div className="flex items-center mb-4">
                <p className="text-2xl font-bold text-gray-800">
                  ${product.data.product.priceRange.minVariantPrice.amount}
                </p>
                {product.data.product.variants.edges[0]?.node.compareAtPrice?.amount && (
                  <p className="text-lg text-gray-500 line-through ml-4">
                    ${product.data.product.variants.edges[0].node.compareAtPrice.amount}
                  </p>
                )}
              </div>
              <AddToCartButton productId={product.data.product.variants.edges[0]?.node.id} />
            </div>
          </div>

          <div className="p-6 border-t border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Description</h2>
            <p className="text-gray-700">{product.data.product.description}</p>
          </div>
        </div>
      </div>
    </div>
  );
}