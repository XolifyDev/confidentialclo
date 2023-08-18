"use server";

import { useSession } from "next-auth/react";
import { prisma } from "../db";
import { CartItems } from "@/store/useGlobalStore";

export const findUserByEmail = async ({ email }: { email: string }) => {
  return await prisma.user.findUnique({
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
  if (!id) return { error: { message: "ID is not defined" } };
  console.log("searchgin for product");
  const product = await prisma.products.findFirst({
    where: {
      id,
    },
  });

  if (!product) return { error: { message: "Invalid Product." } };
  console.log("product found");

  await prisma.products.delete({
    where: {
      id,
    },
  });
  console.log("product deleted");

  return {};
};

export const deleteCategory = async (id: string) => {
  if (!id) return { error: { message: "ID is not defined" } };
  console.log("searchgin for product");
  const product = await prisma.products.findFirst({
    where: {
      id,
    },
  });

  if (!product) return { error: { message: "Invalid Product." } };
  console.log("product found");

  await prisma.products.delete({
    where: {
      id,
    },
  });
  console.log("product deleted");

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
  return await prisma.checkoutSession.create({
    data: {
      items,
      sessionId: id,
      userId,
    },
  });
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
