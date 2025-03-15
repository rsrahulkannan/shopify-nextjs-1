// import { NextResponse } from "next/server";
// import { cookies } from "next/headers";
// import { createCart } from "@/lib/shopify";

// export async function GET() {
//     // const cookieStore = cookies();
//     // let cartId = (await cookieStore).get("cartId")?.value;
//     let cartId = localStorage.getItem("cartId");

//     if (!cartId) {
//         const cart = await createCart();
//         cartId = cart.id;
//         localStorage.setItem("cartId", cart.id);
//     }

//     return NextResponse.json({ cartId });
// }
