import React from "react";
import card from "../../public/bghero.jpg";
import { Button } from "./ui/button";
import Image from "next/image";
import Link from "next/link";
// import BestSellAddToCart from "./bestSellingCardAddToCart";
import { Categories, Products } from "@prisma/client";
import { Heart } from "lucide-react";
import AddToCart from "./AddToCart";

interface abc {
    product: Products,
    category: Categories
}

const ProductCard = ({
    product,
    category
}: abc) => {
    let discount = 0;
    return (
        <div>
            <div suppressHydrationWarning={true} className="max-w-[350px] h-[30rem] p-4 mx-auto shadow-xl rounded-xl relative group">
                {/* image div */}
                <div suppressHydrationWarning={true} className="h-64 block rounded overflow-hidden">
                    <Link suppressHydrationWarning={true} href={`/store/${category.url}/${product.url}`}>
                        <Image suppressHydrationWarning={true} src={product.mainImage} alt="bestseeling" height={300} width={300} />
                    </Link>
                </div>

                {/* typography  */}
                <div suppressHydrationWarning={true} className="mt-4">
                    {/* title && se murad h k agr title h to h2 wala code show kro */}
                    {product.name ? (
                        <h2 suppressHydrationWarning={true} className="scroll-m-20 border-b pb-2 text-2xl font-semibold tracking-tight transition-colors first:mt-0 text-myblackhead line-clamp-1">
                            {product.name}
                        </h2>
                    ) : null}

                    {product.description ? (
                        <p suppressHydrationWarning={true} className="mt-2 scroll-m-20 text-sm font-semibold tracking-tight text-myblackpara line-clamp-2">
                            {product.description}
                        </p>
                    ) : null}

                    {product.price ? (
                        <div suppressHydrationWarning={true} className="flex gap-3">
                            <p suppressHydrationWarning={true}
                                className={`mt-2 scroll-m-20 text-base font-semibold tracking-tight text-myblackhead line-clamp-1 ${discount > 0 &&
                                    "line-through decoration-2 decoration-myorange/70"
                                    }`}
                            >
                                ${product.price}
                            </p>
                            {/* discounted value */}
                            {discount > 0 ? (
                                <p suppressHydrationWarning={true} className="mt-2 scroll-m-20 text-base font-semibold tracking-tight text-myblackhead line-clamp-1">
                                    {/* @ts-ignore */}
                                    ${product.price - (product.price * discount) / 100}
                                </p>
                            ) : null}
                        </div>
                    ) : null}
                </div>

                {/* button div */}
                <div suppressHydrationWarning={true} className="mt-2">
                    <div suppressHydrationWarning={true} className=" absolute botton-2 right-2">
                        {/* <BestSellAddToCart slug={slug} /> */}
                    </div>
                    {/* <Button className="group bg-myblackhead hover:bg-transparent text-mywhite hover:text-myblackhead scroll-m-20 text-xs font-semibold tracking-tight rounded-xl">
            <AiOutlineShoppingCart className="mr-2 h-4 w-4 group-hover:text-myorange duration-300" />
            Add to Cart
          </Button> */}
                    <AddToCart product={product} />
                    {/* <Button className="group bg-myblackhead hover:bg-transparent text-mywhite hover:text-myblackhead scroll-m-20 text-xs font-semibold tracking-tight rounded-xl absolute botton-2 left-2">
                        <Heart className="mr-2 h-4 w-4 group-hover:text-myorange duration-300" />
                        Buy Now
                    </Button> */}
                    {discount > 0 ? (
                        <div suppressHydrationWarning={true} className="scroll-m-20 text-xs text-mywhite bg-myorange font-semibold tracking-tight absolute top-0 left-2 w-[87px] p-2 text-center uppercase mydiscount">{`${discount}% OFF`}</div>
                    ) : null}
                </div>
            </div>
        </div>
    );
};

export default ProductCard;