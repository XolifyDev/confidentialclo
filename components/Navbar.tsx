'use client';

import { supabase } from '@/lib/supabase';
import { Session } from '@supabase/supabase-js';
import Image from 'next/image';
import Link from 'next/link';
import React, { useState, useEffect, useMemo } from 'react'
import { Button } from './ui/button';
import { signOut, useSession } from 'next-auth/react';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { SiteSettings, User } from '@prisma/client';
import { findUserByEmail, getProductById, getSiteSettings } from '@/lib/actions/dbActions';
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuShortcut, DropdownMenuTrigger } from './ui/dropdown-menu';
import useGlobalStore, { CartItems } from '@/store/useGlobalStore';
import { Sheet, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle, SheetTrigger } from './ui/sheet';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import CardForm from './CardForm';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import { config } from '@/config';
import { isMobile } from "react-device-detect";
import * as rdd from 'react-device-detect';
import { useRouter } from 'next/navigation';

rdd.isMobile = true;

const stripePromise = loadStripe(config.stripe.publishableKey);


export default function Navbar() {
    const [clientWindowHeight, setClientWindowHeight] = useState<number | string>("");
    const session = useSession();
    const [userData, setUserData] = useState<User | null>(null);
    const [siteSettings, setSiteSettings] = useState<SiteSettings | null>(null);
    const [cart, setCart] = useState<CartItems[]>([]);
    const { cart: cartStore } = useGlobalStore();
    const [totalCost, setTotalCost] = useState<number>(0);
    const [showMobileMenu, setShowMobileMenu] = useState<boolean>(false);
    const router = useRouter();

    useEffect(() => {
        setCart(cartStore);

        const setStuff = async () => {
            let price = 0;
            for (let i = 0; i < cartStore.length; i++) {
                // setTimeout(async () => {
                const e = cartStore[i];
                const product = await getProductById(e.productId);
                const productPrice = Number(product?.price);
                price = price + productPrice;
                // }, 600)
            }
            console.log(price)
            setTotalCost(price)
        }
        setStuff()
    }, [cartStore])

    useEffect(() => {
        const getUserData = async () => {
            if (!session.data?.user) return;
            const user = await findUserByEmail({ email: session.data.user.email });
            // @ts-ignore
            setSiteSettings(await getSiteSettings());
            // console.log(`${!userData?.name ? `${userData?.firstName && userData?.firstName.charAt(0) || ""} ${userData?.lastName && userData?.lastName.charAt(0) || ""}` : `${userData?.name && userData?.name.split(" ")[0].charAt(0)} ${userData?.name && userData?.name.split(" ")[1].charAt(0)}`}`)
            setUserData(user);
        }
        getUserData();
    }, [session])

    // const [backgroundTransparacy, setBackgroundTransparacy] = useState<number>(100);
    const [showScrollClass, setShowScrollClass] = useState<boolean>(false);

    useEffect(() => {
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    });

    const handleScroll = () => {
        setClientWindowHeight(window.scrollY);
    };

    useEffect(() => {
        if ((clientWindowHeight as number) > 5) {
            setShowScrollClass(true)
        } else {
            setShowScrollClass(false)
        }
    }, [clientWindowHeight]);

    // console.log(showCheckoutForm)

    const hrefOnClick = (url: string) => {
        setShowMobileMenu(false);
        router.push(url);
    }


    return (
        <>
            <nav className={`scrollingNavbar ${showScrollClass && "scrolling"} flex-no-wrap z-10 sticky top-0 flex w-full items-center bg-transparent py-4 lg:flex-wrap lg:justify-start ${!isMobile ? "px-52" : "-top-2"} relative`} data-te-navbar-ref="">
                <div className="flex w-full flex-wrap items-center justify-between px-6 z-0">
                    <button onClick={() => setShowMobileMenu(true)} className="block border-0 bg-transparent px-2.5 py-2 text-neutral-500 hover:no-underline hover:shadow-none focus:no-underline focus:shadow-none focus:outline-none focus:ring-0 dark:text-neutral-200 lg:hidden" type="button">
                        <span className="[&amp;>svg]:w-7">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-7 w-7">
                                <path fillRule="evenodd" d="M3 6.75A.75.75 0 013.75 6h16.5a.75.75 0 010 1.5H3.75A.75.75 0 013 6.75zM3 12a.75.75 0 01.75-.75h16.5a.75.75 0 010 1.5H3.75A.75.75 0 013 12zm0 5.25a.75.75 0 01.75-.75h16.5a.75.75 0 010 1.5H3.75a.75.75 0 01-.75-.75z" clipRule="evenodd"></path>
                            </svg>
                        </span>
                    </button>
                    <div className="!visible hidden items-center lg:!flex lg:basis-auto" id="navbarSupportedContent1" data-te-collapse-item="">
                        <a className="mr-2 mt-2 flex items-center text-neutral-900 hover:text-neutral-900 focus:text-neutral-900 dark:text-neutral-200 dark:hover:text-neutral-400 dark:focus:text-neutral-400 lg:mt-0" href="/">
                            <Image src="/favicon.png" width={40} height={40} className='h-[40px]' alt="" loading="lazy" />
                        </a>
                    </div>

                    <div className="block border-0 bg-transparent hover:no-underline hover:shadow-none focus:no-underline focus:shadow-none focus:ring-0">
                        <a className="mr-2 mt-2 flex items-center text-neutral-900 hover:text-neutral-900 focus:text-neutral-900 dark:text-neutral-200 dark:hover:text-neutral-400 dark:focus:text-neutral-400 lg:mt-0" href="/">
                            <Image src="/favicon.png" width={40} height={40} className='h-[40px]' alt="" loading="lazy" />
                        </a>
                    </div>

                    {session.status !== "unauthenticated" ? (
                        <>
                            <div className={`relative flex items-center ${!isMobile && "hidden"}`}>
                                <a onClick={() => setShowMobileMenu(true)} suppressHydrationWarning={true} className="mr-6 transition delay-75 text-neutral-500 hover:text-neutral-700 focus:text-neutral-700 disabled:text-black/30 dark:text-neutral-200 dark:hover:text-neutral-300 dark:focus:text-neutral-300 [&amp;.active]:text-black/90 dark:[&amp;.active]:text-neutral-400">
                                    {!isMobile && cart.length > 0 ? (
                                        <span className="absolute -top-1 right-[60%] rounded-full bg-teal-500 py-1 px-2 text-[9px] transition delay-75 font-bold text-black hover:text-neutral-700 focus:text-neutral-700 disabled:text-black/30 dark:text-neutral-200 dark:hover:text-neutral-300">
                                            {cart.length}
                                        </span>
                                    ) : <></>}
                                    <span className="[&amp;>svg]:w-5">
                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
                                            <path d="M2.25 2.25a.75.75 0 000 1.5h1.386c.17 0 .318.114.362.278l2.558 9.592a3.752 3.752 0 00-2.806 3.63c0 .414.336.75.75.75h15.75a.75.75 0 000-1.5H5.378A2.25 2.25 0 017.5 15h11.218a.75.75 0 00.674-.421 60.358 60.358 0 002.96-7.228.75.75 0 00-.525-.965A60.864 60.864 0 005.68 4.509l-.232-.867A1.875 1.875 0 003.636 2.25H2.25zM3.75 20.25a1.5 1.5 0 113 0 1.5 1.5 0 01-3 0zM16.5 20.25a1.5 1.5 0 113 0 1.5 1.5 0 01-3 0z"></path>
                                        </svg>
                                    </span>
                                </a>
                            </div>
                            <div className={`relative flex items-center ${isMobile && "hidden"}`}>
                                <Sheet>
                                    <SheetTrigger asChild>
                                        <a suppressHydrationWarning={true} className="mr-6 transition delay-75 text-neutral-500 hover:text-neutral-700 focus:text-neutral-700 disabled:text-black/30 dark:text-neutral-200 dark:hover:text-neutral-300 dark:focus:text-neutral-300 [&amp;.active]:text-black/90 dark:[&amp;.active]:text-neutral-400">
                                            {!isMobile && cart.length > 0 ? (
                                                <span className="absolute -top-1 right-[60%] rounded-full bg-teal-500 py-1 px-2 text-[9px] transition delay-75 font-bold text-black hover:text-neutral-700 focus:text-neutral-700 disabled:text-black/30 dark:text-neutral-200 dark:hover:text-neutral-300">
                                                    {cart.length}
                                                </span>
                                            ) : <></>}
                                            <span className="[&amp;>svg]:w-5">
                                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
                                                    <path d="M2.25 2.25a.75.75 0 000 1.5h1.386c.17 0 .318.114.362.278l2.558 9.592a3.752 3.752 0 00-2.806 3.63c0 .414.336.75.75.75h15.75a.75.75 0 000-1.5H5.378A2.25 2.25 0 017.5 15h11.218a.75.75 0 00.674-.421 60.358 60.358 0 002.96-7.228.75.75 0 00-.525-.965A60.864 60.864 0 005.68 4.509l-.232-.867A1.875 1.875 0 003.636 2.25H2.25zM3.75 20.25a1.5 1.5 0 113 0 1.5 1.5 0 01-3 0zM16.5 20.25a1.5 1.5 0 113 0 1.5 1.5 0 01-3 0z"></path>
                                                </svg>
                                            </span>
                                        </a>
                                    </SheetTrigger>
                                    <SheetContent className={`${isMobile && "opacity-0"}`}>
                                        <SheetHeader>
                                            <SheetTitle>Cart</SheetTitle>
                                            <SheetDescription>
                                                View Your Cart
                                            </SheetDescription>
                                        </SheetHeader>
                                        <div className="mt-8 mb-70">
                                            <div className="flow-root">
                                                <ul role="list" className="-my-6 max-h-64 overflow-y-auto">
                                                    {cart.map(async (cartItem) => {
                                                        const product = await getProductById(cartItem.productId);

                                                        return (
                                                            <li className="flex py-6 px-2 border-b-2 border-black last:border-none" key={cartItem.id}>
                                                                <div
                                                                    className="h-24 w-24 flex-shrink-0 overflow-hidden rounded-md border border-gray-200">
                                                                    <Image src={product?.mainImage || "https://tailwindui.com/img/ecommerce-images/shopping-cart-page-04-product-01.jpg"}
                                                                        alt="Salmon orange fabric pouch with match zipper, gray zipper pull, and adjustable hip belt."
                                                                        className="h-full w-full object-cover object-center" height={100} width={100} />
                                                                </div>

                                                                <div className="ml-4 flex flex-1 flex-col">
                                                                    <div>
                                                                        <div
                                                                            className="flex justify-between text-base font-medium text-gray-900">
                                                                            <h3>
                                                                                <a href={`/store/${product?.url}`}>{product?.name}</a>
                                                                            </h3>
                                                                            <p className="ml-4">${product?.price}</p>
                                                                        </div>
                                                                        <p className="mt-1 text-sm text-gray-500">{product?.description}</p>
                                                                    </div>
                                                                    <div className="flex flex-1 items-end justify-between text-sm">
                                                                        <p className="text-gray-500">Size {cartItem.size}</p>

                                                                        <div className="flex">
                                                                            <button type="button"
                                                                                className="font-medium text-indigo-600 hover:text-indigo-500">Remove</button>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </li>
                                                        )
                                                    })}
                                                </ul>
                                            </div>
                                        </div>
                                        <div className="border-t-2 border-gray-200 px-4 py-6 mt-8 sm:px-6">
                                            <div className="flex justify-between text-base font-medium text-gray-900">
                                                <p>Subtotal</p>
                                                <p>${totalCost}</p>
                                            </div>
                                            {/* <p className="mt-0.5 text-sm text-gray-500">Shipping and taxes calculated at checkout.</p> */}
                                            <Elements stripe={stripePromise}>
                                                <CardForm user={userData!} />
                                            </Elements>
                                        </div>
                                        {/* <SheetFooter>
                                    <SheetClose asChild>
                                        <Button type="submit">Save changes</Button>
                                    </SheetClose>
                                </SheetFooter> */}
                                    </SheetContent>
                                </Sheet>
                                {!isMobile && (
                                    <div className="" data-te-dropdown-ref="">
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <div className="cursor-pointer hidden-arrow flex items-center whitespace-nowrap transition duration-150 ease-in-out motion-reduce:transition-none">
                                                    <Avatar>
                                                        <AvatarImage src={userData?.image!} alt={`${userData?.firstName || userData?.name}`} />
                                                        <AvatarFallback>{!userData?.name ? `${userData?.firstName && userData?.firstName.charAt(0) || ""} ${userData?.lastName && userData?.lastName.charAt(0) || ""}` : `${userData?.name && userData?.name.split(" ")[0].charAt(0)} ${userData?.name && userData?.name.split(" ")[1].charAt(0)}`}</AvatarFallback>
                                                    </Avatar>
                                                </div>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent className={`w-56 ${isMobile ? "-mr-20 z-[100]" : ""}`} align="end">
                                                <DropdownMenuLabel className="font-normal">
                                                    <div className="flex flex-col space-y-1">
                                                        <p className="text-sm font-medium leading-none">{userData?.firstName && userData?.firstName + ` ${userData?.lastName}`}</p>
                                                        <p className="text-xs leading-none text-muted-foreground">
                                                            {userData?.email}
                                                        </p>
                                                    </div>
                                                </DropdownMenuLabel>
                                                <DropdownMenuSeparator />
                                                <DropdownMenuGroup>
                                                    <a href="/profile">
                                                        <DropdownMenuItem className='cursor-pointer'>
                                                            Profile
                                                        </DropdownMenuItem>
                                                    </a>
                                                    <a href="/orders">
                                                        <DropdownMenuItem className='cursor-pointer'>
                                                            Orders
                                                        </DropdownMenuItem>
                                                    </a>
                                                    <a href="/settings">
                                                        <DropdownMenuItem className='cursor-pointer'>
                                                            Settings
                                                        </DropdownMenuItem>
                                                    </a>
                                                    {userData?.isAdmin && (
                                                        <a href="/admin">
                                                            <DropdownMenuItem className='cursor-pointer'>
                                                                Admin
                                                            </DropdownMenuItem>
                                                        </a>
                                                    )}
                                                </DropdownMenuGroup>
                                                <DropdownMenuSeparator />
                                                <DropdownMenuItem className='cursor-pointer' onClick={() => signOut()}>
                                                    Log out
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                        <ul className="absolute left-auto right-0 z-[1000] float-left m-0 mt-1 hidden min-w-max list-none overflow-hidden rounded-lg border-none bg-white bg-clip-padding text-left text-base shadow-lg dark:bg-neutral-700 [&amp;[data-te-dropdown-show]]:block" aria-labelledby="dropdownMenuButton2" data-te-dropdown-menu-ref="">
                                            <li>
                                                <a className="block w-full whitespace-nowrap bg-transparent px-4 py-2 text-sm font-normal text-neutral-700 hover:bg-neutral-100 active:text-neutral-800 active:no-underline disabled:pointer-events-none disabled:bg-transparent disabled:text-neutral-400 dark:text-neutral-200 dark:hover:bg-white/30" href="#" data-te-dropdown-item-ref="">Action</a>
                                            </li>
                                            <li>
                                                <a className="block w-full whitespace-nowrap bg-transparent px-4 py-2 text-sm font-normal text-neutral-700 hover:bg-neutral-100 active:text-neutral-800 active:no-underline disabled:pointer-events-none disabled:bg-transparent disabled:text-neutral-400 dark:text-neutral-200 dark:hover:bg-white/30" href="#" data-te-dropdown-item-ref="">Another action</a>
                                            </li>
                                            <li>
                                                <a className="block w-full whitespace-nowrap bg-transparent px-4 py-2 text-sm font-normal text-neutral-700 hover:bg-neutral-100 active:text-neutral-800 active:no-underline disabled:pointer-events-none disabled:bg-transparent disabled:text-neutral-400 dark:text-neutral-200 dark:hover:bg-white/30" href="#" data-te-dropdown-item-ref="">Something else here</a>
                                            </li>
                                        </ul>
                                    </div>
                                )}
                            </div>
                        </>
                    ) : (
                        <div>
                            <Link href={'/login'}
                            // className={`py-1 px-4  ${showScrollClass ? "bg-slate-700 text-white" : "bg-white text-black"} transition-colors rounded`}
                            >
                                <Button>
                                    Login
                                </Button>
                            </Link>
                        </div>
                    )}
                </div>
                {showMobileMenu && (
                    <div className="custom_fadeIn fixed w-full h-[100vh] bottom-0 right-0 bg-[#eee8e8] z-[9999] top-0 flex flex-col py-1 px-2">
                        <div className="flex flex-row w-[23rem] justify-between -mt-2 items-center">
                            <Image
                                src={`/logo.png`}
                                alt='logo'
                                height={100}
                                width={100}
                                className='h-[120px] w-[120px]'
                                onClick={() => hrefOnClick("/")}
                            // loading="lazy"
                            />
                            {session.status !== "unauthenticated" ? (
                                <div>
                                    <div className="cursor-pointer hidden-arrow flex items-center whitespace-nowrap transition duration-150 ease-in-out motion-reduce:transition-none">
                                        <Avatar>
                                            <AvatarImage src={userData?.image!} alt={userData?.firstName!} />
                                            <AvatarFallback>{!userData?.name ? `${userData?.firstName && userData?.firstName.charAt(0) || ""} ${userData?.lastName && userData?.lastName.charAt(0) || ""}` : `${userData?.name && userData?.name.split(" ")[0].charAt(0)} ${userData?.name && userData?.name.split(" ")[1].charAt(0)}`}</AvatarFallback>
                                        </Avatar>
                                    </div>

                                </div>
                            ) : (
                                <div>
                                    <Button onClick={() => hrefOnClick("/login")}>
                                        Login
                                    </Button>
                                </div>
                            )}
                        </div>
                        <div className="flex flex-col gap-2 px-4">
                            {session.status !== "unauthenticated" && (
                                <>
                                    <div className="border-b-2 border-black h-2 w-[90%] ml-[3%] mb-2" />
                                    <div className="flex flex-col gap-2">
                                        <h1 className='font-bold'>
                                            Account
                                        </h1>
                                        <div className="pl-3 flex flex-col gap-2">
                                            <p onClick={() => hrefOnClick("/profile")} className='underline'>
                                                -  Profile
                                            </p>
                                            <p onClick={() => hrefOnClick("/orders")} className='underline'>
                                                -  Orders
                                            </p>
                                            <p onClick={() => hrefOnClick("/settings")} className='underline'>
                                                -  Settings
                                            </p>
                                            {userData && userData?.isAdmin && (
                                                <p onClick={() => hrefOnClick("/admin")} className='underline'>
                                                    -  Admin
                                                </p>
                                            )}
                                            <Button onClick={() => signOut()} className='w-32'>
                                                Logout
                                            </Button>
                                        </div>
                                    </div>
                                </>
                            )}
                        </div>
                        <div className="border-b-2 border-black h-2 w-[90%] ml-[3%] mb-2" />
                        <p className='ml-4 underline font-bold' onClick={() => hrefOnClick("/profile")}>
                            Store
                        </p>
                        <Button className='absolute bottom-7 right-3' onClick={() => setShowMobileMenu(false)}>
                            Close
                        </Button>
                    </div>
                )}
            </nav >
        </>
    )
}
