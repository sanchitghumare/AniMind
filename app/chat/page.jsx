"use client";
import { useState } from "react";
import { Bot, User2, SendHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useSession, signIn } from "next-auth/react";
import { useRef, useEffect } from "react";
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
    <main className="h-[calc(100vh-96px)] bg-black text-white flex flex-col">
      {/* Header */}
      <div className="border-b border-zinc-800 p-6 sticky top-0 z-50 bg-black backdrop-blur ">
        <h1 className="text-3xl font-bold text-blue-500">
          🤖 AniMind AI
        </h1>

        <p className="text-zinc-400 mt-2">
          Your personal anime assistant powered by AI.
        </p>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto " ref={scrollRef}>
        <div className="px-6 py-6 w-full max-w-5xl mx-auto">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.role === "user"
                ? "justify-end"
                : "justify-start"
                }`}
            >
              <div
                className={`flex gap-3 max-w-2xl py-1 ${message.role === "user"
                  ? "flex-row-reverse"
                  : ""
                  }`}
              >
                <div
                  className={`h-10 w-10 rounded-full flex items-center justify-center ${message.role === "assistant"
                    ? "bg-blue-600"
                    : "bg-zinc-700"
                    }`}
                >
                  {message.role === "assistant" ? (
                    <Bot size={20} />
                  ) : (
                    <User2 size={20} />
                  )}
                </div>

                <div
                  className={`rounded-2xl px-5 py-3 ${message.role === "assistant"
                    ? "bg-zinc-900"
                    : "bg-blue-600"
                    }`}
                >
                  {message.content}
                </div>
              </div>
            </div>
          ))}
          {loading && (
            <div className="flex justify-start">
              <div className="bg-zinc-900 rounded-2xl px-5 py-3">
                <span className="animate-pulse">●</span>{" "}
                <span className="animate-pulse delay-150">●</span>{" "}
                <span className="animate-pulse delay-300">●</span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Input */}
      <div className="border-t border-zinc-800 p-4 bg-black sticky bottom-0 z-50">
        <div className="max-w-5xl mx-auto flex gap-3">
          <Input disabled={loading}
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask AniMind anything..."
            onKeyDown={(e) => {
              if (e.key === "Enter") sendMessage();
            }}
          />

          <Button onClick={sendMessage} disabled={loading}>
            <SendHorizontal className="w-4 h-4 mr-2" />
            Send
          </Button>
        </div>
        <Dialog open={!session}>
          <DialogContent className="bg-black text-white">
            <DialogHeader>
              <DialogTitle>🔒 Unlock AniMind AI</DialogTitle>

              <DialogDescription>
                Sign in to chat with your personalized anime assistant.
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4 mt-4">
              <ul className="text-sm text-zinc-400 space-y-2">
                <li>✨ AI recommendations based on your taste</li>
                <li>🎭 Personalized anime conversations</li>
                <li>📚 Watchlist-aware suggestions</li>
              </ul>

              <button
                onClick={() => signIn("github")}
                className="w-full rounded-lg bg-blue-600 py-2 font-semibold hover:bg-blue-700"
              >
                Sign in with GitHub
              </button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </main>
  );
}

