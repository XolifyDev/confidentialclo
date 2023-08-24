"use client";
import Navbar from '@/components/Navbar';
import { Icons } from '@/components/icons';
import { Button } from '@/components/ui/button';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { config } from '@/config';
import { getSiteSettings } from '@/lib/actions/dbActions';
import { Categories } from '@prisma/client';
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { ArrowDown, ChevronDownIcon, ChevronUpIcon, ChevronsUpDown, Instagram, Star } from 'lucide-react';
import { cookies } from 'next/headers';
import Image from 'next/image'
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { useEffect, useState } from 'react';
import { isMobile } from 'react-device-detect';


export default function Home() {
  const [isOpen, setIsOpen] = useState(false)
  const [categories, setCategories] = useState<Categories[]>([]);
  const [siteSettings, setSiteSettings] = useState<any>({})

  useEffect(() => {
    getData();
  }, [])

  const getData = async () => {
    getSiteSettings().then((e) => {
      setSiteSettings(e);
      setCategories(e.categories);
    })
  }

  return (
    <>
      {/* <Navbar session={session} /> */}
      <div style={{ backgroundRepeat: "no-repeat", backgroundSize: "cover", contain: "size", backgroundPosition: "center", backgroundImage: "url(https://supabase.com/_next/image?url=%2Fimages%2Fblog%2Fpluggable-storage%2Fpluggable-storage.jpg&w=1920&q=75)" }} className={`relative flex min-h-screen h-screen flex-col items-center justify-between ${!isMobile ? "-mt-[7.695vh]" : "-mt-[8.9vh]"} mb-[5%] pt-16`}>
        <div className="arrowDown absolute bottom-5 animate-bounce mb-2 mr-11">
          <ArrowDown color='white' className='w-10 h-12' />
        </div>
      </div>
      <main className="px-60 w-full mb-[10%]">
        <div className="flex flex-row justify-between gap-10 w-full">
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
          <div className="flex flex-col w-full">
            <Link
              href={siteSettings.mainDropLink ? siteSettings.mainDropLink : "/store"}
            >
              <Image
                src={siteSettings.storeHomeImage ? siteSettings.storeHomeImage : "https://cdn.xolify.store/u/xolifycdn/Qw2twXczYX.png"}
                alt='Store Image'
                width={1000}
                height={900}
                className='max-w-[3068px] w-[65rem]'
                loading='eager'
              />
            </Link>
          </div>
        </div>
      </main>
    </>
  )
}
