import { useRouter } from 'next/router'
import '../styles/index.css'
import Head from 'next/head'
import { SessionProvider } from "next-auth/react"
import "./styles.css"

import type { AppProps } from "next/app"
import type { Session } from "next-auth"
import * as rdd from 'react-device-detect';



export default function App({
    Component,
    pageProps: { session, ...pageProps },
}: AppProps<{ session: Session }>) {

    return (
        <>
            <Head>
                <meta name="viewport" content="width=device-width, initial-scale=1.0" />
                <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
                <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
                <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
                <link rel="manifest" href="/site.webmanifest" />
            </Head>
            <SessionProvider session={session}>
                <Component {...pageProps} />
            </SessionProvider>
        </>
    )
}