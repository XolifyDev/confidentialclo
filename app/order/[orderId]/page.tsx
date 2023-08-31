"use client";
import { Icons } from '@/components/icons'
import { Combobox } from '@/components/ui/Combobox'
import { Button } from '@/components/ui/button'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { config } from '@/config';
import { findUserByEmail, getOrderById, getOrderProductsByOrderId, updateStatus } from '@/lib/actions/dbActions'
// import getCurrentUser from '@/lib/actions/getCurrentUser';
import { getCheckoutSession } from '@/lib/checkout'
import { cn } from '@/lib/utils';
import { OrderProducts, Orders, Products, User } from '@prisma/client'
import { ArrowDown, Check } from 'lucide-react'
import { useSession } from 'next-auth/react';
import Image from 'next/image'
import React, { useEffect, useRef, useState } from 'react'
import { isMobile } from 'react-device-detect';
import Stripe from 'stripe';

type props = {
    params: {
        orderId: string
    }
}

interface OrderProductsExtended extends OrderProducts {
    product: Products
}

const stripe = new Stripe(config.stripe.clientSecret, {
    apiVersion: "2022-11-15",
});

const Page = ({ params }: props) => {
    // const router = useSearchParams();
    const [user, setUser] = useState<User | null>(null);
    const sessionId = params.orderId as string;
    const [session, setSession] = useState<any>(null);
    const [value, setValue] = useState<any>("not_shipped");
    const [order, setOrder] = useState<Orders | null>(null);
    const [orderProducts, setOrderProducts] = useState<OrderProductsExtended[]>([]);
    const bottomRef = useRef<HTMLDivElement | null>(null);
    const userSession = useSession();
    const [siteSettings, setSiteSettings] = useState<any>({})

    useEffect(() => {
        fetch('/api/sitesettings', {
            method: "GET"
        }).then(res => res.json()).then((e) => {
            // console.log(e)
            setSiteSettings(e);
            // setCategories(e.categories);
        })
    }, [])
    useEffect(() => {
        const getSession = async () => {
            // console.log(s)
            let o = await fetch('/api/orders/id', {
                method: "GET",
                headers: {
                    "id": sessionId
                }
            }).then(res => res.json());
            let s = await stripe.checkout.sessions.retrieve(o?.sessionId);
            setTimeout(async () => {
                // console.log(o)
                let op = await fetch('/api/orders/orderproducts', {
                    method: "GET",
                    headers: {
                        "id": o?.id!
                    }
                }).then(res => res.json());
                console.log(op)
                setSession(s);
                setOrder(o);
                setValue(o?.status || "not_shipped");
                setOrderProducts(op);
                if (bottomRef) {
                    bottomRef.current?.scrollIntoView({
                        behavior: "smooth",
                        block: "center",
                        inline: "start"
                    })
                    console.log('bottom ref', bottomRef)
                }
            }, 500)
        }
        getSession();
    }, [sessionId, bottomRef])

    useEffect(() => {
        const getUserData = async () => {
            if (!userSession.data?.user) return;
            const user = await findUserByEmail({ email: userSession.data.user.email });

            setUser(user);
        }
        getUserData();
    }, [userSession])
    return (
        <>
            <div style={{
                backgroundRepeat: "no-repeat", backgroundSize: "cover", contain: "size", backgroundPosition: "center", backgroundImage: `url(${siteSettings.mainHomeImage})`, backgroundBlendMode: "darken", backgroundColor: "rgba(0, 0, 0, .65)"
            }} className={`relative flex min-h-screen h-screen flex-col items-center justify-between ${!isMobile ? "-mt-[7.695vh]" : "-mt-[8.9vh]"} mb-[5%] pt-16`}>

                <div className={`arrowDown absolute bottom-5 animate-bounce mb-2 ${isMobile ? "" : "mr-11"}`}>
                    <ArrowDown color='white' className='w-10 h-12' />
                </div>
            </div>
            <main className={`${isMobile ? "px-4" : "px-60"} w-full mb-[10%]`}>
                {
                    session && order && userSession.status !== "loading" ? (
                        <div className='flex flex-col w-full'>
                            {session.payment_status === "paid" ? (
                                <>
                                    <div className="top flex flex-col gap-3">
                                        <div className="w-full flex flex-row justify-between items-center">
                                            <span className="text-blue-500">
                                                Thank you for your purchase!
                                            </span>
                                            {user && user?.isAdmin ? (
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger>
                                                        <Button>
                                                            Set Order Status
                                                        </Button>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent>
                                                        <DropdownMenuItem onClick={() => { setValue("shipped"); updateStatus("shipped", order.id) }}>
                                                            <Check
                                                                className={cn(
                                                                    "mr-2 h-4 w-4",
                                                                    value === "shipped" ? "opacity-100" : "opacity-0"
                                                                )}
                                                            />
                                                            Shipped
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem onClick={() => { setValue("being_shipped"); updateStatus("being_shipped", order.id) }}>
                                                            <Check
                                                                className={cn(
                                                                    "mr-2 h-4 w-4",
                                                                    value === "being_shipped" ? "opacity-100" : "opacity-0"
                                                                )}
                                                            />
                                                            Being Shipped
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem onClick={() => { setValue("not_shipped"); updateStatus("not_shipped", order.id) }}>
                                                            <Check
                                                                className={cn(
                                                                    "mr-2 h-4 w-4",
                                                                    value === "not_shipped" ? "opacity-100" : "opacity-0"
                                                                )}
                                                            />
                                                            Not Shipped
                                                        </DropdownMenuItem>
                                                    </DropdownMenuContent>
                                                </DropdownMenu>
                                            ) : null}
                                        </div>
                                        <span className="font-bold text-2xl">
                                            It&apos;s on its way!
                                        </span>
                                        <span className="text-sm text-gray-500">
                                            Your order #{order.id} {value === "shipped" ? "has been shipped and will be with you soon!" : value === "being_shipped" ? "is getting shipped and will be at your doorsteps soon!" : value === "not_shipped" ? "is being proccessed and will be shipped soon!" : "is being proccessed and will be shipped soon!"}
                                        </span>
                                    </div>
                                    <div className="middle flex flex-col gap-2 mt-10  border-t-2 border-t-black">
                                        <ul role="list" className="pb-2 max-h-[19rem] overflow-y-auto">
                                            {orderProducts?.map((product1) => {
                                                const product = product1.product;

                                                return (
                                                    <li className="flex py-6 border-b-2 border-b-black" key={product1.id}>
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
                                                                </div>
                                                                <p className="mt-1 text-sm text-gray-500">{product?.description}</p>
                                                            </div>
                                                            <div className="flex flex-1 items-end gap-2 text-sm">
                                                                <p className='font-bold '>Size <span className="text-gray-500 font-normal">{product1.size}</span></p>
                                                                <p className="ml-4 font-bold">Price <span className="text-gray-500 font-normal">${product?.price}</span></p>
                                                            </div>
                                                        </div>
                                                    </li>
                                                )
                                            })}
                                        </ul>
                                    </div>
                                    <div ref={bottomRef} />
                                </>
                            ) : (
                                <div>
                                    <h1 className="text-center">
                                        Looks like this order has not been paid yet!
                                    </h1>
                                    <p className="text-center-text-gray-300">
                                        Go pay for it bro...
                                    </p>
                                </div>
                            )}
                        </div>
                    ) : (
                        <Icons.spinner className="m-auto h-20 w-20 ml-[29.5vw] animate-spin" />
                    )
                }
            </main >
        </>
    )
}

export default Page;