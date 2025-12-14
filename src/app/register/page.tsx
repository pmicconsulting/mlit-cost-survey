import RegisterForm from "@/components/auth/RegisterForm";

export const metadata = {
  title: "回答者登録 | 国土交通省 適正原価実態調査",
  description: "調査に回答するためのアカウントを作成します",
};

export default function RegisterPage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* ヘッダー */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-slate-900 mb-2">
            国土交通省
          </h1>
          <p className="text-lg text-slate-600">
            貨物自動車運送事業 適正原価に関する実態調査
          </p>
        </div>

        {/* 登録フォーム */}
        <RegisterForm />

        {/* フッター */}
        <div className="mt-8 text-center text-sm text-slate-500">
          <p>ご不明な点がございましたら、お問い合わせください。</p>
        </div>
      </div>
    </main>
  );
}
