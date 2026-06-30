"use client"
import React from 'react'
import { useSession, signIn, signOut } from "next-auth/react"
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { Button } from "@/components/ui/button"

const Login = () => {
    const { data: session } = useSession();
    const router = useRouter();

    useEffect(() => {
        if (session) {
            router.push("/dashboard");
        }
    }, [session, router]);

    return (
        <div className="min-h-screen bg-linear-to-br from-zinc-950 via-zinc-900 to-black text-white flex items-center justify-center px-4">
            <div className="w-full max-w-md text-center space-y-8 animate-fade-in">
                {/* Logo */}
                <div className="flex justify-center mb-6">
                    <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-600 text-white font-bold text-2xl shadow-lg shadow-blue-500/50">
                        A
                    </div>
                </div>

                {/* Heading */}
                <div>
                    <h1 className="text-3xl sm:text-4xl font-bold mb-3">
                        Welcome to AniMind
                    </h1>
                    <p className="text-zinc-300 text-base sm:text-lg">
                        Sign in to discover your personalized anime recommendations
                    </p>
                </div>

                {/* Sign In Button */}
                <div>
                    <Button
                        onClick={() => {
                            signIn("github", { callbackUrl: "/dashboard" });
                        }}
                        className="w-full h-12 sm:h-14 text-base sm:text-lg font-semibold flex items-center justify-center gap-2 shadow-lg hover:shadow-lg hover:shadow-blue-500/20 group"
                    >
                        Sign in with GitHub
                    </Button>
                </div>

                {/* Features */}
                <div className="pt-8 border-t border-zinc-800">
                    <p className="text-zinc-400 mb-4 text-sm">With your account you get access to:</p>
                    <ul className="space-y-2 text-sm text-zinc-300">
                        <li className="flex items-center gap-2">
                            <span className="text-blue-400">✓</span>
                            AI-powered anime recommendations
                        </li>
                        <li className="flex items-center gap-2">
                            <span className="text-blue-400">✓</span>
                            Your personal watchlist
                        </li>
                        <li className="flex items-center gap-2">
                            <span className="text-blue-400">✓</span>
                            Anime taste profile
                        </li>
                        <li className="flex items-center gap-2">
                            <span className="text-blue-400">✓</span>
                            Chat with AI assistant
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    )
}

export default Login;