import { CartItems } from '@/store/useGlobalStore';
import { CheckoutSession, Orders, Products, User } from '@prisma/client';
import Image from 'next/image';
import * as React from 'react';

interface CartItem extends CartItems {
    product: Products
}

interface EmailTemplateProps {
    products: CartItem[],
    order: Orders,
    user: User
}

const EmailTemplate: React.FC<Readonly<EmailTemplateProps>> = ({
    products,
    order,
    user
}) => (
    <div className='flex flex-col w-full'>
        <style>
            {
                `
                .wave {
                    animation - name: wave-animation;
                /* Refers to the name of your @keyframes element below */
                animation-duration: 2.5s;
                /* Change to speed up or slow down */
                animation-iteration-count: infinite;
                /* Never stop waving :) */
                transform-origin: 70% 70%;
                /* Pivot around the bottom-left palm */
                display: inline-block;
    }
                @keyframes wave-animation {
                    0 % {
                        transform: rotate(0.0deg)
                    }
    
      10% {
                    transform: rotate(14.0deg)
      }
    
                /* The following five values can be played with to make the waving more or less extreme */
                20% {
                    transform: rotate(-8.0deg)
      }
    
                30% {
                    transform: rotate(14.0deg)
      }
    
                40% {
                    transform: rotate(-4.0deg)
      }
    
                50% {
                    transform: rotate(10.0deg)
      }
    
                60% {
                    transform: rotate(0.0deg)
      }
    
                /* Reset for the last half to pause */
                100% {
                    transform: rotate(0.0deg)
      }
    }
                `
            }
        </style>
        <div className="top flex flex-col gap-3">
            <span className="text-blue-500">
                Hey {!user.name ? `${user.firstName} ${user.lastName}` : user.name} <span className=''>👋</span>! Thank you for your purchase!
            </span>
            <span className="font-bold text-2xl">
                It's on its way!
            </span>
            <span className="text-sm text-gray-500">
                Your order #{order.id} {order.status === "shipped" ? "has been shipped and will be with you soon!" : order.status === "being_shipped" ? "is getting shipped and will be at your doorsteps soon!" : order.status === "not_shipped" ? "is being proccessed and will be shipped soon!" : "is being proccessed and will be shipped soon!"}
            </span>
        </div>
        <div className="middle flex flex-col gap-2 mt-10  border-t-2 border-t-black">
            <ul role="list" className="divide-y pb-2 divide-gray-200 max-h-64">
                {products?.map((product1) => {
                    const product = product1.product;

                    return (
                        <li className="flex py-6 last:border-b-2 last:border-b-black" key={product1.id}>
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
                                    </div>
                                    <p className="mt-1 text-sm text-gray-500">{product?.description}</p>
                                </div>
                                <div className="flex flex-1 items-end gap-2 text-sm">
                                    <p className='font-bold '>Size <span className="text-gray-500 font-normal">{product1.size}</span></p>
                                    <p className="ml-4 font-bold">Price <span className="text-gray-500 font-normal">${product?.price}</span></p>
                                </div>
                            </div>
                        </li>
                    )
                })}
            </ul>
        </div>
    </div >

);


export default EmailTemplate;