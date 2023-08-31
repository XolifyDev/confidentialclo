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
import { useRouter } from "next/navigation"
import { signIn } from "next-auth/react"

interface UserAuthFormProps extends React.HTMLAttributes<HTMLDivElement> {
    signup: boolean;
}

export function UserAuthForm({ className, signup, ...props }: UserAuthFormProps) {
    const [isLoading, setIsLoading] = React.useState<boolean>(false)
    const [email, setEmail] = React.useState<string>("")
    const [password, setPassword] = React.useState<string>("")
    const [username, setUsername] = React.useState<string>("");
    const [firstName, setFirstName] = React.useState<string>("");
    const [lastName, setLastName] = React.useState<string>("");
    const { toast } = useToast();
    const { setUser } = useGlobalStore();
    const router = useRouter();

    async function onSubmit(event: React.SyntheticEvent) {
        event.preventDefault()
        setIsLoading(true)
        fetch('/api/auth/signup', {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ email, password, firstName, lastName }),
        }).then(async oldRes => {
            const res = await oldRes.json();
            console.log(res);
            if (res.error) {
                setIsLoading(false);
                return toast({
                    description: res.error.message,
                    variant: "destructive"
                })
            } else {
                // setIsLoading(false);
                setUser({
                    email: res.user.email,
                    id: res.user.id,
                    firstName: res.user.firstName,
                    lastName: res.user.lastName,
                    phone_number: res.user.phone_number,
                    email_subscribed: res.user.email_subscribed,
                });
                toast({
                    description: "Successfully signed up! 😁",
                    color: "green"
                });
                setIsLoading(false)
                return router.push("/");
            }
        })
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
                        <Label className="sr-only" htmlFor="firstName">
                            First Name
                        </Label>
                        <Input
                            id="firstName"
                            placeholder="John"
                            type="text"
                            autoCapitalize="yes"
                            autoComplete="firstName"
                            autoCorrect="off"
                            disabled={isLoading}
                            required
                            value={firstName}
                            onChange={(e: any) => setFirstName(e.target.value)}
                        />
                    </div>
                    <div className="grid gap-1">
                        <Label className="sr-only" htmlFor="lastName">
                            Last Name
                        </Label>
                        <Input
                            id="lastName"
                            placeholder="Doe"
                            type="text"
                            autoCapitalize="yes"
                            autoComplete="firstName"
                            autoCorrect="off"
                            disabled={isLoading}
                            required
                            value={lastName}
                            onChange={(e: any) => setLastName(e.target.value)}
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
            <Button onClick={() => signIn("google", {
                callbackUrl: "/",
                redirect: true
            })} variant="outline" type="button" disabled={isLoading}>
                {isLoading ? (
                    <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                    <Icons.google className="mr-2 h-4 w-4" />
                )}{" "}
                Google
            </Button>
            <p className="text-sm text-center">Already have an account? Click <Link
                href="/login"
                className="text-blue-400"
            >
                here
            </Link> to login!</p>
        </div>
    )
}