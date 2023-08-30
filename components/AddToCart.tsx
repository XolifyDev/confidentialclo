"use client";

import { Products } from '@prisma/client'
import React, { useState } from 'react'
import { Combobox } from './ui/Combobox';
import { Button } from './ui/button';
import useGlobalStore from '@/store/useGlobalStore';
import { useToast } from './ui/use-toast';
import { uniqueId } from 'lodash';
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuShortcut, DropdownMenuTrigger } from './ui/dropdown-menu';
import { ArrowUpDown, Check, ChevronsUpDown } from 'lucide-react';

type AddToCartProps = {
    product: Products
};

const AddToCart = ({ product }: AddToCartProps) => {
    const [quantity, setQuantity] = useState<number>(0);
    const [open, setOpen] = React.useState(false)
    const [value, setValue] = React.useState("")
    const { cart, addItemToCart } = useGlobalStore();
    const { toast } = useToast();

    const addToCart = () => {
        if (value.length !== 0) {
            addItemToCart({
                id: uniqueId(),
                productId: product.id,
                added_at: new Date(),
                size: value
            })
            setValue("");
            return toast({
                description: `Product ${product.name} added to cart!`,
                variant: "default"
            })
        } else return toast({
            description: "Please select a size",
            variant: "destructive"
        })
    }

    return (
        <>
            <div className='flex flex-row items-center' suppressHydrationWarning>
                <DropdownMenu>
                    <DropdownMenuTrigger className='w-full' asChild>
                        <Button suppressHydrationWarning className='flex flex-row justify-between w-full' variant={'secondary'}>
                            {value === "" ? "Select a size" : value}
                            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align='center' suppressHydrationWarning>
                        {product.sizes.map((e: any) => (
                            <DropdownMenuItem className='flex flex-row gap-1 items-center' key={e} onClick={() => setValue(e)} suppressHydrationWarning>
                                {e === value ? <Check size={15} /> : null}
                                {e}
                            </DropdownMenuItem>
                        ))}
                    </DropdownMenuContent>
                </DropdownMenu>
                <Button onClick={addToCart} className='py-0 h-10 w-4/5'>
                    Add To Cart
                </Button>
            </div >
        </>
    )
}

export default AddToCart