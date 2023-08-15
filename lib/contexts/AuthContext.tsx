"use client";
import { SessionProvider, useSession } from "next-auth/react";
import { ReactNode, createContext, useEffect, useState } from "react";
import getSession from "../actions/getSession";
import { prisma } from "../db";
import { User } from "@prisma/client";

interface AuthContextProps {
    children: React.ReactNode;
}

type AuthContextProviderValue = {
    user: User | null;
    setUser: (arg: any) => void | null;
}

export const AuthContext = createContext<AuthContextProviderValue | null >(null);

export const AuthContextProvider =  ({ children }: AuthContextProps) => {
    const [user, setUser] = useState<User | null>(null);
    
    useEffect(() => {
        const setSession = async () => {
            const session = useSession()
            if (session.status === "unauthenticated") {
                return setUser(null);
            };

            const currentUser = await prisma.user.findUnique({
                where: {
                    email: session.data?.user.email as string
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