const domain = process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN;
const accessToken = process.env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN;
const apiVersion = process.env.NEXT_PUBLIC_SHOPIFY_API_VERSION;

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
            ... on Product {
              variants(first: 5) {
                edges {
                  node {
                    id
                  }
                }
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
    return jsonResponse;
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
            ... on Product {
              variants(first: 5) {
                edges {
                  node {
                    id
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
    return jsonResponse;
}