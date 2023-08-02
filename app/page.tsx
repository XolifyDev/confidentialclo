"use client";
import Navbar from '@/components/Navbar';
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import Image from 'next/image'
import { redirect } from 'next/navigation';


export default function Home() {
  
  return (
    <>
      {/* <Navbar session={session} /> */}
      <main style={{ backgroundRepeat: "no-repeat", backgroundSize: "cover", contain: "size", backgroundPosition: "center", backgroundImage: "url(https://supabase.com/_next/image?url=%2Fimages%2Fblog%2Fpluggable-storage%2Fpluggable-storage.jpg&w=1920&q=75)" }} className="flex min-h-screen h-screen flex-col items-center justify-between -mt-[7.69vh] mb-[20%] pt-16">
        adadadada
      </main>
    </>
  )
}
