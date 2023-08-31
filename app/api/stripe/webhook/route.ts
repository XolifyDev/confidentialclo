import type { NextApiRequest, NextApiResponse } from "next";
import { buffer } from "micro";
import Stripe from "stripe";
import { config as config1 } from "@/config";
import { prisma } from "@/lib/db";
import {
  getOrderBySession,
  getOrderProductsByOrderId,
  getProductById,
} from "@/lib/actions/dbActions";
import tailwindRn from "tailwind-rn";
import { NextResponse } from "next/server";
import { Readable } from "stream";
import { headers } from "next/headers";
import { emailer } from "@/lib/emailer";

export const stripe = new Stripe(config1.stripe.clientSecret, {
  apiVersion: "2022-11-15",
});

async function getRawBody(readable: Readable): Promise<Buffer> {
  const chunks = [];
  for await (const chunk of readable) {
    // @ts-ignore
    chunks.push(typeof chunk === "string" ? Buffer.from(chunk) : chunk);
  }
  return Buffer.concat(chunks);
}

export const POST = async (req: NextApiRequest) => {
  const res = NextResponse;
  const headersInstance = headers();
  // console.log(req);
  const rawData = await getRawBody(req.body);
  const buf = JSON.parse(Buffer.from(rawData).toString("utf8"));
  const sig = headersInstance.get("stripe-signature") as string;

  let event = stripe.webhooks.constructEvent(
    Buffer.from(rawData).toString("utf8"),
    sig,
    config1.stripe.webhookSecret
  );
  // console.log(buf.customer_details, "EVENT");
  switch (event.type) {
    case "payment_intent.succeeded":
      const paymentIntentSucceeded = event.data.object as {
        id: string;
        receipt_email: string;
      };
      // console.log(paymentIntentSucceeded, "PAYMENTINTENT");
      const sessionFromStripe = await stripe.checkout.sessions.list({
        payment_intent: event.data.object.id,
      });
      // console.log(sessionFromStripe);
      if (!sessionFromStripe) return res.json(`No Checkout session...`);
      const dbSession = await prisma.checkoutSession.findFirst({
        where: {
          sessionId: sessionFromStripe.data[0].id,
        },
      });

      // console.log(dbSession, "DBSESSION");

      if (!dbSession) return res.json(`No Checkout session...`);

      await prisma.checkoutSession.update({
        data: {
          completed: "true",
        },
        where: {
          id: dbSession.id,
        },
      });
      const firstOrder = await prisma.orders.findFirst({
        where: {
          sessionId: dbSession.id,
        },
      });
      if (!firstOrder) return res.json(`No Checkout session...`);
      await prisma.orders.update({
        where: {
          id: firstOrder.id,
        },
        data: {
          address: `${
            sessionFromStripe.data[0].shipping_details?.address || ""
          }`,
        },
      });
      const isMonthAndYear = await prisma.analytics.findFirst({
        where: {
          month: new Date().getMonth().toLocaleString(),
          year: `${new Date().getFullYear()}`,
        },
      });
      if (isMonthAndYear) {
        await prisma.analytics.update({
          where: {
            id: isMonthAndYear.id,
          },
          data: {
            amount: `${
              Number(isMonthAndYear) + sessionFromStripe.data[0].amount_total!
            }`,
          },
        });
      }
      const user = await prisma.user.findFirst({
        where: {
          id: dbSession.userId,
        },
      });

      let html = config1.emails.html;
      // let html = `<html>

      // <head>
      //   <meta charset="utf-8">
      //   <meta name="viewport" content="width=device-width">
      //   <title>{STORE_NAME}</title>
      //   <link rel="preconnect" href="https://fonts.googleapis.com">
      //   <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
      //   <link href="https://fonts.googleapis.com/css2?family=Inter&display=swap" rel="stylesheet">
      //   <style>
      //     body {
      //       font-family: 'Inter', sans-serif;
      //     }
      //     .logo {
      //       width: 6rem;
      //       border-radius: 1.5rem;
      //     }
      //     .flex {
      //       display: flex;
      //     }
      //     .flex-col {
      //       flex-direction: column;
      //     }
      //     .flex-row {
      //       flex-direction: row;
      //     }
      //   </style>
      // </head>

      // <body>
      //   <div class="flex flex-col" style="padding: 2vh 5vh;">
      //     <div class="flex flex-row" style="justify-content: space-between; width: 90%; align-items: center;">
      //       <img src="{LOGO}" class="logo">
      //       <a href="{DOMAIN}/account">
      //         <img
      //           src="https://static.vecteezy.com/system/resources/thumbnails/005/545/335/small/user-sign-icon-person-symbol-human-avatar-isolated-on-white-backogrund-vector.jpg"
      //           width="50" height="40">
      //       </a>
      //     </div>
      //     <div class="flex flex-col" style="margin-top: 20%; padding: 0 10%; width: 100%; gap: 10px;">
      //       <span style="color: blue;">
      //         Thank you for your purchase!
      //       </span>
      //       <span style="font-weight: bold; font-size: 20px;">
      //         It's on its way!
      //       </span>
      //       <span>
      //         Your order #<a href="{DOMAIN}/orders/{ORDER_ID}" style="color:gray">{ORDER_ID}</a> {ORDER_STATUS_TEXT}
      //       </span>
      //     </div>
      //     <div class="flex flex-col" style="margin-top: 5%; padding: 0 10%; gap: 10px; width: 70%;">
      //       {ORDER_PRODUCTS}
      //     </div>
      //   </div>
      // </body>
      // </html>`;
      const order = await getOrderBySession(dbSession.sessionId);
      if (!order) return res.json(`No Order...`);
      const orderProducts = await getOrderProductsByOrderId(order.id);
      let orderProductsHTML = "";
      orderProducts.forEach(async (e) => {
        const product = e.product;
        orderProductsHTML += `
          <div style="border-bottom: 1px solid black; height: 1px;" />
      <div
        style="width: 100%; border-bottom: 1px solid black; padding: 1rem 0px; display: flex; flex-direction: row; align-items: center;">
        <div
          style="height: 10%; width: 2%; overflow: hidden; border-radius: calc(0.5rem - 2px); border: 1px solid rgb(229 231 235 / 1);">
          <img src="${product?.mainImage}"
            style="height: 100%; width: 70%; object-fit: cover; object-position: center;">
        </div>
        <div class="flex flex-col" style="width: 100% !important; height: 100%;">
          <div>
            <div
              class="flex"
              style="justify-content: space-between; font-size: 1rem; line-height: 1.5rem; font-weight: 500; color: rgb(17 24 39 / 1);">
              <h3 style="font-size: 16px;">
                <a style="color: inherit;
    text-decoration: inherit;" href={'/store/${product?.url}'}>${product?.name}</a>
              </h3>
            </div>
            <p style="margin-top: -10px; font-size: 0.875rem/* 14px */;
    line-height: 1.25rem/* 20px */; color: rgb(107 114 128 / 1);">${product?.description}</p>
          </div>
          <div class="" style="margin-top: 20%; display: flex; align-items: flex-end; gap: 0.5rem; font-size: 0.875rem/* 14px */;
    line-height: 1.25rem/* 20px */;">
            <p style='font-weight: 700;'>Size <span
                style="color: rgb(107 114 128 / 1); font-weight: 400;">${e?.size}</span></p>
            <p style="margin-left: 2rem; font-weight: 700;">Price <span
                style="color: rgb(107 114 128 / 1); font-weight: 400;">${product?.price}</span></p>
          </div>
        </div>
      </div>
          `;
      });
      setTimeout(async () => {
        console.log("SET TIMEOUT");
        let content = `
          <style>
            body {
              font-family: 'Inter', sans-serif;
            }
            .logo {
              width: 6rem;
              border-radius: 1.5rem;
            }
            
          </style>
              <h3 style="color: blue;">
                Thank you for your purchase!
              </h3>
              <h2 style="font-weight: bold; font-size: 20px;">
                It's on its way!
              </h2>
              <p>
                Your order #<a href="{DOMAIN}/orders/{ORDER_ID}" style="color:gray">{ORDER_ID}</a> {ORDER_STATUS_TEXT}
              </p>
            {ORDER_PRODUCTS}`;
        html = html
          .replaceAll("{REPLACE_CONTENT}", content)
          .replaceAll("{REPLACE_SUBJECT}", `Your order #${dbSession.id}`)
          .replaceAll("{DOMAIN}", config1.siteInfo.domain)
          .replaceAll("{ORDER_ID}", dbSession.id)
          .replaceAll(
            "{ORDER_STATUS_TEXT}",
            order.status === "shipped"
              ? "has been shipped and will be with you soon!"
              : order.status === "being_shipped"
              ? "is getting shipped and will be at your doorsteps soon!"
              : order.status === "not_shipped"
              ? "is being proccessed and will be shipped soon!"
              : "is being proccessed and will be shipped soon!"
          )
          .replaceAll("{LOGO}", `${config1.siteInfo.domain}/static/logo.png`)
          .replaceAll("{ORDER_PRODUCTS}", orderProductsHTML)
          .replaceAll("{SITE_NAME}", config1.siteInfo.name);
        console.log(html);
        if (user) {
          const data = await emailer.sendEmail({
            from: "Xolify <noreply@emails.xolify.store>",
            to: [user.email!],
            subject: `Your order #${dbSession.id}`,
            html: html,
          });
          console.log(data);
          return res.json(data);
        }
      }, 500);

      break;
    default:
      console.log(`Unhandled event type ${event.type}`);
  }
  return res.json({ received: true });
};
