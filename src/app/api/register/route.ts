import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

// Service Role Key を使用してRLSをバイパス
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  }
);

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      userId,
      business_name,
      postal_code,
      address,
      business_number,
      office_count,
      permit_year,
      business_types,
      contact_name,
      phone,
    } = body;

    if (!userId) {
      return NextResponse.json(
        { error: "ユーザーIDが必要です" },
        { status: 400 }
      );
    }

    // プロファイル更新（Service Role使用でRLSバイパス）
    const { error: profileError } = await supabaseAdmin
      .from("profiles")
      .update({
        business_name,
        postal_code,
        address,
        business_number: business_number || null,
        office_count: office_count ? parseInt(office_count) : null,
        permit_year: permit_year ? parseInt(permit_year) : null,
        business_types: business_types?.length > 0 ? business_types : null,
        contact_name,
        phone,
      })
      .eq("id", userId);

    if (profileError) {
      console.error("プロファイル更新エラー:", profileError);
      return NextResponse.json(
        { error: "プロファイル更新に失敗しました" },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("登録APIエラー:", error);
    return NextResponse.json(
      { error: "登録処理に失敗しました" },
      { status: 500 }
    );
  }
}
