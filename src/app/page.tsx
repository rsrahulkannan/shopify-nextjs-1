import Link from "next/link";
import AddToCartButton from "../components/AddToCartButton";
import CartButton from "../components/CartButton";
import { getProducts } from "@/lib/product";

export default async function Home({
  searchParams,
}: {
  searchParams: { search?: string };
}) {
  const searchQuery = searchParams.search || '';

  const response = await getProducts({ searchQuery });
  const products = response.data.products.edges;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <Link href="/">
          <h1 className="text-3xl font-bold text-gray-800">Shopify Store</h1>
        </Link>
        <CartButton />
      </div>

      {/* Search Box */}
      <div className="mb-8">
        <input
          type="text"
          id="searchInput"
          placeholder="Search products..."
          defaultValue={searchQuery}
          autoFocus
          className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600"
        />
      </div>

      {/* Product Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {products.map((product) => (
          <div key={product.node.id} className="bg-white shadow-lg rounded-lg overflow-hidden border">
            <Link href={`/product/${product.node.id.split("/").pop()}`}>
              <img
                src={product.node.featuredImage.url}
                alt={product.node.title}
                className="w-full h-56 object-cover cursor-pointer"
              />
            </Link>
            <div className="p-4">
              <Link href={`/product/${product.node.id.split("/").pop()}`}>
                <h2 className="text-lg font-semibold text-gray-900 hover:text-blue-600 cursor-pointer">
                  {product.node.title}
                </h2>
              </Link>
              <p className="text-sm text-gray-600 mt-2 line-clamp-2">{product.node.description}</p>
              <p className="text-md font-bold text-gray-800 mt-2">${product.node.priceRange.minVariantPrice.amount}</p>
              <AddToCartButton productId={product.node.variants.edges[0]?.node.id} />
            </div>
          </div>
        ))}
      </div>

      {/* Client-side JavaScript for Automatic Search */}
      <script
        dangerouslySetInnerHTML={{
          __html: `
            document.getElementById('searchInput').addEventListener('input', function(event) {
              const searchQuery = event.target.value.trim();
              const url = new URL(window.location.href);
              if (searchQuery) {
                url.searchParams.set('search', searchQuery);
              } else {
                url.searchParams.delete('search');
              }
              window.location.href = url.toString();
            });
          `,
        }}
      />
    </div>
  );
}