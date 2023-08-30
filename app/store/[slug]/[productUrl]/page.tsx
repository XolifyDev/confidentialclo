import ProductCard from '@/components/ProductCard';
import SideBar from '@/components/SideBar';
import { getCategoryByUrl, getProductByUrl } from '@/lib/actions/dbActions';
import ProductPage from './components/ProductPage';
import { ArrowDown } from 'lucide-react';
import { isMobile } from 'react-device-detect';
import * as rdd from 'react-device-detect';


interface IParams {
    productUrl: string;
    slug: string;
}

export default async function Home({ params }: { params: IParams }) {
    console.log(params)
    const info = await getCategoryByUrl(params.slug);
    const product = await getProductByUrl(params.productUrl);
    return (
        <>
            {/* <Navbar session={session} /> */}
            <div style={{ backgroundRepeat: "no-repeat", backgroundSize: "cover", contain: "size", backgroundPosition: "center", backgroundImage: "url(https://supabase.com/_next/image?url=%2Fimages%2Fblog%2Fpluggable-storage%2Fpluggable-storage.jpg&w=1920&q=75)" }} className={`relative flex min-h-screen h-screen flex-col items-center justify-between ${!isMobile ? "-mt-[7.695vh]" : "-mt-[8.9vh]"} mb-[5%] pt-16`}>
                <div className={`arrowDown absolute bottom-5 animate-bounce mb-2 ${isMobile ? "" : "mr-11"}`}>
                    <ArrowDown color='white' className='w-10 h-12' />
                </div>
            </div>
            <main className={`${isMobile ? "px-4" : "px-60"} w-full mb-[10%]`}>
                <div className={`flex ${isMobile ? "flex-col pl-7" : "flex-row justify-between"} gap-10 w-full`}>
                    <SideBar />
                    <div className={`flex flex-col gap-5 ${isMobile ? "w-[90%]" : "w-full"} border-t-[#d0cdcd] border-t-2 pt-5`}>
                        <ProductPage product={product!} />
                    </div>
                </div>
            </main>
        </>
    )
}
