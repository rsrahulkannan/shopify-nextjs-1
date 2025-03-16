const domain = process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN;
const accessToken = process.env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN;
const apiVersion = process.env.NEXT_PUBLIC_SHOPIFY_API_VERSION;

export async function getProducts({
  searchQuery,
  first = 2,
  last,
  after,
  before,
}: {
  searchQuery?: string;
  first?: number;
  last?: number;
  after?: string;
  before?: string;
} = {}) {
  const query = `
    {
      products(
        ${before ? `last: ${last || first}` : `first: ${first}`},
        query: "${buildQueryString({ searchQuery })}"
        ${after ? `, after: "${after}"` : ""}
        ${before ? `, before: "${before}"` : ""}
      ) {
        edges {
          cursor
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
                    price {
                      amount
                      currencyCode
                    }
                    compareAtPrice {
                      amount
                      currencyCode
                    }
                  }
                }
              }
            }
          }
        }
        pageInfo {
          hasNextPage
          hasPreviousPage
          startCursor
          endCursor
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

  if (jsonResponse.errors) {
    console.error("GraphQL Errors:", jsonResponse.errors);
    throw new Error(jsonResponse.errors.map((err: any) => err.message).join(", "));
  }

  if (!jsonResponse.data?.products) {
    throw new Error("No products data found in the response.");
  }

  return jsonResponse.data;
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
                    price {
                      amount
                      currencyCode
                    }
                    compareAtPrice {
                      amount
                      currencyCode
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