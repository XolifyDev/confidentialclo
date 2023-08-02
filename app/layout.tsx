import { config } from '@/config'
import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import Navbar from '@/components/Navbar'
import Head from 'next/head'
import { useRouter } from 'next/navigation'
import { Toaster } from '@/components/ui/toaster';
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from 'next/headers';
import { Database } from '@/lib/database.types';
import { supabase } from '@/lib/supabase'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: config.siteInfo.name,
  description: config.siteInfo.description,
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // const { basePath } = useRouter();
  return (
    <html lang="en">
      <Head>
        {/* <link rel="icon" type="image/png" href={`${basePath}/favicon/favicon.ico`} /> */}
        {/* <link rel="shortcut icon" href={favicon} /> */}
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        <link rel="manifest" href="/site.webmanifest" />
      </Head>
      <body className={inter.className}>
        <Toaster />
        {children}
      </body>
    </html>
  )
}
