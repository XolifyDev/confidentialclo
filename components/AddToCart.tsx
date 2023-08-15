"use client";

import { Products } from '@prisma/client'
import React, { useState } from 'react'
import { Combobox } from './ui/Combobox';
import { Button } from './ui/button';
import useGlobalStore from '@/store/useGlobalStore';
import { useToast } from './ui/use-toast';
import { uniqueId } from 'lodash';

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
        <div>
            <Combobox data={product.sizes.map((e) => {
                return {
                    label: e,
                    value: e
                }
            })} value={value} setValue={setValue} label='Sizes' className="rounded-r-none py-3" />
            <Button onClick={addToCart} className='py-0 h-10'>
                Add To Cart
            </Button>
        </div>
    )
}

export default AddToCart