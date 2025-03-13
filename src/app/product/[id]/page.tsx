import { getProductById } from "@/lib/shopify";

export default async function ProductPage({ params }: { params: { id: string } }) {
    // Fetch cartId from API Route
    const response = await fetch(`${process.env.NEXT_PUBLIC_SITE_URL}/api/cart`, {
        cache: "no-store",
    });
    const { cartId } = await response.json();

    const product = await getProductById(params.id);

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-lg overflow-hidden border">
                <img src={product.image} alt={product.title} className="w-full h-96 object-cover" />
                <div className="p-6">
                    <h1 className="text-3xl font-bold text-gray-900">{product.title}</h1>
                    <p className="text-gray-700 mt-4">{product.description}</p>
                    <p className="text-lg font-bold text-gray-800 mt-2">${product.price}</p>
                    <button className="mt-4 w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition">
                        Add to Cart
                    </button>
                </div>
            </div>
        </div>
    );
}
