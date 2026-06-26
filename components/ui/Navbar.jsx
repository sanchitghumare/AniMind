"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { Bookmark, Sparkles, User, LogOut } from "lucide-react";
export default function Navbar() {
  const { data: session } = useSession();
  return (<nav className="sticky top-0 z-50 h-24 border-b border-zinc-800 bg-gray-700 backdrop-blur" style={{ backgroundColor: "#374151" }}> <div className="mx-auto flex max-w-7xl items-center justify-between px-8 py-5">

    {/* Logo */}
    <Link
      href="/"
      className="flex items-center gap-3"
    >
      <div className="flex h-12 w-12 px-4 items-center justify-center rounded-xl bg-primary text-primary-foreground font-bold text-xl">
        A
      </div>

      <div>
        <h1 className="text-2xl font-bold">
          AniMind
        </h1>

      </div>
    </Link>

    {/* Navigation */}
    <div className="flex items-center gap-10">
      <Link
       {...session ? { href: `/${session.user.username}` } : { href: "/" }}
       className="hover:text-primary transition-colors hover:bg-accent hover:rounded-lg px-3 py-2"
      >
        Home
      </Link>

      <Link
        href="/watchlist"
        className="flex items-center gap-2 hover:text-primary transition-colors hover:bg-accent hover:rounded-lg px-3 py-2"
      >
        <Bookmark size={18} />
        Watchlist
      </Link>

      <Link
        href="/chat"
        className="flex items-center gap-2 hover:text-primary transition-colors hover:bg-accent hover:rounded-lg px-3 py-2"
      >
        <Sparkles size={18} />
        AI Advisor
      </Link>
    </div>

    {/* User Actions */}
    <div className="flex items-center gap-3">
      {session ? (
        <>
          <Link
            href="/profile"
            className="rounded-lg p-2 hover:bg-accent"
          >
            <User size={20} />
            <span className="ml-2">{session.user.name}</span>
          </Link>

          <button
            onClick={() => signOut()}
            className="rounded-lg p-2 hover:bg-accent"
          >
            <LogOut size={20}
            />

          </button>
        </>
      ) : (
        <Link
          href="/login"
          className="rounded-xl bg-primary px-5 py-2 font-semibold text-primary-foreground"
        >
          Login
        </Link>
      )}
    </div>

  </div>
  </nav>
  );
}
