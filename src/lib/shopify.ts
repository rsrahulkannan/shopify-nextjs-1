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
          cost {
            totalAmount {
              amount
              currencyCode
            }
          }
        }
        userErrors {
          field
          message
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

  try {
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

    // Check for user errors returned by Shopify
    if (jsonResponse.errors || jsonResponse.data.cartCreate.userErrors?.length > 0) {
      const errors = jsonResponse.errors || jsonResponse.data.cartCreate.userErrors;
      console.error("GraphQL Errors:", errors);
      throw new Error(errors.map((err: any) => err.message).join(", "));
    }

    // Return the created cart
    return jsonResponse.data.cartCreate.cart;
  } catch (error) {
    console.error("Error creating cart:", error);
    throw error;
  }
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

export async function updateCart(cartId: string, merchandiseId: string, quantity: number) {
  const query = `
    mutation cartLinesAdd($cartId: ID!, $lines: [CartLineInput!]!) {
      cartLinesAdd(cartId: $cartId, lines: $lines) {
        cart {
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
          cost {
            totalAmount {
              amount
              currencyCode
            }
          }
        }
        userErrors {
          field
          message
        }
      }
    }
  `;

  const variables = {
    cartId,
    lines: [
      {
        merchandiseId,
        quantity,
      },
    ],
  };

  try {
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

    // Check for user errors returned by Shopify
    if (jsonResponse.errors || jsonResponse.data.cartLinesAdd.userErrors?.length > 0) {
      const errors = jsonResponse.errors || jsonResponse.data.cartLinesAdd.userErrors;
      console.error("GraphQL Errors:", errors);
      throw new Error(errors.map((err: any) => err.message).join(", "));
    }

    // Return the updated cart
    return jsonResponse.data.cartLinesAdd.cart;
  } catch (error) {
    console.error("Error updating cart:", error);
    throw error;
  }
}

export async function removeFromCart(cartId: string, lineId: string) {
  const query = `
    mutation cartLinesRemove($cartId: ID!, $lineIds: [ID!]!) {
      cartLinesRemove(cartId: $cartId, lineIds: $lineIds) {
        cart {
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
          cost {
            totalAmount {
              amount
              currencyCode
            }
          }
        }
        userErrors {
          field
          message
        }
      }
    }
  `;

  const variables = {
    cartId,
    lineIds: [lineId],
  };

  try {
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

    // Check for user errors returned by Shopify
    if (jsonResponse.errors || jsonResponse.data.cartLinesRemove.userErrors?.length > 0) {
      const errors = jsonResponse.errors || jsonResponse.data.cartLinesRemove.userErrors;
      console.error("GraphQL Errors:", errors);
      throw new Error(errors.map((err: any) => err.message).join(", "));
    }

    // Return the updated cart
    return jsonResponse.data.cartLinesRemove.cart;
  } catch (error) {
    console.error("Error removing item from cart:", error);
    throw error;
  }
}