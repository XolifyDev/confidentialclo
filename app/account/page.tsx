"use client";

import { Icons } from '@/components/icons';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useToast } from '@/components/ui/use-toast';
import { findUserByEmail } from '@/lib/actions/dbActions';
import { User } from '@prisma/client';
import { ArrowDown } from 'lucide-react';
import { useSession } from 'next-auth/react';
import Image from 'next/image';
import React, { useEffect, useState } from 'react'
import { isMobile, isMobileSafari } from 'react-device-detect';
import OrdersTableUser from './components/orders-table-user';

const Page = () => {
    const [domLoaded, SetDomLoaded] = useState(false);
    const [user, setUser] = useState<User | null>({
        banned: false,
        email: "xolify@xolify.store",
        email_subscribed: true,
        emailVerified: true,
        firstName: "Waleed",
        id: "123123123123",
        isAdmin: true,
        lastName: "Nagaria",
        image: null,
        hashedPassword: null,
        name: null,
        phone_number: null
    });
    const session = useSession();
    const [siteSettings, setSiteSettings] = useState<any>({});

    useEffect(() => {
        fetch('/api/sitesettings', {
            method: "GET",
            cache: "no-cache",
        }).then(res => res.json()).then((e) => {
            // console.log(e)
            setSiteSettings(e);
            // setCategories(e.categories);
        })
    }, [])
    useEffect(() => {
        if (session.status === "loading") return;
        const getUserData = async () => {
            // console.log(session)
            if (session.status === "unauthenticated") return console.log('user not logged un');
            const user = await findUserByEmail({ email: session.data.user.email });
            setUser(user);
        }
        getUserData();
    }, [session])
    useEffect(() => {
        SetDomLoaded(true)
    }, [])
    return (
        <>
            {domLoaded && user ? (
                <>
                    <div style={{
                        backgroundRepeat: "no-repeat", backgroundSize: "cover", contain: "size", backgroundPosition: "center", backgroundImage: `url(${siteSettings.mainHomeImage})`, backgroundBlendMode: "darken", backgroundColor: "rgba(0, 0, 0, .30)"
                    }} className={`relative flex min-h-screen h-screen flex-col items-center justify-between ${!isMobile ? "-mt-[7.695vh]" : isMobileSafari ? "-mt-[9.1vh]" : "-mt-[8.9vh]"} mb-[5%] pt-16`}>
                        <div className={`arrowDown absolute bottom-5 animate-bounce mb-2 ${isMobile ? "" : "mr-11"}`}>
                            <ArrowDown color='white' className='w-10 h-12' />
                        </div>
                    </div>
                    <main className={`${isMobile ? "px-4" : "px-60"} w-full mb-[10%]`}>
                        <div className="flex flex-row justify-between gap-3 w-full">
                            <div className="flex flex-col px-10 py-5 gap-2 bg-neutral-100 rounded-sm items-center justify-center">
                                <Avatar suppressHydrationWarning={true} className='border-neutral-600 border'>
                                    <AvatarImage width={60} height={60} suppressHydrationWarning={true} src={user?.image!} alt={`${user?.firstName || user?.name}`} className='w-[70px] h-[60px]' />
                                    <AvatarFallback suppressHydrationWarning={true}>{!user?.name ? `${user?.firstName ? user?.firstName.charAt(0) || "" : null}${user?.lastName ? user?.lastName.charAt(0) || "" : null}` : `${user?.name ? user?.name.split(" ")[0].charAt(0) : null} ${user?.name ? user?.name.split(" ")[1].charAt(0) : null}`}</AvatarFallback>
                                </Avatar>
                                <span >
                                    {!user?.name ? `${user?.firstName ? user?.firstName || "" : null} ${user?.lastName ? user?.lastName || "" : null}` : `${user?.name ? user?.name : null}`}
                                </span>
                                <span className='text-sm'>
                                    {user.email}
                                </span>

                                {user.phone_number ? (
                                    <span>
                                        {user.phone_number}
                                    </span>
                                ) : null}

                            </div>
                            <div className='flex-1'>
                                <h1 className='text-lg border-t border-black'>
                                    Orders
                                </h1>
                                <OrdersTableUser />
                            </div>
                        </div>
                    </main>
                </>
            ) : (
                <Icons.spinner className="m-auto h-20 w-20 ml-[29.5vw] animate-spin" />
            )}
        </>
    )
}

export default Page