"use client";

import Link from 'next/link'
import React, { useEffect, useState } from 'react'
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from './ui/collapsible'
import { Button } from './ui/button'
import { ChevronDownIcon, ChevronUpIcon, Instagram } from 'lucide-react'
import { config } from '@/config'
import { Categories } from '@prisma/client'
import { getSiteSettings } from '@/lib/actions/dbActions'
import { Icons } from './icons';

const SideBar = () => {
    const [isOpen, setIsOpen] = useState(false)
    const [categories, setCategories] = useState<Categories[]>([]);
    const [siteSettings, setSiteSettings] = useState<any>({})
    const [domLoaded, setDomLoaded] = useState<boolean>(false);
    useEffect(() => {
        setDomLoaded(true);
    }, [])

    useEffect(() => {
        fetch('/api/sitesettings', {
            method: "GET",
            cache: "no-cache",
        }).then(res => res.json()).then((e) => {
            console.log(e)
            setSiteSettings(e);
            setCategories(e.categories);
        })
    }, [])

    return (
        <>
            {domLoaded ? (
                <div className="flex flex-col gap-2 w-[20rem]">
                    <Link href={'/'} className='border-t-[#d0cdcd] border-t-2 pt-3 pb-2  w-full text-black font-normal text-sm font-helvitica uppercase'>
                        Home
                    </Link>
                    <Collapsible
                        open={isOpen}
                        onOpenChange={setIsOpen}
                        className="w-full space-y-1 border-t-[#d0cdcd] border-t-2"
                    >
                        <div className="flex items-center justify-between pt-2">
                            <h4 className="text-sm font-normal font-helvitica uppercase">
                                Store
                            </h4>
                            <CollapsibleTrigger asChild>
                                <Button variant="link" size="sm" className="p-0">
                                    {isOpen ? <ChevronUpIcon className="h-4 w-4" /> : <ChevronDownIcon className="h-4 w-4" />}
                                    <span className="sr-only">Toggle</span>
                                </Button>
                            </CollapsibleTrigger>
                        </div>
                        <CollapsibleContent className={`space-y-1 flex flex-col`}>
                            {
                                categories.map((category) => (
                                    <Link key={category.id} href={`/store/${category.url}`} className="rounded-md px-4 py-3 font-helvitica text-sm animate-accordion-down cursor-pointer">
                                        - {category.name}
                                    </Link>
                                ))
                            }
                        </CollapsibleContent>
                    </Collapsible>
                    <div className="flex flex-row gap-2 border-t-[#d0cdcd] border-t-2 pt-3 pb-2">
                        <Link href={config.siteInfo.instagram} className=''>
                            <Instagram className='w-7 h-7' />

                        </Link>
                        <Link href={config.siteInfo.tiktok} className=''>
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                x="0px"
                                y="0px"
                                width={150}
                                height={150}
                                viewBox="0 0 50 50"
                                className='w-7 h-7'
                                style={{ fill: "#1A1A1A" }}
                            >
                                <path d="M 9 4 C 6.2495759 4 4 6.2495759 4 9 L 4 41 C 4 43.750424 6.2495759 46 9 46 L 41 46 C 43.750424 46 46 43.750424 46 41 L 46 9 C 46 6.2495759 43.750424 4 41 4 L 9 4 z M 9 6 L 41 6 C 42.671576 6 44 7.3284241 44 9 L 44 41 C 44 42.671576 42.671576 44 41 44 L 9 44 C 7.3284241 44 6 42.671576 6 41 L 6 9 C 6 7.3284241 7.3284241 6 9 6 z M 26.042969 10 A 1.0001 1.0001 0 0 0 25.042969 10.998047 C 25.042969 10.998047 25.031984 15.873262 25.021484 20.759766 C 25.016184 23.203017 25.009799 25.64879 25.005859 27.490234 C 25.001922 29.331679 25 30.496833 25 30.59375 C 25 32.409009 23.351421 33.892578 21.472656 33.892578 C 19.608867 33.892578 18.121094 32.402853 18.121094 30.539062 C 18.121094 28.675273 19.608867 27.1875 21.472656 27.1875 C 21.535796 27.1875 21.663054 27.208245 21.880859 27.234375 A 1.0001 1.0001 0 0 0 23 26.240234 L 23 22.039062 A 1.0001 1.0001 0 0 0 22.0625 21.041016 C 21.906673 21.031216 21.710581 21.011719 21.472656 21.011719 C 16.223131 21.011719 11.945313 25.289537 11.945312 30.539062 C 11.945312 35.788589 16.223131 40.066406 21.472656 40.066406 C 26.72204 40.066409 31 35.788588 31 30.539062 L 31 21.490234 C 32.454611 22.653646 34.267517 23.390625 36.269531 23.390625 C 36.542588 23.390625 36.802305 23.374442 37.050781 23.351562 A 1.0001 1.0001 0 0 0 37.958984 22.355469 L 37.958984 17.685547 A 1.0001 1.0001 0 0 0 37.03125 16.6875 C 33.886609 16.461891 31.379838 14.012216 31.052734 10.896484 A 1.0001 1.0001 0 0 0 30.058594 10 L 26.042969 10 z M 27.041016 12 L 29.322266 12 C 30.049047 15.2987 32.626734 17.814404 35.958984 18.445312 L 35.958984 21.310547 C 33.820114 21.201935 31.941489 20.134948 30.835938 18.453125 A 1.0001 1.0001 0 0 0 29 19.003906 L 29 30.539062 C 29 34.707538 25.641273 38.066406 21.472656 38.066406 C 17.304181 38.066406 13.945312 34.707538 13.945312 30.539062 C 13.945312 26.538539 17.066083 23.363182 21 23.107422 L 21 25.283203 C 18.286416 25.535721 16.121094 27.762246 16.121094 30.539062 C 16.121094 33.483274 18.528445 35.892578 21.472656 35.892578 C 24.401892 35.892578 27 33.586491 27 30.59375 C 27 30.64267 27.001859 29.335571 27.005859 27.494141 C 27.009759 25.65271 27.016224 23.20692 27.021484 20.763672 C 27.030884 16.376775 27.039186 12.849206 27.041016 12 z" />
                            </svg>
                        </Link>
                    </div>
                </div>
            ) : (
                <Icons.spinner suppressHydrationWarning={true} className="m-auto h-20 w-20 animate-spin" />
            )}
        </>
    )
}

export default SideBar