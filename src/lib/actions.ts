"use server";

import { cookies } from "next/headers";
import { createCart } from "@/lib/shopify";

export async function getOrCreateCart() {
    const cookieStore = cookies();
    let cartId = (await cookieStore).get("cartId")?.value;

    if (!cartId) {
        const cart = await createCart();
        cartId = cart.id;
        (await cookieStore).set("cartId", cartId);
    }

    return cartId;
}
