"use client";
import { Icons } from '@/components/icons';
import { findUserByEmail } from '@/lib/actions/dbActions';
import { User } from '@prisma/client';
import { ArrowDown } from 'lucide-react'
import { useSession } from 'next-auth/react';
import Image from 'next/image';
import React, { useEffect, useRef, useState } from 'react'
import { isMobile } from 'react-device-detect'


type DivMouseEvent = React.MouseEvent<HTMLDivElement, MouseEvent>;
type InputChangeEvent = React.ChangeEvent<HTMLInputElement>;

const Page = () => {
    const imageInput = useRef<HTMLInputElement>(null);
    const [user, setUser] = useState<User | null>(null);
    const [avatarSource, setAvatarSource] = useState(
        ''
    );
    const [avatarFile, setAvatarFile] = useState<File>();
    const session = useSession();
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
        if (session.status === "loading") return;
        const getUserData = async () => {
            if (session.status === "unauthenticated") return console.log('user not logged un');
            console.log(session)
            // setLoading2(false);
            const user = await findUserByEmail({ email: session.data.user.email });
            console.log(user)
            // if (!user?.isAdmin) router.push("/")
            setUser(user);
            setAvatarSource(user?.image || "")
        }
        getUserData();
    }, [session])

    const onAvatarClick = (e: DivMouseEvent) => imageInput.current?.click();
    const onFileChange = (e: InputChangeEvent) => {
        const file = e.target.files?.item(0);
        setAvatarSource(file ? URL.createObjectURL(file) : avatarSource);
        setAvatarFile(file || undefined);
    };
    return (
        <>
            {session.status !== "unauthenticated" && user ? (
                <>
                    <div style={{
                        backgroundRepeat: "no-repeat", backgroundSize: "cover", contain: "size", backgroundPosition: "center", backgroundImage: `url(${siteSettings.mainHomeImage})`, backgroundBlendMode: "darken", backgroundColor: "rgba(0, 0, 0, .65)"
                    }} className={`relative flex min-h-screen h-screen flex-col items-center justify-between ${!isMobile ? "-mt-[7.695vh]" : "-mt-[8.9vh]"} mb-[5%] pt-16`}>
                        <div className={`arrowDown absolute bottom-5 animate-bounce mb-2 ${isMobile ? "" : "mr-11"}`}>
                            <ArrowDown color='white' className='w-10 h-12' />
                        </div>
                    </div>
                    <main className={`${isMobile ? "px-4" : "px-60"} w-full mb-[10%]`}>
                        <div className='bg-zinc-100 rounded p-2'>
                            <div className="space-y-12">
                                <div className="border-b border-gray-900/10 pb-12">
                                    <h2 className="text-base font-semibold leading-7 text-gray-900">
                                        Profile
                                    </h2>
                                    <p className="mt-1 text-sm leading-6 text-gray-600">
                                        This information will be displayed publicly so be careful what you
                                        share.
                                    </p>
                                    <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
                                        <div className="col-span-full">
                                            <label
                                                htmlFor="photo"
                                                className="block text-sm font-medium leading-6 text-gray-900"
                                            >
                                                Photo
                                            </label>
                                            <div className="mt-2 flex items-center gap-x-3">
                                                {avatarSource.length < 1 ? (
                                                    <svg
                                                        className="h-12 w-12 text-gray-300"
                                                        viewBox="0 0 24 24"
                                                        fill="currentColor"
                                                        aria-hidden="true"
                                                    >
                                                        <path
                                                            fillRule="evenodd"
                                                            d="M18.685 19.097A9.723 9.723 0 0021.75 12c0-5.385-4.365-9.75-9.75-9.75S2.25 6.615 2.25 12a9.723 9.723 0 003.065 7.097A9.716 9.716 0 0012 21.75a9.716 9.716 0 006.685-2.653zm-12.54-1.285A7.486 7.486 0 0112 15a7.486 7.486 0 015.855 2.812A8.224 8.224 0 0112 20.25a8.224 8.224 0 01-5.855-2.438zM15.75 9a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z"
                                                            clipRule="evenodd"
                                                        />
                                                    </svg>
                                                ) : (
                                                    <Image src={avatarSource} alt='Avatar' height={100} width={100} className='w-12 h-12 rounded-full' />
                                                )}
                                                <input
                                                    accept="image/jpeg, image/png"
                                                    type="file" name="image" id="image" hidden ref={imageInput} onChange={onFileChange} />
                                                <div
                                                    // type="button"
                                                    onClick={onAvatarClick}
                                                    className="cursor-pointer rounded-md bg-white px-2.5 py-1.5 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
                                                >
                                                    Change
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="border-b border-gray-900/10 pb-12">
                                    <h2 className="text-base font-semibold leading-7 text-gray-900">
                                        Personal Information
                                    </h2>
                                    <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
                                        <div className="sm:col-span-3">
                                            <label
                                                htmlFor="first-name"
                                                className="block text-sm font-medium leading-6 text-gray-900"
                                            >
                                                First name
                                            </label>
                                            <div className="mt-2">
                                                <input
                                                    type="text"
                                                    name="first-name"
                                                    id="first-name"
                                                    value={user.firstName || user.name?.split(" ")[0]}
                                                    onChange={(e) => setUser({
                                                        ...user,
                                                        firstName: e.target.value
                                                    })}
                                                    autoComplete="given-name"
                                                    className="block w-full rounded-md border-0 py-1.5 px-2 px-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                                />
                                            </div>
                                        </div>
                                        <div className="sm:col-span-3">
                                            <label
                                                htmlFor="last-name"
                                                className="block text-sm font-medium leading-6 text-gray-900"
                                            >
                                                Last name
                                            </label>
                                            <div className="mt-2">
                                                <input
                                                    type="text"
                                                    name="last-name"
                                                    id="last-name"
                                                    value={user.lastName || user.name?.split(" ")[1]}
                                                    onChange={(e) => setUser({
                                                        ...user,
                                                        lastName: e.target.value
                                                    })}
                                                    autoComplete="family-name"
                                                    className="block w-full rounded-md border-0 py-1.5 px-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="border-b border-gray-900/10 pb-12">
                                    <h2 className="text-base font-semibold leading-7 text-gray-900">
                                        Notifications
                                    </h2>
                                    <p className="mt-1 text-sm leading-6 text-gray-600">
                                        We&apos;ll always let you know about important changes, but you pick what
                                        else you want to hear about.
                                    </p>
                                    <div className="mt-10 space-y-10">
                                        <fieldset>
                                            <div className="mt-6 space-y-6">
                                                <div className="relative flex gap-x-3">
                                                    <div className="flex h-6 items-center">
                                                        <input
                                                            id="email"
                                                            name="candidates"
                                                            type="checkbox"
                                                            checked={user.email_subscribed!}
                                                            onChange={(e) => setUser({
                                                                ...user,
                                                                email_subscribed: e.target.checked
                                                            })}
                                                            className="h-4 w-4 rounded border-gray-300 text-indigo-600 checked:ring-indigo-600"
                                                        />
                                                    </div>
                                                    <div className="text-sm leading-6">
                                                        <label htmlFor="candidates" className="font-medium text-gray-900">
                                                            Email Notifications
                                                        </label>
                                                    </div>
                                                </div>

                                            </div>
                                        </fieldset>
                                    </div>
                                </div>
                            </div>
                            <div className="mt-6 flex items-center justify-end gap-x-6">
                                <button
                                    type="button"
                                    className="text-sm font-semibold leading-6 text-gray-900"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                                >
                                    Save
                                </button>
                            </div>
                        </div>
                    </main>
                </>
            ) : (
                <Icons.spinner suppressHydrationWarning={true} className="m-auto h-20 w-20 ml-[47vw] animate-spin" />

            )}
        </>
    )
}

export default Page