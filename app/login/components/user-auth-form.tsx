"use client"

import * as React from "react"

import { cn } from "@/lib/utils"
import { Icons } from "@/components/icons"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Link from "next/link"
import { useToast } from "@/components/ui/use-toast"
import useGlobalStore from "@/store/useGlobalStore"
import { redirect, useRouter } from "next/navigation"
import { signIn } from "next-auth/react"
import { prisma } from "@/lib/db"
import { findUserByEmail } from "@/lib/actions/dbActions"

interface UserAuthFormProps extends React.HTMLAttributes<HTMLDivElement> {
    signup: boolean;
}

export function UserAuthForm({ className, signup, ...props }: UserAuthFormProps) {
    const [isLoading, setIsLoading] = React.useState<boolean>(false)
    const [email, setEmail] = React.useState<string>("")
    const [password, setPassword] = React.useState<string>("")
    const { toast } = useToast();
    const { setUser } = useGlobalStore();
    const router = useRouter();

    async function onSubmit(event: React.SyntheticEvent) {
        event.preventDefault()
        setIsLoading(true)

        if (!signup) {
            // fetch('/api/auth/login', {
            //     method: "POST",
            //     headers: {
            //         "Content-Type": "application/json",
            //     },
            //     body: JSON.stringify({ email, password }),
            // }).then(async oldRes => {
            //     const res = await oldRes.json();
            //     if (res.error) {
            //         setIsLoading(false);
            //         return toast({
            //             description: res.error.message
            //         })
            //     }
            //     else {
            //         setUser({
            //             email: res.user.email,
            //             id: res.user.id,
            //             name: res.user.name,
            //             phone_number: res.user.phone_number,
            //             email_subscribe: res.user.email_subscribe,
            //             inserted_at: res.user.inserted_at,
            //             updated_at: res.user.updated_at
            //         });
            //         toast({
            //             description: "Successfully logged in! 😁",
            //             color: "green"
            //         });
            //         return router.push("/");
            //     }
            // })
            signIn('credentials', {
                email,
                password,
                redirect: false
            }).then(async (callback) => {
                console.log(callback)
                if (callback?.error) {
                    return toast({
                        description: callback.error
                    })
                }
                if (callback?.ok && !callback?.error) {
                    const newData = await findUserByEmail({ email });
                    setUser({
                        email: newData?.email,
                        email_subscribed: newData?.email_subscribed,
                        id: newData?.id,
                        firstName: newData?.firstName,
                        lastName: newData?.lastName,
                        phone_number: newData?.phone_number,
                    });
                    toast({
                        description: "Successfully logged in! 😁"
                    });
                    toast({
                        description: `Welcome back ${newData?.firstName}!`
                    })
                    // setIsLoading(false)
                    router.push('/')
                }
            })
                .finally(() => setIsLoading(false));
        }

        // setTimeout(() => {
        //     setIsLoading(false)
        // }, 3000)
    }

    return (
        <div className={cn("grid gap-6", className)} {...props}>
            <form onSubmit={onSubmit}>
                <div className="grid gap-2">
                    <div className="grid gap-1">
                        <Label className="sr-only" htmlFor="email">
                            Email
                        </Label>
                        <Input
                            id="email"
                            placeholder="name@example.com"
                            type="email"
                            autoCapitalize="none"
                            autoComplete="email"
                            autoCorrect="off"
                            disabled={isLoading}
                            required
                            value={email}
                            onChange={(e: any) => setEmail(e.target.value)}
                        />
                    </div>
                    <div className="grid gap-1">
                        <Label className="sr-only" htmlFor="password">
                            Passowrd
                        </Label>
                        <Input
                            id="password"
                            placeholder="**********"
                            type="password"
                            autoCapitalize="none"
                            autoComplete="password"
                            autoCorrect="off"
                            required
                            disabled={isLoading}
                            value={password}
                            onChange={(e: any) => setPassword(e.target.value)}
                        />
                    </div>
                    <Button disabled={isLoading}>
                        {isLoading && (
                            <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
                        )}
                        {signup ? "Signup" : "Login"}
                    </Button>
                </div>
            </form>
            <div className="relative">
                <div className="flex items-center">
                    <span className="w-full h-0.5 bg-black rounded" />
                </div>
                {/* <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-background px-2 text-muted-foreground">
            Or continue with
          </span>
        </div> */}
            </div>
            <Button onClick={() => signIn("google")} variant="outline" type="button" disabled={isLoading}>
                {isLoading ? (
                    <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                    <Icons.google className="mr-2 h-4 w-4" />
                )}{" "}
                Google
            </Button>
            <p className="text-sm text-center">Don&apos;t have an account? Click <Link
                href="/signup"
                className="text-blue-400"
            >
                here
            </Link> to create one!</p>
        </div>
    )
}