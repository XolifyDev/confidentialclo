import ProductCard from '@/components/ProductCard';
import SideBar from '@/components/SideBar';
import { getCategoryByUrl } from '@/lib/actions/dbActions';

interface IParams {
    slug: string;
}

export default async function Home({ params }: { params: IParams }) {
    const info = await getCategoryByUrl(params.slug);

    return (
        <>
            {/* <Navbar session={session} /> */}
            <div style={{ backgroundRepeat: "no-repeat", backgroundSize: "cover", contain: "size", backgroundPosition: "center", backgroundImage: "url(https://supabase.com/_next/image?url=%2Fimages%2Fblog%2Fpluggable-storage%2Fpluggable-storage.jpg&w=1920&q=75)" }} className="flex min-h-screen h-screen flex-col items-center justify-between -mt-[7.69vh] mb-[5%] pt-16" />
            <main className="px-60 w-full mb-[10%]">
                <div className="flex flex-row justify-between gap-10 w-full">
                    <SideBar />
                    <div className="flex flex-col gap-5 w-full border-t-[#d0cdcd] border-t-2 pt-5">
                        <h1 className='text-xl'>{info.category?.name}</h1>
                        <div className="flex flex-row gap-3">
                            {info.products.map((product) => (
                                <ProductCard
                                    category={info.category!}
                                    product={product!}
                                    key={product.id!}
                                />
                            ))}
                        </div>
                    </div>
                </div>
            </main>
        </>
    )
}
