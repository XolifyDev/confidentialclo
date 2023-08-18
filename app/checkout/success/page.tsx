"use client";

import { Icons } from '@/components/icons';
import { getOrderBySession } from '@/lib/actions/dbActions';
import { getCheckoutSession } from '@/lib/checkout';
import { Orders } from '@prisma/client';
import { useSearchParams } from 'next/navigation';
import React, { useEffect, useState } from 'react'

const CheckoutSuccess = () => {
    const router = useSearchParams();
    const sessionId = router.get("sessionId") as string;
    const [session, setSession] = useState<any>(null);
    const [order, setOrder] = useState<Orders | null>(null);

    useEffect(() => {
        const getSession = async () => {
            setSession(await getCheckoutSession(sessionId));
            setOrder(await getOrderBySession(sessionId));
        }
        getSession();
    }, [sessionId])

    return (
        <>
            <div style={{ backgroundRepeat: "no-repeat", backgroundSize: "cover", contain: "size", backgroundPosition: "center", backgroundImage: "url(https://supabase.com/_next/image?url=%2Fimages%2Fblog%2Fpluggable-storage%2Fpluggable-storage.jpg&w=1920&q=75)" }} className="flex min-h-screen h-screen flex-col items-center justify-between -mt-[7.69vh] mb-[5%] pt-16" />
            <main className="px-60 w-full mb-[10%]">
                {
                    session && order ? (
                        <div className='flex flex-col w-full'>
                            <div className="top">
                                <span className="text-blue-500">
                                    Thank You!
                                </span>
                                <span className="font-bold text-lg">
                                    It's on its way!
                                </span>
                                <span className="text-sm text-muted">
                                    Your order #{order.id} {order.status === "shipped" ? "has been shipped and will be with you soon!" : order.status === "being_shipped" ? "is getting shipped and will be at your doorsteps soon!" : order.status === "not_shipped" ? "is being proccessed and will be shipped soon!" : "is being proccessed and will be shipped soon!"}
                                </span>
                            </div>
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