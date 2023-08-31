import { config } from '@/config'
import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import Navbar from '@/components/Navbar'
import Head from 'next/head'
import { useRouter } from 'next/navigation'
import { Toaster } from '@/components/ui/toaster';
import { SessionProvider } from 'next-auth/react';
import { DayPickerProvider } from 'react-day-picker';
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from '@stripe/stripe-js';
import * as rdd from 'react-device-detect';
import { NextAuthProvider } from '@/lib/providers/NextAuthProvider'



const inter = Inter({ subsets: ['latin'] })


export const metadata: Metadata = {
  title: config.siteInfo.name,
  description: config.siteInfo.description,
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // const { basePath } = useRouter();
  return (
    <html lang="en">
      {/* <Head>
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        <link rel="manifest" href="/site.webmanifest" />
      </Head> */}
      <body suppressHydrationWarning={true} className={inter.className}>
        <NextAuthProvider>
          <Toaster />
          <Navbar />
          {children}
        </NextAuthProvider>
      </body>
    </html>
  )
}
