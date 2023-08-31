"use client";
import ProductCard from '@/components/ProductCard';
import SideBar from '@/components/SideBar';
import { Icons } from '@/components/icons';
import { getCategoryByUrl } from '@/lib/actions/dbActions';
import { ArrowDown } from 'lucide-react';
import { useEffect, useState } from 'react';
import { isMobile } from 'react-device-detect';
interface IParams {
    slug: string;
}

export default function Home({ params }: { params: IParams }) {
    const [info, setInfo] = useState<any>(null);
    const [domLoaded, setDomLoaded] = useState(false);
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
        setDomLoaded(true);
    }, []);
    useEffect(() => {
        fetch('/api/categories/url', {
            method: "GET",
            headers: {
                "url": params.slug
            }
        }).then(res => res.json()).then((e) => {
            setInfo(e);
        })
    }, [])
    return (
        <>
            {domLoaded && (
                <>
                    <div style={{
                        backgroundRepeat: "no-repeat", backgroundSize: "cover", contain: "size", backgroundPosition: "center", backgroundImage: `url(${siteSettings.mainHomeImage})`, backgroundBlendMode: "darken", backgroundColor: "rgba(0, 0, 0, .65)"
                    }} className={`relative flex min-h-screen h-screen flex-col items-center justify-between ${!isMobile ? "-mt-[7.695vh]" : "-mt-[8.9vh]"} mb-[5%] pt-16`}>

                        <div suppressHydrationWarning={true} className={`arrowDown absolute bottom-5 animate-bounce mb-2 ${isMobile ? "" : "mr-11"}`}>
                            <ArrowDown color='white' className='w-10 h-12' />
                        </div>
                    </div>
                    <main suppressHydrationWarning={true} className={`${isMobile ? "px-4" : "px-60"} w-full mb-[10%]`}>
                        {!info ? (
                            <Icons.spinner suppressHydrationWarning={true} className="m-auto h-20 w-20 ml-[29.5vw] animate-spin" />
                        ) : (
                            <div suppressHydrationWarning={true} className={`flex ${isMobile ? "flex-col pl-7" : "flex-row justify-between"} gap-10 w-full`}>
                                <SideBar />
                                <div suppressHydrationWarning={true} className="flex flex-col w-full border-t-[#d0cdcd] border-t-2 pt-5">
                                    <h1 suppressHydrationWarning={true} className='text-xl'>{info.category?.name}</h1>
                                    <div suppressHydrationWarning={true} className="flex flex-row gap-3">
                                        {info.products.map((product: any) => (
                                            <ProductCard
                                                category={info.category!}
                                                product={product!}
                                                key={product.id!}
                                            />
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}
                    </main>
                </>
            )}
        </>
    )
}
