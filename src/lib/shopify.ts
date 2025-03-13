const domain = process.env.SHOPIFY_STORE_DOMAIN;
const accessToken = process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN;
const apiVersion = process.env.SHOPIFY_API_VERSION;

export async function getProducts({
  searchQuery,
}: {
  searchQuery?: string;
} = {}) {
  const query = `
    {
      products(first: 10, query: "${buildQueryString({ searchQuery })}") {
        edges {
          node {
            id
            title
            description
            featuredImage {
              url
            }
            priceRange {
              minVariantPrice {
                amount
              }
            }
          }
        }
      }
    }`;

  const response = await fetch(`https://${domain}/api/${apiVersion}/graphql.json`, {
    method: "POST",
    headers: {
      "X-Shopify-Storefront-Access-Token": accessToken as string,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ query }),
  });

  if (!response.ok) {
    throw new Error(`Shopify API request failed: ${response.statusText}`);
  }

  const jsonResponse = await response.json();
  return jsonResponse.data.products.edges.map(({ node }: any) => ({
    id: node.id,
    title: node.title,
    description: node.description,
    image: node.featuredImage ? node.featuredImage.url : "",
    price: node.priceRange.minVariantPrice.amount,
  }));
}

function buildQueryString({ searchQuery }: { searchQuery?: string }) {
  const queryParts = [];
  if (searchQuery) {
    queryParts.push(`title:${searchQuery}* OR description:${searchQuery}*`);
  }
  return queryParts.join(' AND ');
}

export async function getProductById(id: string) {
  const query = `
    {
        product(id: "gid://shopify/Product/${id}") {
            id
            title
            description
            featuredImage {
                url
            }
            priceRange {
                minVariantPrice {
                    amount
                }
            }
        }
    }`;

  const response = await fetch(`https://${domain}/api/${apiVersion}/graphql.json`, {
    method: "POST",
    headers: {
      "X-Shopify-Storefront-Access-Token": accessToken as string,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ query }),
  });

  if (!response.ok) {
    throw new Error(`Shopify API request failed: ${response.statusText}`);
  }

  const jsonResponse = await response.json();
  return {
    id: jsonResponse.data.product.id,
    title: jsonResponse.data.product.title,
    description: jsonResponse.data.product.description,
    image: jsonResponse.data.product.featuredImage?.url || "",
    price: jsonResponse.data.product.priceRange.minVariantPrice.amount,
  };
}

export async function createCart() {
  const query = `
  mutation {
    cartCreate(input: {}) {
      cart {
        id
      }
    }
  }
`;

console.log(`https://${domain}/api/${apiVersion}/graphql.json`);

  const response = await fetch(`https://${domain}/api/${apiVersion}/graphql.json`, {
    method: "POST",
    headers: {
      "X-Shopify-Storefront-Access-Token": accessToken as string,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ query }),
  });

  if (!response.ok) {
    throw new Error(`Shopify API request failed: ${response.statusText}`);
  }

  const jsonResponse = await response.json();
  const cart = jsonResponse.data.cartCreate.cart;
  return cart;
}