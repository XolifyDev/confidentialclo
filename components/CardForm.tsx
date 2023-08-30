"use client";

import React, { FormEvent, FormEventHandler, useEffect, useMemo, useState } from "react";
import { useStripe, useElements, CardNumberElement, AddressElement, CardCvcElement, PaymentElement } from "@stripe/react-stripe-js";
import useResponsiveFontSize from "@/lib/useResponsiveFontSize";
import { Button } from "./ui/button";
import Link from "next/link";
import { User } from "@prisma/client";
import { config } from "@/config";
import { Cart, checkout } from "@/lib/checkout";
import useGlobalStore from "@/store/useGlobalStore";
import { createCheckoutSession, getProductById } from "@/lib/actions/dbActions";
import { Icons } from "./icons";
import { useRouter } from "next/navigation";


const useOptions = () => {
    const fontSize = useResponsiveFontSize();
    const options = useMemo(
        () => ({
            style: {
                base: {
                    fontSize,
                    color: "#424770",
                    letterSpacing: "0.025em",
                    fontFamily: "Source Code Pro, monospace",
                    "::placeholder": {
                        color: "#aab7c4"
                    }
                },
                invalid: {
                    color: "#9e2146"
                }
            }
        }),
        [fontSize]
    );

    return options;
};

const CardForm = ({ user }: { user: User }) => {
    const stripe = useStripe();
    const elements = useElements();
    const options = useOptions();
    const [showForm, setShowForm] = useState(false);
    const [loading, setLoading] = useState(false);
    const [intent, setIntent] = useState<any>();
    const { cart } = useGlobalStore();
    const router = useRouter();
    const appearance = {
        theme: 'stripe',

        variables: {
            colorPrimary: '#0570de',
            colorBackground: '#ffffff',
            colorText: '#30313d',
            colorDanger: '#df1b41',
            fontFamily: 'Ideal Sans, system-ui, sans-serif',
            spacingUnit: '2px',
            borderRadius: '4px',
            // See all possible variables below
        }
    };
    // stripe?.elements({
    //     clientSecret: config.stripe.clientSecret,
    //     // @ts-ignore
    //     appearance
    // });

    // const handleSubmit = async (e: FormDataEvent) => {
    //     e.preventDefault();

    //     if (!stripe || !elements) {
    //         // Stripe.js has not loaded yet. Make sure to disable
    //         // form submission until Stripe.js has loaded.
    //         return;
    //     }

    //     const payload = await stripe.createPaymentMethod({
    //         type: "card",
    //         card: elements.getElement(CardElement),
    //     });

    //     console.log("[PaymentMethod]", payload);
    // };
    const onClick = async () => {
        console.log('onlcik')
        setLoading(true);
        let lineItems: Cart[] = [];
        cart.forEach(async (item) => {
            const product = await getProductById(item.productId);

            return lineItems.push({
                ...item,
                product: product!
            })
        });
        setTimeout(() => {
            checkout(lineItems).then(async (data) => {
                console.log(data)
                await createCheckoutSession(data.id, user.id, cart).then(async () => {
                    await stripe?.redirectToCheckout({
                        sessionId: data.id
                    })
                    setLoading(false);
                })
            })
        }, 1000)
    }
    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        // We don't want to let default form submission happen here,
        // which would refresh the page.
        event.preventDefault();
        let lineItems: Cart[] = [];
        cart.forEach(async (item) => {
            const product = await getProductById(item.productId);

            return lineItems.push({
                ...item,
                product: product!
            })
        });


        const session = await checkout(lineItems);
        // if (!session) return;
        // console.log(session)
        // router.push(session);
        // await stripe?.redirectToCheckout({
        //     sessionId: session.id
        // })
        // if (!stripe || !elements) {
        //     // Stripe.js hasn't yet loaded.
        //     // Make sure to disable form submission until Stripe.js has loaded.
        //     return;
        // }

        // // const result = await stripe.confirmPayment({
        // //     elements,
        // //     clientSecret: config.stripe.clientSecret,
        // //     redirect: "if_required",
        // //     confirmParams: {
        // //         payment_method_data: {
        // //             billing_details: {
        // //                 email: user.email!,
        // //                 name: `${user.firstName} ${user.lastName}`,
        // //                 phone: user.phone_number!
        // //             }
        // //         }
        // //     }
        // // })
        // const result = await stripe.confirmPayment({
        //     //`Elements` instance that was used to create the Payment Element
        //     elements,
        //     confirmParams: {
        //         return_url: "http://localhost:3000",
        //     },
        // });

        // console.log(result)
        // if (result.error) {
        //     // Show error to your customer (for example, payment details incomplete)
        //     console.log(result.error.message);
        // } else {
        //     // Your customer will be redirected to your `return_url`. For some payment
        //     // methods like iDEAL, your customer will be redirected to an intermediate
        //     // site first to authorize the payment, then redirected to the `return_url`.
        // }
    };

    return (
        showForm ? (
            <form onSubmit={handleSubmit} className="mt-2 border-t-black border-t-2 pt-2">
                <div className="max-h-50 overflow-y-auto">
                    {/* Card details
                    <CardNumberElement
                        options={options}
                        onReady={() => {
                            console.log("CardElement [ready]");
                        }}
                        onChange={event => {
                            console.log("CardElement [change]", event);
                        }}
                        onBlur={() => {
                            console.log("CardElement [blur]");
                        }}
                        onFocus={() => {
                            console.log("CardElement [focus]");
                        }}
                    />
                    <CardCvcElement
                        options={options}
                        onReady={() => {
                            console.log("CardElement [ready]");
                        }}
                        onChange={event => {
                            console.log("CardElement [change]", event);
                        }}
                        onBlur={() => {
                            console.log("CardElement [blur]");
                        }}
                        onFocus={() => {
                            console.log("CardElement [focus]");
                        }}
                    />
                    <AddressElement
                        options={{
                            ...options,
                            mode: "shipping"
                        }}
                        onReady={() => {
                            console.log("CardElement [ready]");
                        }}
                        onChange={event => {
                            console.log("CardElement [change]", event);
                        }}
                        onBlur={() => {
                            console.log("CardElement [blur]");
                        }}
                        onFocus={() => {
                            console.log("CardElement [focus]");
                        }}
                    /> */}
                    {/* <PaymentElement options={{
                        defaultValues: {
                            billingDetails: {
                                email: user.email!,
                                name: `${user.firstName} ${user.lastName}`,
                                phone: user.phone_number!
                            }
                        },
                        fields: {
                            billingDetails: {
                                email: "auto",
                                name: "auto",
                                phone: "auto",
                            }
                        }
                    }} /> */}
                </div>
                <Button variant={'default'} className="w-full" type="submit" disabled={!stripe}>
                    Pay
                </Button>
                <div className="mt-6 flex justify-center text-center text-sm text-gray-500">
                    <p className='flex flex-row gap-1'>
                        or
                        <button type="button" className="font-medium text-indigo-600 hover:text-indigo-500">
                            Continue Shopping
                            <span aria-hidden="true"> &rarr;</span>
                        </button>
                    </p>
                </div>
            </form>
        ) : (
            <>
                {/* <div onClick={() => { setShowForm(true) }} className="mt-6"> */}
                <div onClick={onClick} className="mt-6">
                    <Button disabled={loading} className="flex items-center justify-center rounded-md border border-transparent px-6 py-3 w-full text-base font-medium text-white shadow-sm">
                        {loading && (
                            <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
                        )}
                        Checkout
                    </Button>
                    {/* bg-indigo-600 hover:bg-indigo-700 */}
                </div>
                <div className="mt-6 flex justify-center text-center text-sm text-gray-500">
                    <p className='flex flex-row gap-1'>
                        or
                        <Link href={'/store'} type="button" className="font-medium text-indigo-600 hover:text-indigo-500">
                            Continue Shopping
                            <span aria-hidden="true"> &rarr;</span>
                        </Link>
                    </p>
                </div>
            </>
        )
    );
};

export default CardForm;