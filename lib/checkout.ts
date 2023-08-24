import { config } from "@/config";
import { CartItems } from "@/store/useGlobalStore";
import { Products } from "@prisma/client";
import { LineItem, loadStripe } from "@stripe/stripe-js";
import { getRawBody } from "./utils";
import Stripe from "stripe";

const stripePromise = loadStripe(config.stripe.publishableKey);

export interface Cart extends CartItems {
  product: Products;
}

const stripe = new Stripe(config.stripe.clientSecret, {
  apiVersion: "2022-11-15",
});

export const checkout = async (items: Cart[]) => {
  // try {
  // console.log("dadada");
  const lineItems: any = [];
  console.log(items);
  const stripe1 = loadStripe(config.stripe.publishableKey);

  for (let i = 0; i < items.length; i++) {
    const e = items[i];
    console.log({
      price: e.product.price,
      size: e.size,
    });
    lineItems.push({
      price_data: {
        currency: "usd",
        product_data: {
          name: e.product.name,
          images: [e.product.mainImage],
        },
        unit_amount: Number(e.product.price) * 100,
      },
      quantity: 1,
    });
  }
  // const response = await fetch("/api/stripe/sessions", {
  //   method: "POST",
  //   headers: {
  //     "Content-Type": "application/json",
  //   },
  //   body: JSON.stringify({ lineItems }),
  // });
  // // @ts-ignore
  // // const rawData = await getRawBody(response.body);
  // // const body = JSON.parse(Buffer.from(rawData).toString("utf8"));
  // // const res = await response.json();
  // console.log(await response.text());
  console.log("settting session", lineItems);
  return await stripe.checkout.sessions.create({
    line_items: lineItems,
    mode: "payment",
    success_url: `${config.siteInfo.domain}/checkout/success?sessionId={CHECKOUT_SESSION_ID}`,
    shipping_address_collection: {
      allowed_countries: ["US"],
    },
  });
};

export async function getCheckoutSession(id: string) {
  return await stripe.checkout.sessions.retrieve(id);
}
