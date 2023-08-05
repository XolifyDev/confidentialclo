"use server";

import { prisma } from "../db";

export const findUserByEmail = async ({ email }: { email: string }) => {
    return await prisma.user.findUnique({
        where: {
            email
        }
    });
}

export const getProducts = async () => {
    return await prisma.products.findMany();
}