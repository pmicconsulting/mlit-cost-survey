"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { createClient } from "@/lib/supabase/client";
import {
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
  Warehouse,
  Upload,
  Headphones,
  Pencil,
  X,
  Save,
} from "lucide-react";
import { BUSINESS_TYPES, BusinessType } from "@/types/profile";
import { Profile, SurveyDraft } from "@/types/profile";

type SurveyStatus = "not_started" | "in_progress" | "submitted";
type OfficeType = "single" | "multiple";

interface OfficeTypeInfo {
  type: OfficeType;
  label: string;
  description: string;
  color: string;
  bgColor: string;
  borderColor: string;
}

function getOfficeType(officeCount: number | string | null | undefined): OfficeTypeInfo {
  const count = typeof officeCount === "string" ? parseInt(officeCount, 10) : officeCount;

  if (!count || count === 1) {
    return {
      type: "single",
      label: "1営業所",
      description: "一般貨物運送事業の営業所が1か所の事業者様向け調査",
      color: "text-emerald-700",
      bgColor: "bg-emerald-50",
      borderColor: "border-emerald-200",
    };
  }

  return {
    type: "multiple",
    label: "2以上の営業所",
    description: "一般貨物運送事業の営業所が2か所以上の事業者様向け調査",
    color: "text-purple-700",
    bgColor: "bg-purple-50",
    borderColor: "border-purple-200",
  };
}

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

// 編集フォームの型
interface EditFormData {
  business_name: string;
  postal_code: string;
  address: string;
  business_number: string;
  office_count: string;
  permit_year: string;
  business_types: BusinessType[];
  contact_name: string;
  phone: string;
}

