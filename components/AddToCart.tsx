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
            <div suppressHydrationWarning={true} className='flex flex-row items-center'>
                <DropdownMenu>
                    <DropdownMenuTrigger suppressHydrationWarning={true} className='w-full' asChild>
                        <Button suppressHydrationWarning={true} className='flex flex-row justify-between w-full' variant={'secondary'}>
                            {value === "" ? "Select a size" : value}
                            <ChevronsUpDown suppressHydrationWarning={true} className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent suppressHydrationWarning={true} align='center'>
                        {product.sizes.map((e: any) => (
                            <DropdownMenuItem suppressHydrationWarning={true} className='flex flex-row gap-1 items-center' key={e} onClick={() => setValue(e)}>
                                {e === value ? <Check size={15} /> : null}
                                {e}
                            </DropdownMenuItem>
                        ))}
                    </DropdownMenuContent>
                </DropdownMenu>
                <Button suppressHydrationWarning={true} onClick={addToCart} className='py-0 h-10 w-4/5'>
                    Add To Cart
                </Button>
            </div >
        </>
    )
}

export default AddToCart