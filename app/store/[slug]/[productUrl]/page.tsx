"use client";

import SideBar from '@/components/SideBar';
import { getCategoryByUrl, getProductByUrl } from '@/lib/actions/dbActions';
import ProductPage from './components/ProductPage';
import { ArrowDown } from 'lucide-react';
import { isMobile } from 'react-device-detect';
import * as rdd from 'react-device-detect';
import { useEffect, useState } from 'react';
import { Icons } from '@/components/icons';


interface IParams {
    productUrl: string;
    slug: string;
}

export default function Home({ params }: { params: IParams }) {
    const [info, setInfo] = useState<any>(null);
    const [product, setProduct] = useState<any>(null);
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
            // console.log(e)
            setSiteSettings(e);
            // setCategories(e.categories);
        })
    }, [])
    useEffect(() => {
        console.log(params)
        if (siteSettings) {
            if (siteSettings.products) {
                console.log(siteSettings.products.filter((e: any) => e.url === params.productUrl))
                setProduct(siteSettings.products.find((e: any) => e.url === params.productUrl) || null)
            }
        }
        fetch('/api/categories/url', {
            method: "GET",
            headers: {
                "url": params.slug
            },
            cache: "no-cache",
        }).then(res => res.json()).then((e) => {
            setInfo(e);
        })
    }, [params, siteSettings])
    return (
        <>
            {domLoaded ? (
                <>
                    <div style={{
                        backgroundRepeat: "no-repeat", backgroundSize: "cover", contain: "size", backgroundPosition: "center", backgroundImage: `url(${siteSettings.mainHomeImage})`, backgroundBlendMode: "darken", backgroundColor: "rgba(0, 0, 0, .65)"
                    }} className={`relative flex min-h-screen h-screen flex-col items-center justify-between ${!isMobile ? "-mt-[7.695vh]" : "-mt-[8.9vh]"} mb-[5%] pt-16`}>
                        <div suppressHydrationWarning={true} className={`arrowDown absolute bottom-5 animate-bounce mb-2 ${isMobile ? "" : "mr-11"}`}>
                            <ArrowDown color='white' className='w-10 h-12' />
                        </div>
                    </div>
                    <main suppressHydrationWarning={true} className={`${isMobile ? "px-4" : "px-60"} w-full mb-[10%]`}>
                        {!info || !product ? (
                            <Icons.spinner suppressHydrationWarning={true} className="m-auto h-20 w-20 ml-[29.5vw] animate-spin" />
                        ) : (
                            <div suppressHydrationWarning={true} className={`flex ${isMobile ? "flex-col pl-7" : "flex-row justify-between"} gap-10 w-full`}>
                                <SideBar />
                                <div suppressHydrationWarning={true} className={`flex flex-col gap-5 ${isMobile ? "w-[90%]" : "w-full"} border-t-[#d0cdcd] border-t-2 pt-5`}>
                                    <ProductPage product={product!} />
                                </div>
                            </div>
                        )}
                    </main>
                </>
            ) : (
                <Icons.spinner suppressHydrationWarning={true} className="m-auto h-20 w-20 ml-[30.5vw] animate-spin" />
            )}
        </>
    )
}
