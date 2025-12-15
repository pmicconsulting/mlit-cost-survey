"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { searchAddressByPostalCode } from "@/lib/address";
import { BUSINESS_TYPES, type BusinessType, type RegisterFormData } from "@/types/profile";
import {
  Building2,
  MapPin,
  User,
  Phone,
  Mail,
  Lock,
  Loader2,
  Search,
} from "lucide-react";

export default function RegisterForm() {
  const router = useRouter();
  const supabase = createClient();
  const [loading, setLoading] = useState(false);
  const [searchingAddress, setSearchingAddress] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState<Omit<RegisterFormData, 'password_confirm'>>({
    business_name: "",
    postal_code: "",
    address: "",
    business_number: "",
    office_count: "",
    permit_year: "",
    business_types: [],
    contact_name: "",
    phone: "",
    email: "",
    password: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // 事業者番号の入力処理（数字のみ許可、4桁区切りで表示）
  const handleBusinessNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value.replace(/[^0-9]/g, ""); // 数字のみ抽出
    if (rawValue.length <= 12) {
      setFormData((prev) => ({ ...prev, business_number: rawValue }));
    }
  };

  // 事業者番号を4桁区切りで表示
  const formatBusinessNumber = (value: string) => {
    const digits = value.replace(/[^0-9]/g, "");
    const parts = [];
    for (let i = 0; i < digits.length; i += 4) {
      parts.push(digits.slice(i, i + 4));
    }
    return parts.join("-");
  };

  const handleBusinessTypeChange = (type: BusinessType) => {
    setFormData((prev) => {
      const types = prev.business_types.includes(type)
        ? prev.business_types.filter((t) => t !== type)
        : [...prev.business_types, type];
      return { ...prev, business_types: types };
    });
  };

  const handleSearchAddress = async () => {
    if (!formData.postal_code) return;

    setSearchingAddress(true);
    const address = await searchAddressByPostalCode(formData.postal_code);
    if (address) {
      setFormData((prev) => ({ ...prev, address }));
    }
    setSearchingAddress(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    // バリデーション
    if (formData.business_number && formData.business_number.length !== 12) {
      setError("事業者番号は12桁で入力してください");
      setLoading(false);
      return;
    }

    if (formData.password.length < 6) {
      setError("パスワードは6文字以上で入力してください");
      setLoading(false);
      return;
    }

    try {
      // Supabase認証でユーザー作成
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
      });

      if (authError) {
        setError(authError.message);
        setLoading(false);
        return;
      }

      if (!authData.user) {
        setError("ユーザー登録に失敗しました");
        setLoading(false);
        return;
      }

      // プロファイル更新
      const { error: profileError } = await supabase
        .from("profiles")
        .update({
          business_name: formData.business_name,
          postal_code: formData.postal_code,
          address: formData.address,
          business_number: formData.business_number || null,
          office_count: formData.office_count ? parseInt(formData.office_count) : null,
          permit_year: formData.permit_year ? parseInt(formData.permit_year) : null,
          business_types: formData.business_types.length > 0 ? formData.business_types : null,
          contact_name: formData.contact_name,
          phone: formData.phone,
        })
        .eq("id", authData.user.id);

      if (profileError) {
        console.error("プロファイル更新エラー:", profileError);
      }

      // AWS SESでメール送信（API経由）
      try {
        await fetch("/api/send-email", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            to: formData.email,
            businessName: formData.business_name,
            contactName: formData.contact_name,
          }),
        });
      } catch (emailError) {
        console.error("メール送信エラー:", emailError);
      }

      // ダッシュボードへ遷移
      router.push("/dashboard");
      router.refresh();
    } catch (err) {
      setError("登録中にエラーが発生しました");
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div className="bg-white rounded-2xl shadow-xl p-8 border border-slate-200">
        <h2 className="text-2xl font-bold text-slate-900 text-center mb-2">
          回答者登録
        </h2>
        <p className="text-slate-600 text-center mb-6">
          実態調査の回答を開始するためのアカウントを作成します
        </p>

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* 事業者情報 */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-slate-800 border-b pb-2">
              事業者情報
            </h3>

            {/* 事業者名 */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                事業者名 <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  type="text"
                  name="business_name"
                  value={formData.business_name}
                  onChange={handleChange}
                  placeholder="株式会社○○運送"
                  required
                  className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                />
              </div>
            </div>

            {/* 郵便番号・住所 */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  郵便番号
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    name="postal_code"
                    value={formData.postal_code}
                    onChange={handleChange}
                    placeholder="123-4567"
                    className="flex-1 px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                  />
                  <button
                    type="button"
                    onClick={handleSearchAddress}
                    disabled={searchingAddress}
                    className="px-3 py-2 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
                  >
                    {searchingAddress ? (
                      <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                      <Search className="w-5 h-5" />
                    )}
                  </button>
                </div>
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  住所 <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    placeholder="東京都千代田区..."
                    required
                    className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                  />
                </div>
              </div>
            </div>

            {/* 事業者番号・営業所数・許可年 */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  事業者番号
                  <span className="text-slate-500 font-normal ml-1 text-xs">（12桁）</span>
                </label>
                <input
                  type="text"
                  name="business_number"
                  value={formatBusinessNumber(formData.business_number)}
                  onChange={handleBusinessNumberChange}
                  placeholder="0000-0000-0000"
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-center"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  一般貨物運送事業：営業所数
                </label>
                <input
                  type="number"
                  name="office_count"
                  value={formData.office_count}
                  onChange={handleChange}
                  placeholder="1"
                  min="1"
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-center"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  事業許可年
                </label>
                <input
                  type="number"
                  name="permit_year"
                  value={formData.permit_year}
                  onChange={handleChange}
                  placeholder="2020"
                  min="1900"
                  max={new Date().getFullYear()}
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-center"
                />
              </div>
            </div>

            {/* 事業種別 */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                事業種別（複数選択可）
              </label>
              <div className="flex flex-wrap gap-3">
                {BUSINESS_TYPES.map((type) => (
                  <label
                    key={type.value}
                    className="flex items-center gap-2 cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      checked={formData.business_types.includes(type.value)}
                      onChange={() => handleBusinessTypeChange(type.value)}
                      className="w-4 h-4 text-blue-600 border-slate-300 rounded focus:ring-blue-500"
                    />
                    <span className="text-sm text-slate-700">{type.label}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>

          {/* 記入者情報 */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-slate-800 border-b pb-2">
              記入者情報
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  記入者名 <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input
                    type="text"
                    name="contact_name"
                    value={formData.contact_name}
                    onChange={handleChange}
                    placeholder="山田 太郎"
                    required
                    className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  連絡先携帯電話番号 <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="090-1234-5678"
                    required
                    className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* ログイン情報 */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-slate-800 border-b pb-2">
              ログイン情報
            </h3>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                メールアドレス <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="example@email.com"
                  required
                  className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                パスワード <span className="text-red-500">*</span>
                <span className="text-slate-500 font-normal ml-2">（6文字以上）</span>
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  type="text"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="パスワードを入力"
                  required
                  minLength={6}
                  className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                />
              </div>
              <p className="mt-1 text-xs text-slate-500">
                ※入力したパスワードが表示されます。周囲にご注意ください。
              </p>
            </div>
          </div>

          {/* 送信ボタン */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-4 rounded-lg font-semibold text-lg hover:from-blue-700 hover:to-blue-800 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                登録中...
              </>
            ) : (
              "登録して調査に回答する"
            )}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-slate-600">
          すでにアカウントをお持ちの方は{" "}
          <a
            href="/auth/login"
            className="text-blue-600 hover:text-blue-700 font-medium"
          >
            ログイン
          </a>
        </p>
      </div>
    </div>
  );
}
