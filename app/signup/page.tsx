import { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"

import { cn } from "@/lib/utils"
import { buttonVariants } from "@/components/ui/button"
import { UserAuthForm } from "./components/user-auth-form"
import { config } from "@/config"
import { isMobile } from "react-device-detect"
import * as rdd from 'react-device-detect';


// export const metadata: Metadata = {
//     title: "Authentication",
//     description: "Authentication forms built using the components.",
// }

export default function AuthenticationPage() {
  return (
    <>
      {!isMobile ? (
        <div className="md:hidden">
          <Image
            src="/examples/authentication-light.png"
            width={1280}
            height={843}
            alt="Authentication"
            className="block dark:hidden"
          />
        </div>
      ) : null}
      <div className="container relative hidden h-[92.3vh] flex-col items-center justify-center md:grid lg:max-w-none lg:grid-cols-2 lg:px-0">
        <div className="relative hidden h-full flex-col bg-muted p-10 text-white dark:border-r lg:flex">
          <div className="absolute inset-0 bg-zinc-900" />
          <div className="relative z-20 flex items-center text-lg font-medium">
            <Image
              src={'/favicon.png'}
              width={30}
              height={30}
              className="mr-2"
              alt="Site Logo"
            />
            {config.siteInfo.name}
          </div>
          <div className="relative z-20 mt-auto">
            <blockquote className="space-y-2">
              <p className="text-lg">
                &ldquo;The clothing brand that makes you look drippy.&rdquo;
              </p>
              <footer className="text-sm">Shayaan Godil</footer>
            </blockquote>
          </div>
        </div>
        <div className="lg:p-2">
          <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
            <div className="flex flex-col space-y-2 text-center">
              <h1 className="text-2xl font-semibold tracking-tight">
                Signup
              </h1>
              <span className="w-full h-0.5 bg-black rounded" />
              {/* <p className="text-sm text-muted-foreground">
                Enter your email below to create your account
              </p> */}
            </div>
            <UserAuthForm signup={true} />
            {/* <p className="px-8 text-center text-sm text-muted-foreground">
              By clicking continue, you agree to our{" "}
              <Link
                href="/terms"
                className="underline underline-offset-4 hover:text-primary"
              >
                Terms of Service
              </Link>{" "}
              and{" "}
              <Link
                href="/privacy"
                className="underline underline-offset-4 hover:text-primary"
              >
                Privacy Policy
              </Link>
              .
            </p> */}
          </div>
        </div>
      </div>

      {isMobile ? (
        <div className="px-2">
          <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
            <div className="flex flex-col space-y-2 text-center">
              <h1 className="text-2xl font-semibold tracking-tight">
                Signup
              </h1>
              <span className="w-full h-0.5 bg-black rounded" />
              {/* <p className="text-sm text-muted-foreground">
            Enter your email below to create your account
          </p> */}
            </div>
            <UserAuthForm signup={true} />
            {/* <p className="px-8 text-center text-sm text-muted-foreground">
          By clicking continue, you agree to our{" "}
          <Link
            href="/terms"
            className="underline underline-offset-4 hover:text-primary"
          >
            Terms of Service
          </Link>{" "}
          and{" "}
          <Link
            href="/privacy"
            className="underline underline-offset-4 hover:text-primary"
          >
            Privacy Policy
          </Link>
          .
        </p> */}
          </div>
        </div>
      ) : null}
    </>
  )
}