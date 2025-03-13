import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createCart } from "@/lib/shopify";

export async function GET() {
    const cookieStore = cookies();
    let cartId = (await cookieStore).get("cartId")?.value;

    if (!cartId) {
        const cart = await createCart();
        cartId = cart.id;
        (await cookieStore).set("cartId", cartId, { path: "/", httpOnly: true });
    }

    return NextResponse.json({ cartId });
}
