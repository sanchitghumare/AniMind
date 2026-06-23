"use client"
import React from 'react'
import { useSession, signIn, signOut } from "next-auth/react"
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

const Login = () => {
    const { data: session } = useSession();
     const router = useRouter();
   useEffect(() => {
    
    if (session) {
      router.push(`/${session.user.name}`);
    }
  }, [session, router]);

  const providerBtn = "group flex w-auto  items-center justify-between rounded-xl border border-white/8 bg-white/5 px-4 py-3 text-sm font-semibold text-white transition hover:border-cyan-300/20 hover:bg-white/10";
  return (
    <div className="bg-black text-white min-h-screen flex items-center justify-center">
        <button onClick={() => signIn("github")} className={providerBtn}>
          Sign in with GitHub
        </button>
    </div>
  )
}
export default Login;