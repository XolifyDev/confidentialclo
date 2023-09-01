import { getProductById } from '@/lib/actions/dbActions'
import useGlobalStore from '@/store/useGlobalStore'
import { Products } from '@prisma/client'
import Image from 'next/image'
import React, { useEffect, useState } from 'react'

const CartItem = ({ cartItem, setStuff }: { cartItem: any, setStuff: () => void, }) => {
    const [product, setProduct] = useState<Products | null>(null);
    const { removeItemFromCart } = useGlobalStore();

    useEffect(() => {
        fetch('/api/products/id', {
            method: "GET",
            headers: {
                "id": cartItem.productId
            }
        }).then(res => res.json()).then(e => {
            setProduct(e);
        })
    }, [cartItem])
    return (
        <li suppressHydrationWarning={true} className="flex w-[95%] py-6 px-2 border-b-2 border-black last:border-none" key={cartItem.id}>
            <div suppressHydrationWarning={true}
                className="h-24 w-24 flex-shrink-0 overflow-hidden rounded-md border border-gray-200">
                <Image src={product?.mainImage || "https://tailwindui.com/img/ecommerce-images/shopping-cart-page-04-product-01.jpg"}
                    alt="Salmon orange fabric pouch with match zipper, gray zipper pull, and adjustable hip belt."
                    className="h-full w-full object-cover object-center" height={100} width={100} />
            </div>

            <div suppressHydrationWarning={true} className="ml-4 flex flex-1 flex-col">
                <div suppressHydrationWarning={true}>
                    <div suppressHydrationWarning={true}
                        className="flex justify-between text-base font-medium text-gray-900">
                        <h3 suppressHydrationWarning={true}>
                            <a suppressHydrationWarning={true} href={`/store/${product?.url}`}>{product?.name}</a>
                        </h3>
                        <p suppressHydrationWarning={true} className="ml-4">${product?.price}</p>
                    </div>
                    <p suppressHydrationWarning={true} className="mt-1 text-sm text-gray-500">{product?.description}</p>
                </div>
                <div suppressHydrationWarning={true} className="flex flex-1 items-end justify-between text-sm">
                    <p suppressHydrationWarning={true} className="text-gray-500">Size {cartItem.size}</p>

                    <div suppressHydrationWarning={true} className="flex">
                        <button onClick={() => {
                            removeItemFromCart(cartItem.id);
                            setStuff();
                        }} suppressHydrationWarning={true} type="button"
                            className="font-medium text-indigo-600 hover:text-indigo-500">Remove</button>
                    </div>
                </div>
            </div>
        </li>
    )
}

export default CartItem