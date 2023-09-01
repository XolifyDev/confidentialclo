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
import { isMobile, isMobileSafari } from "react-device-detect";
import * as rdd from 'react-device-detect';
import { useRouter } from 'next/navigation';
import CartItem from './CartItem';



const stripePromise = loadStripe(config.stripe.publishableKey);


export default function Navbar() {
    const [clientWindowHeight, setClientWindowHeight] = useState<number | string>("");
    const session = useSession();
    const [userData, setUserData] = useState<User | null>(null);
    const [siteSettings, setSiteSettings] = useState<SiteSettings | null>(null);
    const [cart, setCart] = useState<CartItems[]>([]);
    const { cart: cartStore, removeItemFromCart } = useGlobalStore();
    const [totalCost, setTotalCost] = useState<number>(0);
    const [showMobileMenu, setShowMobileMenu] = useState<boolean>(false);
    const router = useRouter();
    const [domLoaded, setDomLoaded] = useState(false);

    useEffect(() => {
        setDomLoaded(true);
    }, []);

    useEffect(() => {
        setCart(cartStore);

        const setStuff = async () => {
            let price = 0;
            for (let i = 0; i < cartStore.length; i++) {
                // setTimeout(async () => {
                const e = cartStore[i];
                const product = await fetch('/api/products/id', {
                    method: "GET",
                    headers: {
                        "id": e.productId
                    },
                    cache: "no-cache",
                }).then(res => res.json());
                const productPrice = Number(product?.price);
                price = price + productPrice;
                // }, 600)
            }
            // console.log(price)
            setTotalCost(price)
        }
        setStuff()
    }, [cartStore])

    useEffect(() => {
        const getUserData = async () => {
            if (!session.data?.user) return;
            const user = await findUserByEmail({ email: session.data.user.email });
            // @ts-ignore
            setSiteSettings(await fetch('/api/sitesettings', {
                method: "GET",
                cache: "no-cache",
            }).then(res => res.json()));
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
    }, []);

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
            {domLoaded && (
                <nav suppressHydrationWarning={true} className={`scrollingNavbar ${showScrollClass ? "scrolling" : null} flex-no-wrap z-10 sticky top-0 flex w-full items-center bg-transparent py-4 lg:flex-wrap lg:justify-start ${!isMobile ? "px-52" : "-top-2"} relative`} data-te-navbar-ref="">
                    <div suppressHydrationWarning={true} className="flex w-full flex-wrap items-center justify-between px-6 z-0">
                        <button suppressHydrationWarning={true} onClick={() => setShowMobileMenu(true)} className="block border-0 bg-transparent px-2.5 py-2 text-neutral-500 hover:no-underline hover:shadow-none focus:no-underline focus:shadow-none focus:outline-none focus:ring-0 dark:text-neutral-200 lg:hidden" type="button">
                            <span suppressHydrationWarning={true} className="[&amp;>svg]:w-7">
                                <svg suppressHydrationWarning={true} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-7 w-7">
                                    <path suppressHydrationWarning={true} fillRule="evenodd" d="M3 6.75A.75.75 0 013.75 6h16.5a.75.75 0 010 1.5H3.75A.75.75 0 013 6.75zM3 12a.75.75 0 01.75-.75h16.5a.75.75 0 010 1.5H3.75A.75.75 0 013 12zm0 5.25a.75.75 0 01.75-.75h16.5a.75.75 0 010 1.5H3.75a.75.75 0 01-.75-.75z" clipRule="evenodd"></path>
                                </svg>
                            </span>
                        </button>
                        <div suppressHydrationWarning={true} className="!visible hidden items-center lg:!flex lg:basis-auto" id="navbarSupportedContent1" data-te-collapse-item="">
                            <a suppressHydrationWarning={true} className="mr-2 mt-2 flex items-center text-neutral-900 hover:text-neutral-900 focus:text-neutral-900 dark:text-neutral-200 dark:hover:text-neutral-400 dark:focus:text-neutral-400 lg:mt-0" href="/">
                                <Image suppressHydrationWarning={true} src="/logo.png" width={100} height={100} className='h-[40px] w-[60px] object-cover rounded' alt="" loading="lazy" />
                            </a>
                        </div>

                        <div suppressHydrationWarning={true} className="block border-0 bg-transparent hover:no-underline hover:shadow-none focus:no-underline focus:shadow-none focus:ring-0">
                            <a suppressHydrationWarning={true} className="mr-2 mt-2 flex items-center text-neutral-900 hover:text-neutral-900 focus:text-neutral-900 dark:text-neutral-200 dark:hover:text-neutral-400 dark:focus:text-neutral-400 lg:mt-0" href="/">
                                <Image suppressHydrationWarning={true} src={siteSettings ? siteSettings?.middleImage : '/favicon.png'} width={100} height={100} className='h-[40px] object-cover w-[150px]' alt="" loading="lazy" />
                            </a>
                        </div>

                        {session.status !== "unauthenticated" ? (
                            <>
                                <div suppressHydrationWarning={true} className={`relative flex items-center ${!isMobile ? "hidden" : null}`}>
                                    <a suppressHydrationWarning={true} onClick={() => setShowMobileMenu(true)} className="mr-6 transition delay-75 text-neutral-500 hover:text-neutral-700 focus:text-neutral-700 disabled:text-black/30 dark:text-neutral-200 dark:hover:text-neutral-300 dark:focus:text-neutral-300 [&amp;.active]:text-black/90 dark:[&amp;.active]:text-neutral-400">
                                        {!isMobile ? cart.length > 0 ? (
                                            <span suppressHydrationWarning={true} className="absolute -top-1 right-[60%] rounded-full bg-teal-500 py-1 px-2 text-[9px] transition delay-75 font-bold text-black hover:text-neutral-700 focus:text-neutral-700 disabled:text-black/30 dark:text-neutral-200 dark:hover:text-neutral-300">
                                                {cart.length}
                                            </span>
                                        ) : null : null}
                                        <span suppressHydrationWarning={true} className="[&amp;>svg]:w-5">
                                            <svg suppressHydrationWarning={true} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
                                                <path suppressHydrationWarning={true} d="M2.25 2.25a.75.75 0 000 1.5h1.386c.17 0 .318.114.362.278l2.558 9.592a3.752 3.752 0 00-2.806 3.63c0 .414.336.75.75.75h15.75a.75.75 0 000-1.5H5.378A2.25 2.25 0 017.5 15h11.218a.75.75 0 00.674-.421 60.358 60.358 0 002.96-7.228.75.75 0 00-.525-.965A60.864 60.864 0 005.68 4.509l-.232-.867A1.875 1.875 0 003.636 2.25H2.25zM3.75 20.25a1.5 1.5 0 113 0 1.5 1.5 0 01-3 0zM16.5 20.25a1.5 1.5 0 113 0 1.5 1.5 0 01-3 0z"></path>
                                            </svg>
                                        </span>
                                    </a>
                                </div>
                                <div suppressHydrationWarning={true} className={`relative flex items-center ${isMobile ? "hidden" : null}`}>
                                    <Sheet>
                                        <SheetTrigger suppressHydrationWarning={true} asChild>
                                            <a suppressHydrationWarning={true} className="mr-6 transition delay-75 text-neutral-500 hover:text-neutral-700 focus:text-neutral-700 disabled:text-black/30 dark:text-neutral-200 dark:hover:text-neutral-300 dark:focus:text-neutral-300 [&amp;.active]:text-black/90 dark:[&amp;.active]:text-neutral-400">
                                                {!isMobile ? cart.length > 0 ? (
                                                    <span suppressHydrationWarning={true} className="absolute -top-1 right-[60%] rounded-full bg-teal-500 py-1 px-2 text-[9px] transition delay-75 font-bold text-black hover:text-neutral-700 focus:text-neutral-700 disabled:text-black/30 dark:text-neutral-200 dark:hover:text-neutral-300">
                                                        {cart.length}
                                                    </span>
                                                ) : null : null}
                                                <span suppressHydrationWarning={true} className="[&amp;>svg]:w-5">
                                                    <svg suppressHydrationWarning={true} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
                                                        <path suppressHydrationWarning={true} d="M2.25 2.25a.75.75 0 000 1.5h1.386c.17 0 .318.114.362.278l2.558 9.592a3.752 3.752 0 00-2.806 3.63c0 .414.336.75.75.75h15.75a.75.75 0 000-1.5H5.378A2.25 2.25 0 017.5 15h11.218a.75.75 0 00.674-.421 60.358 60.358 0 002.96-7.228.75.75 0 00-.525-.965A60.864 60.864 0 005.68 4.509l-.232-.867A1.875 1.875 0 003.636 2.25H2.25zM3.75 20.25a1.5 1.5 0 113 0 1.5 1.5 0 01-3 0zM16.5 20.25a1.5 1.5 0 113 0 1.5 1.5 0 01-3 0z"></path>
                                                    </svg>
                                                </span>
                                            </a>
                                        </SheetTrigger>
                                        <SheetContent suppressHydrationWarning={true} className={`${isMobile ? "opacity-0" : null}`}>
                                            <SheetHeader suppressHydrationWarning={true}>
                                                <SheetTitle suppressHydrationWarning={true}>Cart</SheetTitle>
                                                <SheetDescription suppressHydrationWarning={true}>
                                                    View Your Cart
                                                </SheetDescription>
                                            </SheetHeader>
                                            <div suppressHydrationWarning={true} className="mt-8 mb-70">
                                                <div suppressHydrationWarning={true} className="flow-root">
                                                    <ul suppressHydrationWarning={true} role="list" className="-my-6 max-h-64 overflow-y-auto">
                                                        {cart.map(async (cartItem) => {
                                                            const product = await getProductById(cartItem.productId);

                                                            return (
                                                                <li suppressHydrationWarning={true} className="flex py-6 px-2 border-b-2 border-black last:border-none" key={cartItem.id}>
                                                                    <div suppressHydrationWarning={true}
                                                                        className="h-24 w-24 flex-shrink-0 overflow-hidden rounded-md border border-gray-200">
                                                                        <Image src={product?.mainImage || "https://tailwindui.com/img/ecommerce-images/shopping-cart-page-04-product-01.jpg"}
                                                                            alt="Salmon orange fabric pouch with match zipper, gray zipper pull, and adjustable hip belt."
                                                                            className="h-full w-full object-cover object-center" height={100} width={100} />
                                                                    </div>

                                                                    <div suppressHydrationWarning={true} className="ml-4 flex flex-1 flex-col">
                                                                        <div suppressHydrationWarning={true}>
                                                                            <div suppressHydrationWarning={true}
                                                                                className="flex justify-between text-base font-medium text-gray-900">
                                                                                <h3 suppressHydrationWarning={true}>
                                                                                    <a suppressHydrationWarning={true} href={`/store/${product?.url}`}>{product?.name}</a>
                                                                                </h3>
                                                                                <p suppressHydrationWarning={true} className="ml-4">${product?.price}</p>
                                                                            </div>
                                                                            <p suppressHydrationWarning={true} className="mt-1 text-sm text-gray-500">{product?.description}</p>
                                                                        </div>
                                                                        <div suppressHydrationWarning={true} className="flex flex-1 items-end justify-between text-sm">
                                                                            <p suppressHydrationWarning={true} className="text-gray-500">Size {cartItem.size}</p>

                                                                            <div suppressHydrationWarning={true} className="flex">
                                                                                <button onClick={() => removeItemFromCart(cartItem.id)} suppressHydrationWarning={true} type="button"
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
                                            <div suppressHydrationWarning={true} className="border-t-2 border-gray-200 px-4 py-6 mt-8 sm:px-6">
                                                <div suppressHydrationWarning={true} className="flex justify-between text-base font-medium text-gray-900">
                                                    <p suppressHydrationWarning={true}>Subtotal</p>
                                                    <p suppressHydrationWarning={true}>${totalCost}</p>
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
                                    {!isMobile ? (
                                        <div suppressHydrationWarning={true} className="" data-te-dropdown-ref="">
                                            <DropdownMenu>
                                                <DropdownMenuTrigger suppressHydrationWarning={true} asChild>
                                                    <div suppressHydrationWarning={true} className="cursor-pointer hidden-arrow flex items-center whitespace-nowrap transition duration-150 ease-in-out motion-reduce:transition-none">
                                                        <Avatar suppressHydrationWarning={true}>
                                                            <AvatarImage suppressHydrationWarning={true} src={userData?.image!} alt={`${userData?.firstName || userData?.name}`} />
                                                            <AvatarFallback suppressHydrationWarning={true}>{!userData?.name ? `${userData?.firstName ? userData?.firstName.charAt(0) || "" : null} ${userData?.lastName ? userData?.lastName.charAt(0) || "" : null}` : `${userData?.name ? userData?.name.split(" ")[0].charAt(0) : null} ${userData?.name ? userData?.name.split(" ")[1].charAt(0) : null}`}</AvatarFallback>
                                                        </Avatar>
                                                    </div>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent suppressHydrationWarning={true} className={`w-56 ${isMobile ? "-mr-20 z-[100]" : ""}`} align="end">
                                                    <DropdownMenuLabel suppressHydrationWarning={true} className="font-normal">
                                                        <div suppressHydrationWarning={true} className="flex flex-col space-y-1">
                                                            <p suppressHydrationWarning={true} className="text-sm font-medium leading-none">{userData?.firstName && userData?.firstName + ` ${userData?.lastName}`}</p>
                                                            <p suppressHydrationWarning={true} className="text-xs leading-none text-muted-foreground">
                                                                {userData?.email}
                                                            </p>
                                                        </div>
                                                    </DropdownMenuLabel>
                                                    <DropdownMenuSeparator suppressHydrationWarning={true} />
                                                    <DropdownMenuGroup suppressHydrationWarning={true}>
                                                        <a href="/account" suppressHydrationWarning={true}>
                                                            <DropdownMenuItem suppressHydrationWarning={true} className='cursor-pointer'>
                                                                Account
                                                            </DropdownMenuItem>
                                                        </a>
                                                        <a suppressHydrationWarning={true} href="/account/settings">
                                                            <DropdownMenuItem suppressHydrationWarning={true} className='cursor-pointer'>
                                                                Settings
                                                            </DropdownMenuItem>
                                                        </a>
                                                        {userData?.isAdmin ? (
                                                            <a suppressHydrationWarning={true} href="/admin">
                                                                <DropdownMenuItem suppressHydrationWarning={true} className='cursor-pointer'>
                                                                    Admin
                                                                </DropdownMenuItem>
                                                            </a>
                                                        ) : null}
                                                    </DropdownMenuGroup>
                                                    <DropdownMenuSeparator suppressHydrationWarning={true} />
                                                    <DropdownMenuItem suppressHydrationWarning={true} className='cursor-pointer' onClick={() => signOut()}>
                                                        Log out
                                                    </DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                            <ul suppressHydrationWarning={true} className="absolute left-auto right-0 z-[1000] float-left m-0 mt-1 hidden min-w-max list-none overflow-hidden rounded-lg border-none bg-white bg-clip-padding text-left text-base shadow-lg dark:bg-neutral-700 [&amp;[data-te-dropdown-show]]:block" aria-labelledby="dropdownMenuButton2" data-te-dropdown-menu-ref="">
                                                <li suppressHydrationWarning={true}>
                                                    <a suppressHydrationWarning={true} className="block w-full whitespace-nowrap bg-transparent px-4 py-2 text-sm font-normal text-neutral-700 hover:bg-neutral-100 active:text-neutral-800 active:no-underline disabled:pointer-events-none disabled:bg-transparent disabled:text-neutral-400 dark:text-neutral-200 dark:hover:bg-white/30" href="#" data-te-dropdown-item-ref="">Action</a>
                                                </li>
                                                <li suppressHydrationWarning={true}>
                                                    <a suppressHydrationWarning={true} className="block w-full whitespace-nowrap bg-transparent px-4 py-2 text-sm font-normal text-neutral-700 hover:bg-neutral-100 active:text-neutral-800 active:no-underline disabled:pointer-events-none disabled:bg-transparent disabled:text-neutral-400 dark:text-neutral-200 dark:hover:bg-white/30" href="#" data-te-dropdown-item-ref="">Another action</a>
                                                </li>
                                                <li suppressHydrationWarning={true}>
                                                    <a suppressHydrationWarning={true} className="block w-full whitespace-nowrap bg-transparent px-4 py-2 text-sm font-normal text-neutral-700 hover:bg-neutral-100 active:text-neutral-800 active:no-underline disabled:pointer-events-none disabled:bg-transparent disabled:text-neutral-400 dark:text-neutral-200 dark:hover:bg-white/30" href="#" data-te-dropdown-item-ref="">Something else here</a>
                                                </li>
                                            </ul>
                                        </div>
                                    ) : null}
                                </div>
                            </>
                        ) : (
                            <div suppressHydrationWarning={true}>
                                <Link suppressHydrationWarning={true} href={'/login'}
                                // className={`py-1 px-4  ${showScrollClass ? "bg-slate-700 text-white" : "bg-white text-black"} transition-colors rounded`}
                                >
                                    <Button suppressHydrationWarning={true}>
                                        Login
                                    </Button>
                                </Link>
                            </div>
                        )}
                    </div>
                    {showMobileMenu && (
                        <div suppressHydrationWarning={true} className={`custom_fadeIn fixed w-full h-[110vh] bottom-0 right-0 bg-[#eee8e8] z-[9999] top-0 ${isMobileSafari ? "-mt-4" : null} flex flex-col py-1 px-2`}>
                            <div suppressHydrationWarning={true} className="flex flex-row w-[23rem] justify-between items-center">
                                <Image
                                    suppressHydrationWarning={true}
                                    src={`/favicon.png`}
                                    alt='logo'
                                    height={100}
                                    width={100}
                                    className='h-[120px] w-[150px] object-cover rounded'
                                    onClick={() => hrefOnClick("/")}
                                // loading="lazy"
                                />
                                {session.status !== "unauthenticated" ? (
                                    <div suppressHydrationWarning={true}>
                                        <div suppressHydrationWarning={true} className="cursor-pointer hidden-arrow flex items-center whitespace-nowrap transition duration-150 ease-in-out motion-reduce:transition-none">
                                            <Avatar suppressHydrationWarning={true}>
                                                <AvatarImage suppressHydrationWarning={true} src={userData?.image!} alt={userData?.firstName!} />
                                                <AvatarFallback suppressHydrationWarning={true}>{!userData?.name ? `${userData?.firstName && userData?.firstName.charAt(0) || ""} ${userData?.lastName && userData?.lastName.charAt(0) || ""}` : `${userData?.name && userData?.name.split(" ")[0].charAt(0)} ${userData?.name && userData?.name.split(" ")[1].charAt(0)}`}</AvatarFallback>
                                            </Avatar>
                                        </div>

                                    </div>
                                ) : (
                                    <div suppressHydrationWarning={true}>
                                        <Button suppressHydrationWarning={true} onClick={() => hrefOnClick("/login")}>
                                            Login
                                        </Button>
                                    </div>
                                )}
                            </div>
                            <div suppressHydrationWarning={true} className="flex flex-col gap-2 px-4">
                                {session.status !== "unauthenticated" ? (
                                    <>
                                        <div suppressHydrationWarning={true} className="border-b-2 border-black h-2 w-[95%]  mb-2" />
                                        <div suppressHydrationWarning={true} className="flex flex-col gap-2">
                                            <h1 suppressHydrationWarning={true} className='font-bold'>
                                                Account
                                            </h1>
                                            <div suppressHydrationWarning={true} className="pl-3 flex flex-col gap-2">
                                                <p onClick={() => hrefOnClick("/account")} className='underline'>
                                                    -  Profile
                                                </p>
                                                <p suppressHydrationWarning={true} onClick={() => hrefOnClick("/account/settings")} className='underline'>
                                                    -  Settings
                                                </p>
                                                {userData ? userData?.isAdmin ? (
                                                    <p suppressHydrationWarning={true} onClick={() => hrefOnClick("/admin")} className='underline'>
                                                        -  Admin
                                                    </p>
                                                ) : null : null}
                                                <Button suppressHydrationWarning={true} onClick={() => signOut()} className='w-32'>
                                                    Logout
                                                </Button>
                                            </div>
                                        </div>
                                    </>
                                ) : null}
                            </div>
                            <div suppressHydrationWarning={true} className="border-b-2 border-black h-2 w-[90%] ml-[3%] mb-2" />
                            <p suppressHydrationWarning={true} className='ml-4 underline font-bold' onClick={() => hrefOnClick("/profile")}>
                                Store
                            </p>
                            <div suppressHydrationWarning={true} className="border-b-2 border-black h-2 w-[90%] ml-[3%] mb-2" />
                            <div className="px-4 pt-3 w-[92%] max-h-[40%] rounded bg-neutral-50 mt-10 ml-2">
                                <h1 suppressHydrationWarning={true} className='font-bold'>
                                    Cart
                                </h1>
                                {/* <div className="border-b border-black h-1 w-[95%]" /> */}
                                <div className={`flex flex-row w-full py-2 ${isMobileSafari ? "max-h-24" : "max-h-36"} overflow-y-auto`}>
                                    {cart.map((cartItem) => (
                                        <CartItem key={cartItem.id} cartItem={cartItem} />
                                    ))}
                                </div>
                                <div suppressHydrationWarning={true} className="border-t-2 border-gray-200 px-4 py-6 mt-8 sm:px-6">
                                    <div suppressHydrationWarning={true} className="flex justify-between text-base font-medium text-gray-900">
                                        <p suppressHydrationWarning={true}>Subtotal</p>
                                        <p suppressHydrationWarning={true}>${totalCost}</p>
                                    </div>
                                    {/* <p className="mt-0.5 text-sm text-gray-500">Shipping and taxes calculated at checkout.</p> */}
                                    <Elements stripe={stripePromise}>
                                        <CardForm user={userData!} />
                                    </Elements>
                                </div>
                            </div>
                            <Button className='absolute bottom-7 right-3' onClick={() => setShowMobileMenu(false)}>
                                Close
                            </Button>
                        </div>
                    )}
                </nav >
            )}
        </>
    )
}
