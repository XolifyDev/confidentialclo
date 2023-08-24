import { config } from "@/config";
import React, { ReactNode } from "react";
import { Resend } from "resend";

export const emailer = new Resend(config.resend.apiKey);

export async function sendEmail(args: any, Template: string) {
  const data = await emailer.sendEmail({
    from: "Xolify <noreply@emails.xolify.store>",
    to: [args.user?.email!],
    subject: `Your order #${args.order.sessionId}`,
    react: React.createElement(await import(Template), {
      ...args,
    }),
  });

  return data;
}
