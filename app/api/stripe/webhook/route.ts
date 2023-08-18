import type { NextApiResponse, NextApiRequest } from "next";
import { buffer } from "micro";
import Stripe from "stripe";
import { config as config1 } from "@/config";
import { prisma } from "@/lib/db";

export const stripe = new Stripe(config1.stripe.publishableKey, {
  apiVersion: "2022-11-15",
});

export const config = {
  api: {
    bodyParser: false,
  },
};

const webhook = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === "POST") {
    const buf = await buffer(req);
    const sig = req.headers["stripe-signature"] as string;
    let event;

    try {
      event = stripe.webhooks.constructEvent(
        buf,
        sig,
        config1.stripe.webhookSecret
      );
    } catch (err) {
      let message = "Unknown Error";
      if (err instanceof Error) message = err.message;
      res.status(400).send(`Webhook Error: ${message}`);
      return;
    }
    switch (event.type) {
      case "payment_intent.succeeded":
        const paymentIntentSucceeded = event.data.object as {
          id: string;
          receipt_email: string;
        };

        const dbSession = await prisma.checkoutSession.findUnique({
          where: {
            sessionId: event.id,
          },
        });

        if (!dbSession) return res.status(400).send(`No Checkout session...`);

        await prisma.checkoutSession.update({
          data: {
            completed: "true",
          },
          where: {
            id: dbSession.id,
          },
        });

        break;
      default:
        console.log(`Unhandled event type ${event.type}`);
    }
    res.json({ received: true });
  } else {
    res.setHeader("Allow", "POST");
    res.status(405).end("Method Not Allowed");
  }
};

export default webhook;
