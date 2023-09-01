"use server";

import { useSession } from "next-auth/react";
import { prisma } from "../db";
import { CartItems } from "@/store/useGlobalStore";
import { Orders, User } from "@prisma/client";

export const findUserByEmail = async ({ email }: { email: string }) => {
  return await prisma.user.findFirst({
    where: {
      email,
    },
  });
};

export const getProducts = async () => {
  return await prisma.products.findMany();
};

export const updateSiteSettings = async (args: any) => {
  return await prisma.siteSettings.updateMany({
    data: args,
  });
};

export const createSiteSettings = async (args: any) => {
  return await prisma.siteSettings.create({
    data: args,
  });
};

export const getSiteSettings = async () => {
  return {
    ...(await prisma.siteSettings.findFirst()),
    products: await prisma.products.findMany(),
    categories: await prisma.categories.findMany(),
  };
};

type CreateCategoryProps = {
  name: string;
  description: string;
  url: string;
};

export const createCategory = async ({
  description,
  name,
  url,
}: CreateCategoryProps) => {
  if (!description || !name || !url)
    return { error: { message: "Fill out all inputs..." } };
  const nameCheck = await prisma.categories.findFirst({
    where: {
      name,
    },
  });

  if (nameCheck) {
    return { error: { message: "Cateogry name is already in use..." } };
  }

  const urlCheck = await prisma.categories.findFirst({
    where: {
      url,
    },
  });

  if (urlCheck) {
    return { error: { message: "Cateogry url is already in use..." } };
  }

  const category = await prisma.categories.create({
    data: {
      name,
      url,
    },
  });

  if (category) {
    return category;
  }
};

export const deleteProduct = async (id: string) => {
  if (!id) return { error: { message: "URL is not defined" } };
  console.log("searchgin for product");
  const product = await prisma.products.findFirst({
    where: {
      url: id,
    },
  });

  if (!product) return { error: { message: "Invalid Product." } };
  console.log("product found");

  await prisma.products.delete({
    where: {
      id: product.id,
    },
  });
  console.log("product deleted");

  return {};
};

export const deleteCategory = async (id: string) => {
  if (!id) return { error: { message: "ID is not defined" } };
  console.log("searchgin for category");
  const product = await prisma.categories.findFirst({
    where: {
      id,
    },
  });

  if (!product) return { error: { message: "Invalid Cateogry." } };
  console.log("product found");

  await prisma.categories.delete({
    where: {
      id,
    },
  });
  console.log("category deleted");

  return {};
};

export const getCategoryByUrl = async (url: string) => {
  const category = await prisma.categories.findFirst({
    where: {
      url,
    },
  });
  return {
    category,
    products: await prisma.products.findMany({
      where: {
        categories: {
          has: category?.name,
        },
      },
    }),
  };
};

export const getProductByUrl = async (url: string) => {
  const product = await prisma.products.findFirst({
    where: {
      url,
    },
  });
  //   console.log(product);
  return product;
};

export const getProductById = async (id: string) => {
  const product = await prisma.products.findFirst({
    where: {
      id,
    },
  });
  //   console.log(product);
  return product;
};

export const createCheckoutSession = async (
  id: string,
  userId: string,
  items: any
) => {
  const session = await prisma.checkoutSession.create({
    data: {
      items,
      sessionId: id,
      userId,
      completed: "false",
    },
  });
  console.log(session, "SESSION");
  const order = await prisma.orders.create({
    data: {
      sessionId: id,
      status: "not_shipped",
      // user: userId,
      userId,
      address: "",
      discount: "",
    },
    include: {
      user: true,
    },
  });
  console.log(order, "ORDER");

  items.forEach(async (e: any) => {
    await prisma.orderProducts.create({
      data: {
        orderId: order.id,
        productId: e.productId,
        size: e.size,
      },
    });
  });

  return {
    session,
    order,
  };
};

export const getOrderBySession = async (sessionId: string) => {
  return await prisma.orders.findFirst({
    where: {
      sessionId,
    },
    include: {
      user: true,
    },
  });
};

export const getOrderById = async (id: string) => {
  return await prisma.orders.findFirst({
    where: {
      id,
    },
    include: {
      user: true,
    },
  });
};

export const getOrderProductsByOrderId = async (orderId: string) => {
  return await prisma.orderProducts.findMany({
    where: {
      orderId,
    },
    include: {
      product: true,
    },
  });
};

export const updateStatus = async (status: string, orderId: string) => {
  console.log(status, orderId);
  const order = await prisma.orders.update({
    where: {
      id: orderId,
    },
    data: {
      status: status,
    },
  });
  console.log(order);
};

interface OrderNewInterface extends Orders {
  user: User;
}

export const getOrdersWithUser = async () => {
  let orders: OrderNewInterface[] = [];

  const odb = await prisma.orders.findMany();
  for (let i = 0; i < odb.length; i++) {
    const e = odb[i];
    const user = await prisma.user.findFirst({
      where: {
        id: e.userId,
      },
    });

    orders.push({
      ...e,
      user: user!,
    });
  }

  return { orders };
};

export const getUsers = async () => {
  return await prisma.user.findMany();
};

export const updateUser = async (args: any, id: string) => {
  return await prisma.user.update({
    where: {
      id,
    },
    data: {
      ...args,
    },
  });
};

export const updateSessionAndSendEmail = async (sessionFromStripe: any) => {
  const dbSession = await prisma.checkoutSession.findFirst({
    where: {
      sessionId: sessionFromStripe.data[0].id,
    },
  });

  console.log(dbSession, "DBSESSION");

  if (!dbSession) return;

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
  if (!firstOrder) return;
  await prisma.orders.update({
    where: {
      id: firstOrder.id,
    },
    data: {
      address: `${sessionFromStripe.data[0].shipping_details?.address || ""}`,
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
  if (!order) return;
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
};
