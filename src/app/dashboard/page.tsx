"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import {
  Building2,
  LogOut,
  User,
  ClipboardCheck,
  FileText,
  Download,
  HelpCircle,
  ArrowRight,
  Loader2,
  CheckCircle2,
  Clock,
  AlertCircle,
  MapPin,
  Phone,
  Mail,
  Building,
} from "lucide-react";
import { Profile, SurveyDraft, BUSINESS_TYPE_LABELS, BusinessType } from "@/types/profile";

type SurveyStatus = "not_started" | "in_progress" | "submitted";

interface SurveyStatusInfo {
  status: SurveyStatus;
  label: string;
  color: string;
  bgColor: string;
  icon: React.ReactNode;
  currentStep?: number;
  lastSaved?: string;
}

function getSurveyStatus(draft: SurveyDraft | null): SurveyStatusInfo {
  if (!draft) {
    return {
      status: "not_started",
      label: "未着手",
      color: "text-slate-600",
      bgColor: "bg-slate-100",
      icon: <AlertCircle className="w-5 h-5" />,
    };
  }

  if (draft.is_submitted) {
    return {
      status: "submitted",
      label: "提出済み",
      color: "text-green-600",
      bgColor: "bg-green-100",
      icon: <CheckCircle2 className="w-5 h-5" />,
      lastSaved: draft.submitted_at,
    };
  }

  return {
    status: "in_progress",
    label: "作成中",
    color: "text-blue-600",
    bgColor: "bg-blue-100",
    icon: <Clock className="w-5 h-5" />,
    currentStep: draft.current_step,
    lastSaved: draft.updated_at,
  };
}

