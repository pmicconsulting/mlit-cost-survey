"use client";

import { useState } from "react";
import Link from "next/link";
import { Building2, ChevronDown, ChevronUp, HelpCircle, ArrowLeft } from "lucide-react";

interface FAQItem {
  question: string;
  answer: string;
}

interface FAQCategory {
  title: string;
  items: FAQItem[];
}

const faqData: FAQCategory[] = [
  {
    title: "調査について",
    items: [
      {
        question: "調査の目的は何ですか？",
        answer:
          "本調査は、貨物自動車運送事業における適正な原価構造を把握し、持続可能な運送事業の発展に寄与するための基礎資料を収集することを目的としています。調査結果は、運送業界の政策立案や適正運賃の算定に活用されます。",
      },
      {
        question: "回答期限はいつですか？",
        answer:
          "令和7年1月31日までにご回答をお願いいたします。期限を過ぎた場合でも、可能な限りご回答いただけますと幸いです。",
      },
      {
        question: "回答は必須ですか？",
        answer:
          "本調査への回答は任意ですが、運送業界全体の実態を正確に把握するために、できる限り多くの事業者様からのご回答をお願いしております。ご協力いただいた内容は、業界の発展に活用されます。",
      },
      {
        question: "回答内容は公開されますか？",
        answer:
          "個別の回答内容が公開されることはありません。収集したデータは統計的に処理され、個別の事業者が特定されない形で活用されます。",
      },
    ],
  },
  {
    title: "システムについて",
    items: [
      {
        question: "パスワードを忘れてしまいました",
        answer:
          "ログインページの「パスワードをお忘れの方」リンクからパスワードの再設定が可能です。登録したメールアドレス宛にパスワード再設定用のリンクが送信されます。",
      },
      {
        question: "途中で保存できますか？",
        answer:
          "はい、調査回答は自動的に保存されます。途中で中断しても、次回ログイン時に続きから回答を再開できます。",
      },
      {
        question: "登録したメールアドレスを変更できますか？",
        answer:
          "メールアドレスの変更はダッシュボードのアカウント設定から行えます。変更後は新しいメールアドレスでログインしてください。",
      },
      {
        question: "複数の端末から回答できますか？",
        answer:
          "はい、同じアカウントでログインすれば、パソコン、タブレット、スマートフォンなど複数の端末から回答を続けることができます。",
      },
    ],
  },
  {
    title: "回答について",
    items: [
      {
        question: "回答にはどのくらいの時間がかかりますか？",
        answer:
          "事前に必要な資料をご準備いただければ、約30分〜1時間程度で回答可能です。途中保存ができますので、複数回に分けて回答いただくこともできます。",
      },
      {
        question: "必要な資料はありますか？",
        answer:
          "直近の決算書、人件費明細、燃料費明細などをご用意いただくと、正確な回答がしやすくなります。詳細は「資料ダウンロード」ページの記入例をご参照ください。",
      },
      {
        question: "回答を修正できますか？",
        answer:
          "最終提出前であれば、いつでも回答内容を修正できます。提出後の修正が必要な場合は、お問い合わせください。",
      },
    ],
  },
];

function FAQAccordion({ item }: { item: FAQItem }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border border-slate-200 rounded-lg overflow-hidden">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-4 text-left bg-white hover:bg-slate-50 transition-colors"
      >
        <span className="font-medium text-slate-900">Q. {item.question}</span>
        {isOpen ? (
          <ChevronUp className="w-5 h-5 text-slate-400 flex-shrink-0" />
        ) : (
          <ChevronDown className="w-5 h-5 text-slate-400 flex-shrink-0" />
        )}
      </button>
      {isOpen && (
        <div className="p-4 bg-slate-50 border-t border-slate-200">
          <p className="text-slate-600">A. {item.answer}</p>
        </div>
      )}
    </div>
  );
}

export default function QAPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100">
      {/* Header */}
      <header className="bg-white border-b border-slate-200">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center gap-3">
              <Building2 className="w-8 h-8 text-blue-600" />
              <span className="font-bold text-lg text-slate-800">国土交通省</span>
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
      <main className="max-w-4xl mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-orange-100 rounded-full mb-4">
            <HelpCircle className="w-8 h-8 text-orange-600" />
          </div>
          <h1 className="text-3xl font-bold text-slate-900 mb-2">
            よくあるご質問
          </h1>
          <p className="text-slate-600">
            調査やシステムに関するよくあるご質問をまとめました
          </p>
        </div>

        <div className="space-y-8">
          {faqData.map((category) => (
            <div key={category.title}>
              <h2 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-2">
                <span className="w-1 h-6 bg-blue-600 rounded-full"></span>
                {category.title}
              </h2>
              <div className="space-y-3">
                {category.items.map((item, index) => (
                  <FAQAccordion key={index} item={item} />
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Contact Section */}
        <div className="mt-12 bg-white rounded-2xl p-8 border border-slate-200 text-center">
          <h2 className="text-xl font-bold text-slate-900 mb-2">
            お探しの回答が見つかりませんか？
          </h2>
          <p className="text-slate-600 mb-6">
            上記以外のご質問がございましたら、お気軽にお問い合わせください。
          </p>
          <div className="inline-flex items-center gap-4">
            <Link
              href="/download"
              className="inline-flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors text-center"
            >
              <span className="leading-tight">調査回答用エクセルファイル<br />ダウンロード</span>
            </Link>
            <Link
              href="/"
              className="inline-flex items-center gap-2 border border-slate-300 text-slate-700 px-6 py-3 rounded-lg font-medium hover:bg-slate-50 transition-colors"
            >
              トップページ
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
