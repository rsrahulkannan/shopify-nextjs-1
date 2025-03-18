"use client";
import Link from "next/link";
import AddToCartButton from "../../components/AddToCartButton";
import Navbar from "../../components/Navbar";
import { getProducts } from "@/lib/product";
import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import LoadingOverlay from "@/components/LoadingOverlay";
import Image from "next/image";
import { useTranslations } from "next-intl";

export default function Home() {
  const searchParams = useSearchParams();
  const searchQuery = searchParams.get("search") || "";

  const [products, setProducts] = useState<any[]>([]);
  const [pageInfo, setPageInfo] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const t = useTranslations('Product');

  const fetchProducts = async (after?: string, before?: string, isNewPage: boolean = false) => {
    setLoading(true);
    setError(null);
    try {
      const response = await getProducts({
        searchQuery,
        after,
        before,
        last: before ? 8 : undefined,
      });
      setProducts((prev) => (isNewPage ? response.products.edges : [...prev, ...response.products.edges]));
      setPageInfo(response.products.pageInfo);
    } catch (error) {
      console.error("Error fetching products:", error);
      setError("Failed to fetch products. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts(undefined, undefined, true);
  }, [searchQuery]);

  const handleNextPage = () => {
    if (pageInfo?.hasNextPage && pageInfo.endCursor) {
      fetchProducts(pageInfo.endCursor, undefined, true);
    }
  };

  const handlePreviousPage = () => {
    if (pageInfo?.hasPreviousPage && pageInfo.startCursor) {
      fetchProducts(undefined, pageInfo.startCursor, true);
    }
  };

  return (
    <div>
      <Navbar />

      {loading && <LoadingOverlay />}

      <div className="container mx-auto px-4 py-24">
        {error && <p className="text-red-500 mb-4">{error}</p>}

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mt-8">
          {products.map((product) => (
            <div
              key={product.node.id}
              className="bg-white shadow-lg rounded-lg overflow-hidden border hover:shadow-xl transition-shadow duration-300"
            >
              <Link href={`/product/${product.node.id.split("/").pop()}`}>
              <Image
                src={product.node.featuredImage?.url ? product.node.featuredImage?.url : "/no-image.jpeg"}
                alt={product.node.title}
                width={224}
                height={224}
                className="w-full h-56 object-cover cursor-pointer"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                priority={products.indexOf(product) < 4}
              />
              </Link>
              <div className="p-4">
                <Link href={`/product/${product.node.id.split("/").pop()}`}>
                  <h2 className="text-lg font-semibold text-gray-900 hover:text-blue-600 cursor-pointer">
                    {product.node.title}
                  </h2>
                </Link>
                <p className="text-sm text-gray-600 mt-2 line-clamp-2">{product.node.description}</p>
                <div className="flex items-center mt-2">
                  <p className="text-md font-bold text-gray-800">
                    {product.node.priceRange.minVariantPrice.amount}
                  </p>
                  {product.node.variants.edges[0]?.node.compareAtPrice?.amount && (
                    <p className="text-sm text-gray-500 line-through ml-2">
                      {product.node.variants.edges[0].node.compareAtPrice.amount}
                    </p>
                  )}
                </div>
                <AddToCartButton productId={product.node.variants.edges[0]?.node.id} />
              </div>
            </div>
          ))}
        </div>

        <div className="flex justify-between mt-8">
          <button
            onClick={handlePreviousPage}
            disabled={!pageInfo?.hasPreviousPage || !pageInfo.startCursor || loading}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            {t('prev')}
          </button>
          <button
            onClick={handleNextPage}
            disabled={!pageInfo?.hasNextPage || !pageInfo.endCursor || loading}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            {t('next')}
          </button>
        </div>
      </div>
    </div>
  );
}