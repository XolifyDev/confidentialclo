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
            method: "GET"
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
                    <Link href={config.siteInfo.instagram} className='border-t-[#d0cdcd] border-t-2 pt-3 pb-2'>
                        <Instagram className='w-7 h-7' />
                    </Link>
                </div>
            ) : (
                <Icons.spinner suppressHydrationWarning={true} className="m-auto h-20 w-20 animate-spin" />
            )}
        </>
    )
}

export default SideBar