export default function DashboardPage() {
  const router = useRouter();
  const supabase = createClient();
  const [user, setUser] = useState<{ email?: string } | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [surveyDraft, setSurveyDraft] = useState<SurveyDraft | null>(null);
  const [loading, setLoading] = useState(true);
  const [loggingOut, setLoggingOut] = useState(false);

  // 編集モード関連
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [editForm, setEditForm] = useState<EditFormData>({
    business_name: "",
    postal_code: "",
    address: "",
    business_number: "",
    office_count: "",
    permit_year: "",
    business_types: [],
    contact_name: "",
    phone: "",
  });

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

  // 編集モード開始
  const handleStartEdit = () => {
    if (profile) {
      setEditForm({
        business_name: profile.business_name || "",
        postal_code: profile.postal_code || "",
        address: profile.address || "",
        business_number: profile.business_number || "",
        office_count: profile.office_count?.toString() || "",
        permit_year: profile.permit_year?.toString() || "",
        business_types: profile.business_types || [],
        contact_name: profile.contact_name || "",
        phone: profile.phone || "",
      });
      setIsEditing(true);
      setSaveMessage(null);
    }
  };

  // 編集キャンセル
  const handleCancelEdit = () => {
    setIsEditing(false);
    setSaveMessage(null);
  };

  // フォーム入力変更
  const handleFormChange = (field: keyof EditFormData, value: string | BusinessType[]) => {
    setEditForm((prev) => ({ ...prev, [field]: value }));
  };

  // 事業種別のトグル
  const handleBusinessTypeToggle = (type: BusinessType) => {
    setEditForm((prev) => ({
      ...prev,
      business_types: prev.business_types.includes(type)
        ? prev.business_types.filter((t) => t !== type)
        : [...prev.business_types, type],
    }));
  };

  // 保存処理
  const handleSave = async () => {
    if (!user || !profile) return;

    setSaving(true);
    setSaveMessage(null);

    try {
      const updateData = {
        business_name: editForm.business_name,
        postal_code: editForm.postal_code || null,
        address: editForm.address,
        business_number: editForm.business_number || null,
        office_count: editForm.office_count ? parseInt(editForm.office_count, 10) : null,
        permit_year: editForm.permit_year ? parseInt(editForm.permit_year, 10) : null,
        business_types: editForm.business_types.length > 0 ? editForm.business_types : null,
        contact_name: editForm.contact_name,
        phone: editForm.phone,
        updated_at: new Date().toISOString(),
      };

      const { error } = await supabase
        .from("profiles")
        .update(updateData)
        .eq("id", profile.id);

      if (error) {
        throw error;
      }

      // プロファイルを更新
      setProfile({
        ...profile,
        ...updateData,
      } as Profile);

      setSaveMessage({ type: "success", text: "登録情報を更新しました" });
      setIsEditing(false);
    } catch (error) {
      console.error("Update error:", error);
      setSaveMessage({ type: "error", text: "更新に失敗しました。もう一度お試しください。" });
    } finally {
      setSaving(false);
    }
  };

  const surveyStatus = getSurveyStatus(surveyDraft);
  const officeType = getOfficeType(profile?.office_count);

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
      icon: <Upload className="w-6 h-6" />,
      title: "資料アップロード",
      description: "調査資料をアップロード",
      href: "#",
      color: "from-green-500 to-green-600",
      disabled: true,
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
            <div className="flex items-center gap-4">
              <Link
                href="/download"
                className="hidden sm:inline-flex items-center gap-1.5 text-sm text-slate-600 hover:text-blue-600 transition-colors text-center"
              >
                <Download className="w-4 h-4" />
                <span className="leading-tight">調査回答用エクセルファイル<br />ダウンロード</span>
              </Link>
              <Link
                href="/contact"
                className="hidden sm:inline-flex items-center gap-1.5 text-sm text-slate-600 hover:text-blue-600 transition-colors"
              >
                <Headphones className="w-4 h-4" />
                総合問合せ窓口
              </Link>
              <span className="text-sm text-slate-600 hidden sm:block border-l border-slate-300 pl-4">
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
        {/* Office Type Banner */}
        <div className={`rounded-2xl p-4 mb-6 border-2 ${officeType.bgColor} ${officeType.borderColor}`}>
          <div className="flex items-center gap-4">
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${officeType.type === "single" ? "bg-emerald-100" : "bg-purple-100"}`}>
              <Warehouse className={`w-6 h-6 ${officeType.color}`} />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-3">
                <span className={`text-xl font-bold ${officeType.color}`}>
                  {officeType.label}
                </span>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${officeType.type === "single" ? "bg-emerald-100 text-emerald-700" : "bg-purple-100 text-purple-700"}`}>
                  {officeType.type === "single" ? "簡易版" : "詳細版"}
                </span>
              </div>
              <p className="text-slate-600 text-sm mt-1">{officeType.description}</p>
            </div>
            {profile?.office_count && (
              <div className="text-right hidden sm:block">
                <div className="text-xs text-slate-500">登録営業所数</div>
                <div className={`text-2xl font-bold ${officeType.color}`}>
                  {profile.office_count}<span className="text-sm font-normal ml-1">か所</span>
                </div>
              </div>
            )}
          </div>
        </div>

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
        <div className="grid md:grid-cols-2 gap-6">
          {menuItems.map((item) => {
            const content = (
              <div
                className={`group h-full bg-white rounded-2xl p-6 border transition-all ${
                  item.disabled
                    ? "border-slate-200 opacity-60 cursor-not-allowed"
                    : item.highlight
                    ? "border-blue-300 ring-2 ring-blue-100 hover:shadow-xl cursor-pointer"
                    : "border-slate-200 hover:border-slate-300 hover:shadow-lg cursor-pointer"
                }`}
              >
                <div
                  className={`inline-flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-r ${item.color} text-white mb-4 ${!item.disabled && "group-hover:scale-110"} transition-transform`}
                >
                  {item.icon}
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-1">
                  {item.title}
                </h3>
                <p className="text-slate-600 text-sm mb-4">{item.description}</p>
                {item.disabled ? (
                  <span className="inline-flex items-center text-slate-400 text-sm font-medium">
                    準備中
                  </span>
                ) : (
                  <span className="inline-flex items-center text-blue-600 text-sm font-medium group-hover:gap-2 transition-all">
                    開く
                    <ArrowRight className="w-4 h-4 ml-1" />
                  </span>
                )}
              </div>
            );

            if (item.disabled) {
              return <div key={item.title}>{content}</div>;
            }

            return (
              <Link key={item.title} href={item.href}>
                {content}
              </Link>
            );
          })}
        </div>

        {/* Business Info */}
        <div className="mt-8 bg-white rounded-2xl shadow-lg p-6 border border-slate-200">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
              <FileText className="w-5 h-5 text-blue-600" />
              登録情報
            </h2>
            {!isEditing ? (
              <button
                onClick={handleStartEdit}
                className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
              >
                <Pencil className="w-4 h-4" />
                修正・変更
              </button>
            ) : (
              <div className="flex items-center gap-2">
                <button
                  onClick={handleCancelEdit}
                  disabled={saving}
                  className="inline-flex items-center gap-2 px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors text-sm font-medium disabled:opacity-50"
                >
                  <X className="w-4 h-4" />
                  キャンセル
                </button>
                <button
                  onClick={handleSave}
                  disabled={saving}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm font-medium disabled:opacity-50"
                >
                  {saving ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Save className="w-4 h-4" />
                  )}
                  変更する
                </button>
              </div>
            )}
          </div>

          {/* 保存メッセージ */}
          {saveMessage && (
            <div
              className={`mb-4 p-3 rounded-lg ${
                saveMessage.type === "success"
                  ? "bg-green-50 text-green-700 border border-green-200"
                  : "bg-red-50 text-red-700 border border-red-200"
              }`}
            >
              {saveMessage.text}
            </div>
          )}

          {isEditing ? (
            /* 編集モード */
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* 事業者情報 */}
              <div>
                <h3 className="text-sm font-semibold text-slate-700 mb-3 border-b border-slate-200 pb-2">
                  事業者情報
                </h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs text-slate-500 mb-1">事業者名 *</label>
                    <input
                      type="text"
                      value={editForm.business_name}
                      onChange={(e) => handleFormChange("business_name", e.target.value)}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      required
                    />
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    <div>
                      <label className="block text-xs text-slate-500 mb-1">郵便番号</label>
                      <input
                        type="text"
                        value={editForm.postal_code}
                        onChange={(e) => handleFormChange("postal_code", e.target.value)}
                        placeholder="000-0000"
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                    <div className="col-span-2">
                      <label className="block text-xs text-slate-500 mb-1">住所 *</label>
                      <input
                        type="text"
                        value={editForm.address}
                        onChange={(e) => handleFormChange("address", e.target.value)}
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        required
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs text-slate-500 mb-1">事業者番号</label>
                    <input
                      type="text"
                      value={editForm.business_number}
                      onChange={(e) => handleFormChange("business_number", e.target.value)}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-xs text-slate-500 mb-1">事業所数</label>
                      <input
                        type="number"
                        value={editForm.office_count}
                        onChange={(e) => handleFormChange("office_count", e.target.value)}
                        min="1"
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-slate-500 mb-1">事業許可年</label>
                      <input
                        type="number"
                        value={editForm.permit_year}
                        onChange={(e) => handleFormChange("permit_year", e.target.value)}
                        placeholder="例: 2020"
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs text-slate-500 mb-2">事業種別</label>
                    <div className="flex flex-wrap gap-2">
                      {BUSINESS_TYPES.map((type) => (
                        <button
                          key={type.value}
                          type="button"
                          onClick={() => handleBusinessTypeToggle(type.value)}
                          className={`px-3 py-1.5 rounded-lg text-sm transition-colors ${
                            editForm.business_types.includes(type.value)
                              ? "bg-blue-600 text-white"
                              : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                          }`}
                        >
                          {type.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* 記入者情報 */}
              <div>
                <h3 className="text-sm font-semibold text-slate-700 mb-3 border-b border-slate-200 pb-2">
                  記入者情報
                </h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs text-slate-500 mb-1">記入者名 *</label>
                    <input
                      type="text"
                      value={editForm.contact_name}
                      onChange={(e) => handleFormChange("contact_name", e.target.value)}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-slate-500 mb-1">連絡先電話番号 *</label>
                    <input
                      type="tel"
                      value={editForm.phone}
                      onChange={(e) => handleFormChange("phone", e.target.value)}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-slate-500 mb-1">メールアドレス</label>
                    <p className="text-slate-500 text-sm bg-slate-50 px-3 py-2 rounded-lg">
                      {user?.email || "-"}
                      <span className="text-xs ml-2">(変更不可)</span>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            /* 表示モード */
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
                              {type}
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
          )}
        </div>

        {/* Survey Info Banner */}
        <div className="mt-8 bg-blue-50 rounded-xl p-6 border border-blue-100">
          <h3 className="text-lg font-bold text-slate-900 mb-3">
            国土交通省 適正原価に関する実態調査
          </h3>
          <div className="space-y-2 mb-4">
            <p className="text-slate-700">
              <span className="font-medium">ドライバンタイプ等：</span>
              <span className="text-red-600 font-bold bg-yellow-200 px-2 py-0.5 rounded">令和8年2月20日（金）</span>
            </p>
            <p className="text-slate-700">
              <span className="font-medium">特殊車両：</span>
              <span className="text-red-600 font-bold bg-yellow-200 px-2 py-0.5 rounded">令和8年2月27日（金）</span>
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link
              href="/survey/common/q2-q3"
              className="inline-flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
            >
              <ClipboardCheck className="w-5 h-5" />
              {surveyStatus.status === "in_progress" ? "続きから回答する" : "調査に回答する"}
            </Link>
            <Link
              href="/download"
              className="inline-flex items-center gap-2 border border-slate-300 bg-white text-slate-700 px-6 py-3 rounded-lg font-medium hover:bg-slate-50 transition-colors text-center"
            >
              <Download className="w-5 h-5" />
              <span className="leading-tight">調査回答用エクセルファイル<br />ダウンロード</span>
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
