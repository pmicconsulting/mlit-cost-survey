"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, Send, Mail, CheckCircle } from "lucide-react";

export default function ContactPage() {
  const [contactForm, setContactForm] = useState({
    email: "",
    message: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [confirmEmailSent, setConfirmEmailSent] = useState(true);
  const [confirmEmailError, setConfirmEmailError] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!contactForm.email || !contactForm.message) return;

    setSubmitting(true);
    setError(null);
    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(contactForm),
      });

      const data = await response.json();
      if (response.ok) {
        setSubmitted(true);
        setConfirmEmailSent(data.confirmEmailSent !== false);
        if (data.confirmEmailError) {
          setConfirmEmailError(data.confirmEmailError);
        }
        setContactForm({ email: "", message: "" });
      } else {
        setError(data.error || "送信に失敗しました。しばらく経ってから再度お試しください。");
      }
    } catch (err) {
      console.error("送信エラー:", err);
      setError("送信に失敗しました。しばらく経ってから再度お試しください。");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100">
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
      <main className="max-w-2xl mx-auto px-4 py-12">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
            <Mail className="w-8 h-8 text-blue-600" />
          </div>
          <h1 className="text-3xl font-bold text-slate-900 mb-2">
            お問い合わせ
          </h1>
          <p className="text-slate-600">
            ご質問やご不明な点がございましたらお気軽にお問い合わせください
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-8 border border-slate-200">
          {submitted ? (
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
              <h2 className="text-xl font-bold text-slate-900 mb-2">
                送信完了
              </h2>
              <p className="text-slate-600 mb-4">
                お問い合わせを受け付けました。<br />
                担当者からの連絡をお待ちください。
              </p>
              {confirmEmailSent ? (
                <p className="text-sm text-green-600 mb-6">
                  ご入力いただいたメールアドレスに確認メールを送信しました。
                </p>
              ) : (
                <div className="mb-6">
                  <p className="text-sm text-amber-600">
                    確認メールの送信に失敗しましたが、お問い合わせは正常に受け付けました。
                  </p>
                  {confirmEmailError && (
                    <p className="text-xs text-slate-500 mt-2">
                      エラー詳細: {confirmEmailError}
                    </p>
                  )}
                </div>
              )}
              <Link
                href="/"
                className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium"
              >
                <ArrowLeft className="w-4 h-4" />
                トップページに戻る
              </Link>
            </div>
          ) : (
            <form onSubmit={handleContactSubmit} className="space-y-6">
              {error && (
                <div className="p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">
                  {error}
                </div>
              )}
              <div>
                <label
                  htmlFor="contact-email"
                  className="block text-sm font-medium text-slate-700 mb-2"
                >
                  返信用メールアドレス <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  id="contact-email"
                  required
                  value={contactForm.email}
                  onChange={(e) =>
                    setContactForm({ ...contactForm, email: e.target.value })
                  }
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  placeholder="example@email.com"
                />
              </div>
              <div>
                <label
                  htmlFor="contact-message"
                  className="block text-sm font-medium text-slate-700 mb-2"
                >
                  質問内容 <span className="text-red-500">*</span>
                </label>
                <textarea
                  id="contact-message"
                  required
                  rows={6}
                  value={contactForm.message}
                  onChange={(e) =>
                    setContactForm({ ...contactForm, message: e.target.value })
                  }
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors resize-none"
                  placeholder="お問い合わせ内容をご入力ください"
                />
              </div>
              <button
                type="submit"
                disabled={submitting}
                className="w-full inline-flex items-center justify-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {submitting ? (
                  <>送信中...</>
                ) : (
                  <>
                    <Send className="w-5 h-5" />
                    送信する
                  </>
                )}
              </button>
            </form>
          )}
        </div>

        {/* Navigation */}
        <div className="mt-8 text-center">
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
