import { CartItems } from "@/store/useGlobalStore";
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { getProductById } from "./actions/dbActions";
import { Readable } from "stream";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export async function totalPrice(cart: CartItems[]) {
  let price = 0;
  // console.log(cart);

  for (let i = 0; i < cart.length; i++) {
    const e = cart[i];
    const product = await getProductById(e.productId);
    const productPrice = Number(product?.price);
    console.log(price + productPrice);
    return (price += productPrice);
  }

  return price;
}

export async function getRawBody(readable: Readable): Promise<Buffer> {
  const chunks = [];
  for await (const chunk of readable) {
    // @ts-ignore
    chunks.push(typeof chunk === "string" ? Buffer.from(chunk) : chunk);
  }
  return Buffer.concat(chunks);
}

export const silentUpdate = (url: string) =>
  window.history.replaceState(null, null, url);
