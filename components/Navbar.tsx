'use client';


import { supabase } from '@/lib/supabase';
import { Session } from '@supabase/supabase-js';
import Image from 'next/image';
import Link from 'next/link';
import React, { useState, useEffect, useMemo } from 'react'
import { Button } from './ui/button';
import { useSession } from 'next-auth/react';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { User } from '@prisma/client';
import { findUserByEmail } from '@/lib/actions/dbActions';
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuShortcut, DropdownMenuTrigger } from './ui/dropdown-menu';

export default function Navbar() {
    const [clientWindowHeight, setClientWindowHeight] = useState<number | string>("");
    const session = useSession();
    const [userData, setUserData] = useState<User | null>(null);

    useEffect(() => {
        const getUserData = async () => {
            if (!session.data?.user) return;
            const user = await findUserByEmail({ email: session.data.user.email });

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

    return (
        <nav className={`scrollingNavbar ${showScrollClass && "scrolling"} flex-no-wrap absolute z-20 sticky top-0 flex w-full items-center bg-transparent py-4 lg:flex-wrap lg:justify-start`} data-te-navbar-ref="">
            <div className="flex w-full flex-wrap items-center justify-between px-6">
                <button className="block border-0 bg-transparent px-2.5 py-2 text-neutral-500 hover:no-underline hover:shadow-none focus:no-underline focus:shadow-none focus:outline-none focus:ring-0 dark:text-neutral-200 lg:hidden" type="button" data-te-collapse-init="" data-te-target="#navbarSupportedContent1" aria-controls="navbarSupportedContent1" aria-expanded="false" aria-label="Toggle navigation">
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
                    <div className="relative flex items-center">
                        <a className="mr-4 text-neutral-500 hover:text-neutral-700 focus:text-neutral-700 disabled:text-black/30 dark:text-neutral-200 dark:hover:text-neutral-300 dark:focus:text-neutral-300 [&amp;.active]:text-black/90 dark:[&amp;.active]:text-neutral-400" href="#">
                            <span className="[&amp;>svg]:w-5">
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
                                    <path d="M2.25 2.25a.75.75 0 000 1.5h1.386c.17 0 .318.114.362.278l2.558 9.592a3.752 3.752 0 00-2.806 3.63c0 .414.336.75.75.75h15.75a.75.75 0 000-1.5H5.378A2.25 2.25 0 017.5 15h11.218a.75.75 0 00.674-.421 60.358 60.358 0 002.96-7.228.75.75 0 00-.525-.965A60.864 60.864 0 005.68 4.509l-.232-.867A1.875 1.875 0 003.636 2.25H2.25zM3.75 20.25a1.5 1.5 0 113 0 1.5 1.5 0 01-3 0zM16.5 20.25a1.5 1.5 0 113 0 1.5 1.5 0 01-3 0z"></path>
                                </svg>
                            </span>
                        </a>
                        <div className="relative" data-te-dropdown-ref="">
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <div className="cursor-pointer hidden-arrow flex items-center whitespace-nowrap transition duration-150 ease-in-out motion-reduce:transition-none">
                                        <Avatar>
                                            <AvatarImage src={userData?.image!} alt={userData?.firstName!} />
                                            <AvatarFallback>{userData?.firstName && userData?.firstName.charAt(0) || ""}{userData?.lastName && userData?.lastName.charAt(0) || ""}</AvatarFallback>
                                        </Avatar>
                                    </div>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent className="w-56" align="end" forceMount>
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
                                    <DropdownMenuItem className='cursor-pointer'>
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
                    </div>
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
        </nav>
    )
}
