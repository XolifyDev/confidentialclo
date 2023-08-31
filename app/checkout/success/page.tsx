"use client";

import { Icons } from '@/components/icons';
import { config } from '@/config';
import { getOrderBySession, getOrderProductsByOrderId } from '@/lib/actions/dbActions';
import { getCheckoutSession } from '@/lib/checkout';
import { OrderProducts, Orders, Products } from '@prisma/client';
import { ArrowDown } from 'lucide-react';
import Image from 'next/image';
import { useSearchParams } from 'next/navigation';
import React, { useEffect, useRef, useState } from 'react'
import { isMobile } from 'react-device-detect';
import Stripe from 'stripe';

interface OrderProductsExtended extends OrderProducts {
    product: Products
}

const stripe = new Stripe(config.stripe.clientSecret, {
    apiVersion: "2022-11-15",
});

const CheckoutSuccess = () => {
    const router = useSearchParams();
    const sessionId = router.get("sessionId") as string;
    const [session, setSession] = useState<any>(null);
    const [order, setOrder] = useState<Orders | null>(null);
    const [orderProducts, setOrderProducts] = useState<OrderProductsExtended[] | null>(null);
    const bottomRef = useRef<HTMLDivElement | null>(null);
    const [siteSettings, setSiteSettings] = useState<any>({})

    useEffect(() => {
        fetch('/api/sitesettings', {
            method: "GET"
        }).then(res => res.json()).then((e) => {
            console.log(e)
            setSiteSettings(e);
            // setCategories(e.categories);
        })
    })
    useEffect(() => {
        const getSession = async () => {
            let o = await fetch('/api/orders/session', {
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
                setSession(s);
                setOrder(o);
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

    return (
        <>
            <div style={{ backgroundRepeat: "no-repeat", backgroundSize: "cover", contain: "size", backgroundPosition: "center", backgroundImage: `url(${siteSettings.mainHomeImage})` }} className={`relative flex min-h-screen h-screen flex-col items-center justify-between ${!isMobile ? "-mt-[7.695vh]" : "-mt-[8.9vh]"} mb-[5%] pt-16`}>
                <div className={`arrowDown absolute bottom-5 animate-bounce mb-2 ${isMobile ? "" : "mr-11"}`}>
                    <ArrowDown color='white' className='w-10 h-12' />
                </div>
            </div>
            <main className={`${isMobile ? "px-4" : "px-60"} w-full mb-[10%]`}>
                {
                    session && order ? (
                        <div className='flex flex-col w-full'>
                            {session.payment_status === "paid" ? (
                                <>
                                    <div className="top flex flex-col gap-3">
                                        <span className="text-blue-500">
                                            Thank you for your purchase!
                                        </span>
                                        <span className="font-bold text-2xl">
                                            It&apos;s on its way!
                                        </span>
                                        <span className="text-sm text-gray-500">
                                            Your order #{order.id} {order.status === "shipped" ? "has been shipped and will be with you soon!" : order.status === "being_shipped" ? "is getting shipped and will be at your doorsteps soon!" : order.status === "not_shipped" ? "is being proccessed and will be shipped soon!" : "is being proccessed and will be shipped soon!"}
                                        </span>
                                    </div>
                                    <div className="middle flex flex-col gap-2 mt-10  border-t-2 border-t-black">
                                        <ul role="list" className="divide-y pb-2 divide-gray-200 max-h-64">
                                            {orderProducts?.map((product1) => {
                                                const product = product1.product;

                                                return (
                                                    <li className="flex py-6 last:border-b-2 last:border-b-black" key={product.id}>
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
                        <Icons.spinner className="m-auto h-20 w-20 animate-spin" />
                    )
                }
            </main>
        </>
    )
}

export default CheckoutSuccess