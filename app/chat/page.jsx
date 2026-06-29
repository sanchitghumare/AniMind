"use client";
import { useState } from "react";
import { Bot, User2, SendHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useSession, signIn } from "next-auth/react";
import { useRef, useEffect } from "react";
import Navbar from "@/components/ui/Navbar";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";


export default function ChatPage() {
  const scrollRef = useRef(null);
  const inputRef = useRef(null);
  const { data: session } = useSession();
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 1,
      role: "assistant",
      content:
        "Hi! 👋 I'm AniMind. Ask me anything about anime, recommendations, genres, or what to watch next.",
    },
  ]);
  
  useEffect(() => {
    const timeout = setTimeout(() => {
      if (scrollRef.current) {
        scrollRef.current.scrollTo({
          top: scrollRef.current.scrollHeight,
          behavior: "smooth",
        });
      }
    }, 0);

    return () => clearTimeout(timeout);
  }, [messages, loading]);
  
  const [input, setInput] = useState("");
  
  useEffect(() => {
    if (!loading) {
      inputRef.current?.focus();
    }
  }, [loading]);
  
  const sendMessage = async () => {
    try {
      if (!input.trim()) return;

      setMessages((prev) => [
        ...prev,
        {
          id: Date.now(),
          role: "user",
          content: input,
        },
      ]);

      setInput("");
      setLoading(true);
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: input,
        }),
      });
      const data = await response.json();
      if (!response.ok) {
        if (response.status === 429) {
          setMessages((prev) => [
            ...prev,
            {
               id: crypto.randomUUID(),
              role: "assistant",
              content:
                "You're sending messages too quickly. Please wait a minute and try again.",
            },
          ]);
          return;
        }

        throw new Error(data.error || "Something went wrong.");
      }
      setLoading(false);
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now() + 1,
          role: "assistant",
          content: data.response,
        },
      ]);
      inputRef.current?.focus();
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="h-screen bg-black text-white flex flex-col">
      <Navbar />
      
      {/* Header */}
      <div className="border-b border-zinc-800 px-4 sm:px-6 py-4 sm:py-6 sticky top-16 z-40 bg-zinc-900/95 backdrop-blur-md">
        <h1 className="text-2xl sm:text-3xl font-bold">
          🤖 AniMind AI
        </h1>

        <p className="text-zinc-400 mt-2 text-sm sm:text-base">
          Your personal anime assistant powered by AI
        </p>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto" ref={scrollRef}>
        <div className="px-4 sm:px-6 py-6 w-full max-w-4xl mx-auto">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex gap-3 mb-4 sm:mb-6 ${message.role === "user" ? "justify-end" : "justify-start"} animate-slide-up`}
            >
              <div
                className={`flex gap-3 max-w-xs sm:max-w-md lg:max-w-2xl ${message.role === "user" ? "flex-row-reverse" : ""}`}
              >
                {/* Avatar */}
                <div
                  className={`shrink-0 h-8 w-8 sm:h-10 sm:w-10 rounded-full flex items-center justify-center shadow-lg ${
                    message.role === "assistant"
                      ? "bg-linear-to-br from-blue-600 to-blue-700"
                      : "bg-zinc-700"
                  }`}
                >
                  {message.role === "assistant" ? (
                    <Bot size={18} className="sm:w-5 sm:h-5" />
                  ) : (
                    <User2 size={18} className="sm:w-5 sm:h-5" />
                  )}
                </div>

                {/* Message Bubble */}
                <div
                  className={`rounded-xl px-4 sm:px-5 py-3 sm:py-4 text-sm sm:text-base leading-relaxed ${
                    message.role === "assistant"
                      ? "bg-zinc-800 text-zinc-100 border border-zinc-700"
                      : "bg-blue-600 text-white"
                  }`}
                >
                  {message.content}
                </div>
              </div>
            </div>
          ))}
          
          {loading && (
            <div className="flex justify-start mb-4">
              <div className="flex gap-3">
                <div className="shrink-0 h-8 w-8 sm:h-10 sm:w-10 rounded-full flex items-center justify-center bg-linear-to-br from-blue-600 to-blue-700 shadow-lg">
                  <Bot size={18} className="sm:w-5 sm:h-5" />
                </div>
                <div className="bg-zinc-800 border border-zinc-700 rounded-xl px-4 sm:px-5 py-3 sm:py-4">
                  <div className="flex gap-2">
                    <span className="animate-pulse">●</span>
                    <span className="animate-pulse">●</span>
                    <span className="animate-pulse">●</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Input Area */}
      <div className="border-t border-zinc-800 p-4 sm:p-6 bg-zinc-900/95 backdrop-blur-md sticky bottom-0">
        <div className="max-w-4xl mx-auto flex gap-2 sm:gap-3">
          <Input
            disabled={loading}
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask me anything about anime..."
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                sendMessage();
              }
            }}
            className="flex-1"
          />

          <Button
            onClick={sendMessage}
            disabled={loading}
            className="shrink-0"
          >
            <SendHorizontal className="w-4 h-4" />
            <span className="hidden sm:inline ml-2">Send</span>
          </Button>
        </div>
        
        <Dialog open={!session}>
          <DialogContent className="bg-zinc-900 text-white border border-zinc-800">
            <DialogHeader>
              <DialogTitle>🔒 Unlock AniMind AI</DialogTitle>

              <DialogDescription className="text-zinc-400">
                Sign in to chat with your personalized anime assistant.
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4 mt-4">
              <ul className="text-sm text-zinc-300 space-y-2">
                <li>✨ AI recommendations based on your taste</li>
                <li>🎭 Personalized anime conversations</li>
                <li>📚 Watchlist-aware suggestions</li>
              </ul>

              <Button
                onClick={() => signIn("github")}
                className="w-full"
              >
                Sign in with GitHub
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </main>
  );
}
