"use client";
import { useState } from "react";
import { Bot, User2, SendHorizontal } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function ChatPage() {
  const [messages, setMessages] = useState([
    {
      id: 1,
      role: "assistant",
      content:
        "Hi! 👋 I'm AniMind. Ask me anything about anime, recommendations, genres, or what to watch next.",
    },
  ]);

  const [input, setInput] = useState("");

  const sendMessage = () => {
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
  };

  return (
    <main className="h-[calc(100vh-102px)] bg-black text-white flex flex-col">
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
      <div className="flex-1 overflow-y-auto px-6 py-6 w-full max-w-5xl mx-auto">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${
              message.role === "user"
                ? "justify-end"
                : "justify-start"
            }`}
          >
            <div
              className={`flex gap-3 max-w-2xl ${
                message.role === "user"
                  ? "flex-row-reverse"
                  : ""
              }`}
            >
              <div
                className={`h-10 w-10 rounded-full flex items-center justify-center ${
                  message.role === "assistant"
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
                className={`rounded-2xl px-5 py-3 ${
                  message.role === "assistant"
                    ? "bg-zinc-900"
                    : "bg-blue-600"
                }`}
              >
                {message.content}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Input */}
      <div className="border-t border-zinc-800 p-4 bg-black sticky bottom-0 z-50">
        <div className="max-w-5xl mx-auto flex gap-3">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask AniMind anything..."
            onKeyDown={(e) => {
              if (e.key === "Enter") sendMessage();
            }}
          />

          <Button onClick={sendMessage}>
            <SendHorizontal className="w-4 h-4 mr-2" />
            Send
          </Button>
        </div>
      </div>
    </main>
  );
}

