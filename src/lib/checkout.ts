const domain = process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN;
const accessToken = process.env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN;
const apiVersion = process.env.NEXT_PUBLIC_SHOPIFY_API_VERSION;

export async function createCheckout(lineItems: { merchandiseId: string; quantity: number }[]) {
    const query = `
      mutation cartCreate($input: CartInput!) {
        cartCreate(input: $input) {
          cart {
            id
            checkoutUrl
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
            lines: lineItems,
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

        if (jsonResponse.errors || jsonResponse.data.cartCreate.userErrors?.length > 0) {
            const errors = jsonResponse.errors || jsonResponse.data.cartCreate.userErrors;
            console.error("GraphQL Errors:", errors);
            throw new Error(errors.map((err: any) => err.message).join(", "));
        }

        return jsonResponse.data.cartCreate.cart.checkoutUrl;
    } catch (error) {
        console.error("Error creating checkout:", error);
        throw error;
    }
}