export default function DashboardPage() {
  const router = useRouter();
  const supabase = createClient();
  const [user, setUser] = useState<{ email?: string } | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [surveyDraft, setSurveyDraft] = useState<SurveyDraft | null>(null);
  const [loading, setLoading] = useState(true);
  const [loggingOut, setLoggingOut] = useState(false);

  useEffect(() => {
    const getUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      setUser(user);

      if (user) {
        // プロファイル取得
        const { data: profileData } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", user.id)
          .single();

        if (profileData) {
          setProfile(profileData as Profile);
        }

        // 調査回答状況取得
        const { data: draftData } = await supabase
          .from("survey_drafts")
          .select("*")
          .eq("user_id", user.id)
          .eq("survey_year", 2024)
          .single();

        if (draftData) {
          setSurveyDraft(draftData as SurveyDraft);
        }
      }

      setLoading(false);
    };
    getUser();
  }, [supabase]);

  const handleLogout = async () => {
    setLoggingOut(true);
    await supabase.auth.signOut();
    router.push("/");
    router.refresh();
  };

  const surveyStatus = getSurveyStatus(surveyDraft);

  const menuItems = [
    {
      icon: <ClipboardCheck className="w-6 h-6" />,
      title: surveyStatus.status === "in_progress" ? "続きから回答する" : "調査に回答",
      description:
        surveyStatus.status === "in_progress"
          ? `ステップ${surveyStatus.currentStep || 1}から再開`
          : "原価の実態について回答する",
      href: "/survey",
      color: "from-blue-500 to-blue-600",
      highlight: surveyStatus.status === "in_progress",
    },
    {
      icon: <Download className="w-6 h-6" />,
      title: "資料ダウンロード",
      description: "調査票や記入例をダウンロード",
      href: "/download",
      color: "from-green-500 to-green-600",
    },
    {
      icon: <HelpCircle className="w-6 h-6" />,
      title: "よくあるご質問",
      description: "調査やシステムについてのQ&A",
      href: "/qa",
      color: "from-orange-500 to-orange-600",
    },
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
        <div className="text-slate-400 flex items-center gap-2">
          <Loader2 className="w-5 h-5 animate-spin" />
          読み込み中...
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="flex items-center gap-3">
              <Building2 className="w-8 h-8 text-blue-600" />
              <span className="font-bold text-lg text-slate-800">
                国土交通省
              </span>
            </Link>
            <div className="flex items-center gap-4">
              <span className="text-sm text-slate-600 hidden sm:block">
                {profile?.contact_name || user?.email}
              </span>
              <button
                onClick={handleLogout}
                disabled={loggingOut}
                className="inline-flex items-center gap-2 text-slate-600 hover:text-red-600 transition-colors disabled:opacity-50"
              >
                {loggingOut ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <LogOut className="w-4 h-4" />
                )}
                <span className="hidden sm:inline">ログアウト</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8 border border-slate-200">
          <div className="flex items-start gap-4">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
              <Building className="w-8 h-8 text-blue-600" />
            </div>
            <div className="flex-1 min-w-0">
              <h1 className="text-2xl font-bold text-slate-900 mb-1">
                {profile?.business_name || "事業者"}
              </h1>
              <p className="text-slate-600">
                {profile?.contact_name} 様
              </p>
              {/* Survey Status Badge */}
              <div className="mt-3 flex items-center gap-2">
                <span className="text-sm text-slate-500">調査回答状況:</span>
                <span
                  className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-medium ${surveyStatus.bgColor} ${surveyStatus.color}`}
                >
                  {surveyStatus.icon}
                  {surveyStatus.label}
                </span>
                {surveyStatus.lastSaved && surveyStatus.status !== "not_started" && (
                  <span className="text-xs text-slate-400">
                    ({surveyStatus.status === "submitted" ? "提出日" : "前回保存"}:{" "}
                    {new Date(surveyStatus.lastSaved).toLocaleDateString("ja-JP")})
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Menu Grid */}
        <h2 className="text-xl font-bold text-slate-900 mb-4">メニュー</h2>
        <div className="grid md:grid-cols-3 gap-6">
          {menuItems.map((item) => (
            <Link key={item.title} href={item.href}>
              <div
                className={`group h-full bg-white rounded-2xl p-6 border transition-all cursor-pointer ${
                  item.highlight
                    ? "border-blue-300 ring-2 ring-blue-100 hover:shadow-xl"
                    : "border-slate-200 hover:border-slate-300 hover:shadow-lg"
                }`}
              >
                <div
                  className={`inline-flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-r ${item.color} text-white mb-4 group-hover:scale-110 transition-transform`}
                >
                  {item.icon}
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-1">
                  {item.title}
                </h3>
                <p className="text-slate-600 text-sm mb-4">{item.description}</p>
                <span className="inline-flex items-center text-blue-600 text-sm font-medium group-hover:gap-2 transition-all">
                  開く
                  <ArrowRight className="w-4 h-4 ml-1" />
                </span>
              </div>
            </Link>
          ))}
        </div>

        {/* Business Info */}
        <div className="mt-8 bg-white rounded-2xl shadow-lg p-6 border border-slate-200">
          <h2 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
            <FileText className="w-5 h-5 text-blue-600" />
            登録情報
          </h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* 事業者情報 */}
            <div>
              <h3 className="text-sm font-semibold text-slate-700 mb-3 border-b border-slate-200 pb-2">
                事業者情報
              </h3>
              <dl className="space-y-3">
                <div className="flex items-start gap-3">
                  <Building className="w-4 h-4 text-slate-400 mt-0.5" />
                  <div>
                    <dt className="text-xs text-slate-500">事業者名</dt>
                    <dd className="text-slate-900 font-medium">
                      {profile?.business_name || "-"}
                    </dd>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <MapPin className="w-4 h-4 text-slate-400 mt-0.5" />
                  <div>
                    <dt className="text-xs text-slate-500">住所</dt>
                    <dd className="text-slate-900">
                      {profile?.postal_code && `〒${profile.postal_code} `}
                      {profile?.address || "-"}
                    </dd>
                  </div>
                </div>
                {profile?.business_number && (
                  <div className="flex items-start gap-3">
                    <FileText className="w-4 h-4 text-slate-400 mt-0.5" />
                    <div>
                      <dt className="text-xs text-slate-500">事業者番号</dt>
                      <dd className="text-slate-900">{profile.business_number}</dd>
                    </div>
                  </div>
                )}
                {profile?.business_types && profile.business_types.length > 0 && (
                  <div className="flex items-start gap-3">
                    <ClipboardCheck className="w-4 h-4 text-slate-400 mt-0.5" />
                    <div>
                      <dt className="text-xs text-slate-500">事業種別</dt>
                      <dd className="text-slate-900">
                        <div className="flex flex-wrap gap-1 mt-1">
                          {profile.business_types.map((type) => (
                            <span
                              key={type}
                              className="inline-block px-2 py-0.5 bg-slate-100 text-slate-700 text-xs rounded"
                            >
                              {BUSINESS_TYPE_LABELS[type as BusinessType] || type}
                            </span>
                          ))}
                        </div>
                      </dd>
                    </div>
                  </div>
                )}
                {profile?.office_count && (
                  <div className="text-sm text-slate-600">
                    事業所数: {profile.office_count}か所
                  </div>
                )}
                {profile?.permit_year && (
                  <div className="text-sm text-slate-600">
                    事業許可年: {profile.permit_year}年
                  </div>
                )}
              </dl>
            </div>

            {/* 記入者情報 */}
            <div>
              <h3 className="text-sm font-semibold text-slate-700 mb-3 border-b border-slate-200 pb-2">
                記入者情報
              </h3>
              <dl className="space-y-3">
                <div className="flex items-start gap-3">
                  <User className="w-4 h-4 text-slate-400 mt-0.5" />
                  <div>
                    <dt className="text-xs text-slate-500">記入者名</dt>
                    <dd className="text-slate-900 font-medium">
                      {profile?.contact_name || "-"}
                    </dd>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Phone className="w-4 h-4 text-slate-400 mt-0.5" />
                  <div>
                    <dt className="text-xs text-slate-500">連絡先電話番号</dt>
                    <dd className="text-slate-900">{profile?.phone || "-"}</dd>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Mail className="w-4 h-4 text-slate-400 mt-0.5" />
                  <div>
                    <dt className="text-xs text-slate-500">メールアドレス</dt>
                    <dd className="text-slate-900">{user?.email || "-"}</dd>
                  </div>
                </div>
                {profile?.created_at && (
                  <div className="flex items-start gap-3">
                    <Clock className="w-4 h-4 text-slate-400 mt-0.5" />
                    <div>
                      <dt className="text-xs text-slate-500">登録日</dt>
                      <dd className="text-slate-900">
                        {new Date(profile.created_at).toLocaleDateString("ja-JP")}
                      </dd>
                    </div>
                  </div>
                )}
              </dl>
            </div>
          </div>
        </div>

        {/* Survey Info Banner */}
        <div className="mt-8 bg-blue-50 rounded-xl p-6 border border-blue-100">
          <h3 className="text-lg font-bold text-slate-900 mb-2">
            令和6年度 適正原価実態調査
          </h3>
          <p className="text-slate-600 mb-4">
            回答期限: <strong className="text-blue-600">令和7年1月31日</strong>
          </p>
          <div className="flex flex-wrap gap-3">
            <Link
              href="/survey"
              className="inline-flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
            >
              <ClipboardCheck className="w-5 h-5" />
              {surveyStatus.status === "in_progress" ? "続きから回答する" : "調査に回答する"}
            </Link>
            <Link
              href="/download"
              className="inline-flex items-center gap-2 border border-slate-300 bg-white text-slate-700 px-6 py-3 rounded-lg font-medium hover:bg-slate-50 transition-colors"
            >
              <Download className="w-5 h-5" />
              資料ダウンロード
            </Link>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-400 py-6 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-sm">
          © 2025 Ministry of Land, Infrastructure, Transport and Tourism. All
          rights reserved.
        </div>
      </footer>
    </div>
  );
}
