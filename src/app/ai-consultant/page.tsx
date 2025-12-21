"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  ArrowLeft,
  Send,
  Bot,
  User,
  Loader2,
  MessageCircle,
  Sparkles,
} from "lucide-react";

interface Message {
  role: "user" | "assistant";
  content: string;
}

export default function AIConsultantPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput("");
    setMessages((prev) => [...prev, { role: "user", content: userMessage }]);
    setIsLoading(true);

    try {
      const response = await fetch("/api/ai-consultant", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [...messages, { role: "user", content: userMessage }],
        }),
      });

      if (!response.ok) {
        throw new Error("回答の取得に失敗しました");
      }

      const data = await response.json();
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: data.message },
      ]);
    } catch (error) {
      console.error("エラー:", error);
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content:
            "申し訳ございません。エラーが発生しました。しばらくしてからもう一度お試しください。",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const suggestedQuestions = [
    "調査の目的は何ですか？",
    "回答期限はいつですか？",
    "調査票の記入方法を教えてください",
    "どの車両タイプを選べばよいですか？",
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 flex flex-col">
      {/* Header */}
      <header className="bg-white border-b border-slate-200">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center">
              <Image
                src="/mlit_logo.png"
                alt="国土交通省"
                width={180}
                height={40}
                className="h-10 w-auto"
                priority
              />
            </Link>
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-slate-600 hover:text-blue-600 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              トップへ戻る
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-4xl mx-auto px-4 py-8 w-full flex flex-col">
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-purple-100 rounded-full mb-4">
            <Bot className="w-8 h-8 text-purple-600" />
          </div>
          <h1 className="text-3xl font-bold text-slate-900 mb-2">
            調査に関するAI相談員
          </h1>
          <p className="text-slate-600">
            適正原価実態調査についてのご質問にAIがお答えします
          </p>
        </div>

        {/* Chat Container */}
        <div className="flex-1 bg-white rounded-2xl shadow-lg border border-slate-200 flex flex-col overflow-hidden">
          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4 min-h-[400px]">
            {messages.length === 0 ? (
              <div className="text-center py-8">
                <Sparkles className="w-12 h-12 text-purple-300 mx-auto mb-4" />
                <p className="text-slate-500 mb-6">
                  調査についてご不明な点があればお気軽にご質問ください
                </p>
                <div className="flex flex-wrap justify-center gap-2">
                  {suggestedQuestions.map((question, index) => (
                    <button
                      key={index}
                      onClick={() => setInput(question)}
                      className="px-4 py-2 bg-purple-50 text-purple-700 rounded-full text-sm hover:bg-purple-100 transition-colors"
                    >
                      {question}
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <>
                {messages.map((message, index) => (
                  <div
                    key={index}
                    className={`flex items-start gap-3 ${
                      message.role === "user" ? "flex-row-reverse" : ""
                    }`}
                  >
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                        message.role === "user"
                          ? "bg-blue-100"
                          : "bg-purple-100"
                      }`}
                    >
                      {message.role === "user" ? (
                        <User className="w-4 h-4 text-blue-600" />
                      ) : (
                        <Bot className="w-4 h-4 text-purple-600" />
                      )}
                    </div>
                    <div
                      className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                        message.role === "user"
                          ? "bg-blue-600 text-white"
                          : "bg-slate-100 text-slate-800"
                      }`}
                    >
                      <p className="whitespace-pre-wrap">{message.content}</p>
                    </div>
                  </div>
                ))}
                {isLoading && (
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 bg-purple-100">
                      <Bot className="w-4 h-4 text-purple-600" />
                    </div>
                    <div className="bg-slate-100 rounded-2xl px-4 py-3">
                      <Loader2 className="w-5 h-5 animate-spin text-purple-600" />
                    </div>
                  </div>
                )}
              </>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="border-t border-slate-200 p-4">
            <form onSubmit={handleSubmit} className="flex gap-3">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="質問を入力してください..."
                className="flex-1 px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors"
                disabled={isLoading}
              />
              <button
                type="submit"
                disabled={!input.trim() || isLoading}
                className="inline-flex items-center justify-center gap-2 bg-purple-600 text-white px-6 py-3 rounded-xl font-medium hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <Send className="w-5 h-5" />
                )}
              </button>
            </form>
          </div>
        </div>

        {/* Info */}
        <div className="mt-6 bg-purple-50 rounded-xl p-4 border border-purple-100">
          <div className="flex items-start gap-3">
            <MessageCircle className="w-5 h-5 text-purple-600 flex-shrink-0 mt-0.5" />
            <div className="text-sm text-slate-600">
              <p>
                このAI相談員は適正原価実態調査に関する一般的な質問にお答えします。
                より詳しいご質問や個別のご相談は
                <Link href="/contact" className="text-purple-600 hover:underline">
                  お問い合わせフォーム
                </Link>
                をご利用ください。
              </p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <div className="mt-6 text-center">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-slate-600 hover:text-blue-600 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            トップページに戻る
          </Link>
        </div>
      </main>
    </div>
  );
}
