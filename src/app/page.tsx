import Link from "next/link";
import { getProducts } from "../lib/shopify";

export default async function Home({
  searchParams,
}: {
  searchParams: { search?: string };
}) {
  const searchQuery = searchParams.search || '';

  // Fetch products with the search query
  const products = await getProducts({ searchQuery });

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-center text-gray-800 mb-8">Shopify Store</h1>

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
          <div key={product.id} className="bg-white shadow-lg rounded-lg overflow-hidden border">
            <Link href={`/product/${product.id.split("/").pop()}`}>
              <img
                src={product.image}
                alt={product.title}
                className="w-full h-56 object-cover cursor-pointer"
              />
            </Link>
            <div className="p-4">
              <Link href={`/product/${product.id.split("/").pop()}`}>
                <h2 className="text-lg font-semibold text-gray-900 hover:text-blue-600 cursor-pointer">
                  {product.title}
                </h2>
              </Link>
              <p className="text-sm text-gray-600 mt-2 line-clamp-2">{product.description}</p>
              <p className="text-md font-bold text-gray-800 mt-2">${product.price}</p>
              <button className="mt-4 w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition">
                Add to Cart
              </button>
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