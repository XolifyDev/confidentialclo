"use server";

import { prisma } from "../db";

export const findUserByEmail = async ({ email }: { email: string }) => {
    return await prisma.user.findUnique({
        where: {
            email
        }
    });
}