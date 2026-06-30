"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { Bookmark, Sparkles, User, LogOut, Menu, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function Navbar() {
  const { data: session } = useSession();
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const closeMobileMenu = () => setMobileMenuOpen(false);
  return (
    <nav className="sticky top-0 z-50 border-b border-zinc-800 bg-zinc-900/95 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8 py-4">

        {/* Logo */}
        <Link
          {...(session ? { href: "/dashboard" } : { href: "/" })}
          className="flex items-center gap-2 sm:gap-3 hover-lift rounded-lg px-2 py-2 -mx-2"
        >
          <div className="flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-xl bg-blue-600 text-white font-bold text-lg shadow-lg">
            A
          </div>

          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-white">
              AniMind
            </h1>
          </div>
        </Link>

        {/* Navigation */}
        <div className="hidden md:flex items-center gap-1">
          <Link
            {...(session ? { href: "/dashboard" } : { href: "/" })}
            className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium text-zinc-300 hover:text-white hover:bg-zinc-800 transition-all duration-200"
          >
            Home
          </Link>

          <Link
            href="/watchlist"
            className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium text-zinc-300 hover:text-white hover:bg-zinc-800 transition-all duration-200"
          >
            <Bookmark size={18} />
            Watchlist
          </Link>

          <Link
            href="/chat"
            className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium text-zinc-300 hover:text-white hover:bg-zinc-800 transition-all duration-200"
          >
            <Sparkles size={18} />
            AI Chat
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden p-2 rounded-lg text-zinc-300 hover:text-white hover:bg-zinc-800 transition-all duration-200"
          title="Toggle menu"
        >
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>

        {/* User Actions */}
        <div className="flex items-center gap-2 sm:gap-3">
          {session ? (
            <>
              <Link
                href="/profile"
                className="hidden sm:flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium text-zinc-300 hover:text-white hover:bg-zinc-800 transition-all duration-200"
              >
                <User size={18} />
                <span className="hidden lg:inline">{session.user.name}</span>
              </Link>

              <button
                onClick={() => {
                  signOut({ callbackUrl: "/" });
                }}
                className="flex items-center justify-center p-2 rounded-lg text-zinc-300 hover:text-red-400 hover:bg-red-500/10 transition-all duration-200"
                title="Sign out"
              >
                <LogOut size={18} />
              </button>
            </>
          ) : (
            <Link
              href="/login"
              className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 transition-all duration-200 shadow-lg hover:shadow-lg hover:shadow-blue-500/20"
            >
              Login
            </Link>
          )}
        </div>

      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/50 md:hidden z-40"
            onClick={closeMobileMenu}
          />

          {/* Slide-out Menu */}
          <div className="fixed left-0 top-0 h-screen w-64 bg-zinc-900 border-r border-zinc-800 shadow-lg z-50 md:hidden animate-in fade-in slide-in-from-left-80 duration-300">
            {/* Close Button */}
            <div className="flex justify-end p-4">
              <button
                onClick={closeMobileMenu}
                className="p-2 rounded-lg text-zinc-300 hover:text-white hover:bg-zinc-800 transition-all duration-200"
                title="Close menu"
              >
                <X size={24} />
              </button>
            </div>

            <div className="p-4 space-y-2">
              <Link
                {...(session ? { href: "/dashboard" } : { href: "/" })}
                onClick={closeMobileMenu}
                className="flex items-center gap-3 px-4 py-3 rounded-lg text-base font-medium text-zinc-300 hover:text-white hover:bg-zinc-800 transition-all duration-200"
              >
                Home
              </Link>

              <Link
                href="/watchlist"
                onClick={closeMobileMenu}
                className="flex items-center gap-3 px-4 py-3 rounded-lg text-base font-medium text-zinc-300 hover:text-white hover:bg-zinc-800 transition-all duration-200"
              >
                <Bookmark size={20} />
                Watchlist
              </Link>

              <Link
                href="/chat"
                onClick={closeMobileMenu}
                className="flex items-center gap-3 px-4 py-3 rounded-lg text-base font-medium text-zinc-300 hover:text-white hover:bg-zinc-800 transition-all duration-200"
              >
                <Sparkles size={20} />
                AI Chat
              </Link>

              {session && (
                <Link
                  href="/profile"
                  onClick={closeMobileMenu}
                  className="flex items-center gap-3 px-4 py-3 rounded-lg text-base font-medium text-zinc-300 hover:text-white hover:bg-zinc-800 transition-all duration-200"
                >
                  <User size={20} />
                  Profile
                </Link>
              )}
            </div>
          </div>
        </>
      )}
    </nav>
  );
}
