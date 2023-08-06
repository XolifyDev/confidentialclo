"use client";
import { SessionProvider } from "next-auth/react";
import { ReactNode, createContext, useEffect, useState } from "react";
import getSession from "../actions/getSession";
import { prisma } from "../db";
import { User } from "@prisma/client";

interface AuthContextProps {
    children: React.ReactNode;
}

type AuthContextProviderValue = {
    user: User;
    setUser: () => void;
}

export const AuthContext = createContext<null | AuthContextProviderValue>(null);

export const AuthContextProvider =  ({ children }: AuthContextProps) => {
    const [user, setUser] = useState<User | null>(null);
    
    useEffect(() => {
        const setSession = async () => {
            const session = await getSession();
            if (!session) {
                return setUser(null);
            };

            const currentUser = await prisma.user.findUnique({
                where: {
                    email: session.user.email as string
                }
            });

            if (!currentUser) {
                return setUser(null);
            }

            return setUser(currentUser);
        }
        setSession();

        const intervalId = setInterval(() => {
            setSession();
        }, 5000);

        return () => {
            clearInterval(intervalId);
        }
    });

    return (
        <AuthContext.Provider value={{
            user,
            setUser
        }}>
            {children}
        </AuthContext.Provider>
    )
}