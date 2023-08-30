"use client";

import { getProductById } from '@/lib/actions/dbActions';
import useGlobalStore, { CartItems } from '@/store/useGlobalStore';
import Image from 'next/image';
import React, { useEffect, useState } from 'react'

const Home = () => {
    const [cart, setCart] = useState<CartItems[]>([]);
    const { cart: cartStore } = useGlobalStore();
    const [totalCartCost, setTotalCart] = useState<number>(0);
    useEffect(() => {
        setCart(cartStore);
        const setStuff = async () => {
            let price = 0;
            // console.log(cart);

            for (let i = 0; i < cartStore.length; i++) {
                const e = cartStore[i];
                const product = await getProductById(e.productId);
                const productPrice = Number(product?.price);
                price = price + productPrice;
            }

            // return price;
            console.log(price);
            setTotalCart(price)
        }
        setStuff();
    }, [cartStore])

    return (
        <>
            <div style={{ backgroundRepeat: "no-repeat", backgroundSize: "cover", contain: "size", backgroundPosition: "center", backgroundImage: "url(https://supabase.com/_next/image?url=%2Fimages%2Fblog%2Fpluggable-storage%2Fpluggable-storage.jpg&w=1920&q=75)" }} className="flex min-h-screen h-screen flex-col items-center justify-between -mt-[7.69vh] mb-[5%] pt-16" />
            <main className="px-60 w-full mb-[10%]">
                <div className="w-full flex flex-row justify-between gap-2">
                    <div className="cartItems">
                        <div className="mt-8">
                            <div className="flow-root">
                                <ul role="list" className="-my-6 divide-y pb-2 divide-gray-200">
                                    {cart.map(async (cartItem) => {
                                        const product = await getProductById(cartItem.productId);

                                        return (
                                            <li className="flex py-6" key={cartItem.id}>
                                                <div
                                                    className="h-24 w-24 flex-shrink-0 overflow-hidden rounded-md border border-gray-200">
                                                    <Image src={product?.mainImage || "https://tailwindui.com/img/ecommerce-images/shopping-cart-page-04-product-01.jpg"}
                                                        alt="Salmon orange fabric pouch with match zipper, gray zipper pull, and adjustable hip belt."
                                                        className="h-full w-full object-cover object-center" height={100} width={100} />
                                                </div>

                                                <div className="ml-4 flex flex-1 flex-col">
                                                    <div>
                                                        <div
                                                            className="flex justify-between text-base font-medium text-gray-900">
                                                            <h3>
                                                                <a href={`/store/${product?.url}`}>{product?.name}</a>
                                                            </h3>
                                                            <p className="ml-4">${product?.price}</p>
                                                        </div>
                                                        <p className="mt-1 text-sm text-gray-500">{product?.description}</p>
                                                    </div>
                                                    <div className="flex flex-1 items-end justify-between text-sm">
                                                        <p className="text-gray-500">Size {cartItem.size}</p>

                                                        <div className="flex">
                                                            <button type="button"
                                                                className="font-medium text-indigo-600 hover:text-indigo-500">Remove</button>
                                                        </div>
                                                    </div>
                                                </div>
                                            </li>
                                        )
                                    })}
                                </ul>
                            </div>
                        </div>
                        <div className="border-t border-gray-200 px-4 py-6 sm:px-6">
                            <div className="flex justify-between text-base font-medium text-gray-900">
                                <p>Subtotal</p>
                                <p>${totalCartCost}</p>
                            </div>
                            <p className="mt-0.5 text-sm text-gray-500">Shipping and taxes calculated at checkout.</p>
                            <div className="mt-6">
                                <a href="#"
                                    className="flex items-center justify-center rounded-md border border-transparent bg-indigo-600 px-6 py-3 text-base font-medium text-white shadow-sm hover:bg-indigo-700">Checkout</a>
                            </div>
                            <div className="mt-6 flex gap-2 justify-center text-center text-sm text-gray-500">
                                <p>
                                    or

                                    <button type="button" className="font-medium text-indigo-600 hover:text-indigo-500">
                                        Continue Shopping
                                        <span aria-hidden="true"> &rarr;</span>
                                    </button>
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </>
    )
}

export default Home