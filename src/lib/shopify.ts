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

export async function createCart(product: { merchandiseId: string; quantity: number }) {
  const query = `
  mutation CreateCart($input: CartInput!) {
    cartCreate(input: $input) {
      cart {
        id
        createdAt
        updatedAt
        lines(first: 10) {
          edges {
            node {
              id
              quantity
              merchandise {
                ... on ProductVariant {
                  id
                }
              }
            }
          }
        }
        cost {
          totalAmount {
            amount
            currencyCode
          }
        }
      }
    }
  }
`;

  const variables = {
    input: {
      lines: [
        {
          merchandiseId: product.merchandiseId,
          quantity: product.quantity,
        },
      ],
    },
  };
  console.log(`https://${domain}/api/${apiVersion}/graphql.json`);
  
  const response = await fetch(`https://${domain}/api/${apiVersion}/graphql.json`, {
    method: "POST",
    headers: {
      "X-Shopify-Storefront-Access-Token": accessToken as string,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ query, variables }),
  });

  if (!response.ok) {
    throw new Error(`Shopify API request failed: ${response.statusText}`);
  }

  const jsonResponse = await response.json();
  return jsonResponse.data.cartCreate.cart;
}

export async function getCart(cartId: string) {
  const query = `
    query GetCart($cartId: ID!) {
      cart(id: $cartId) {
        id
        lines(first: 10) {
          edges {
            node {
              id
              quantity
              merchandise {
                ... on ProductVariant {
                  id
                  title
                  product {
                    title
                    featuredImage {
                      url
                    }
                  }
                  priceV2 {
                    amount
                    currencyCode
                  }
                }
              }
            }
          }
        }
        cost {
          totalAmount {
            amount
            currencyCode
          }
        }
      }
    }
  `;

  const variables = { cartId };

  const response = await fetch(`https://${domain}/api/${apiVersion}/graphql.json`, {
    method: "POST",
    headers: {
      "X-Shopify-Storefront-Access-Token": accessToken,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ query, variables }),
  });

  if (!response.ok) {
    throw new Error(`Shopify API request failed: ${response.statusText}`);
  }

  const jsonResponse = await response.json();
  return jsonResponse.data.cart;
}

export async function updateCartQuantity(cartId: string, lineId: string, quantity: number) {
  const query = `
    mutation cartLinesUpdate($cartId: ID!, $lines: [CartLineUpdateInput!]!) {
      cartLinesUpdate(cartId: $cartId, lines: $lines) {
        cart {
          id
          cost {
            totalAmount {
              amount
              currencyCode
            }
          }
          lines(first: 10) {
            edges {
              node {
                id
                quantity
                merchandise {
                  ... on ProductVariant {
                    id
                    title
                    priceV2 {
                      amount
                      currencyCode
                    }
                    product {
                      title
                      featuredImage {
                        url
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  `;

  const response = await fetch(`https://${domain}/api/${apiVersion}/graphql.json`, {
    method: "POST",
    headers: {
      "X-Shopify-Storefront-Access-Token": accessToken,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      query,
      variables: {
        cartId,
        lines: [{ id: lineId, quantity }],
      },
    }),
  });

  if (!response.ok) {
    throw new Error(`Shopify API request failed: ${response.statusText}`);
  }

  const jsonResponse = await response.json();
  return jsonResponse.data.cartLinesUpdate.cart;
}