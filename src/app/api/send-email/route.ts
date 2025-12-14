import { NextRequest, NextResponse } from "next/server";
import { sendRegistrationEmail } from "@/lib/email";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { to, businessName, contactName } = body;

    if (!to || !businessName || !contactName) {
      return NextResponse.json(
        { error: "必要なパラメータが不足しています" },
        { status: 400 }
      );
    }

    const success = await sendRegistrationEmail({
      to,
      businessName,
      contactName,
    });

    if (success) {
      return NextResponse.json({ message: "メール送信完了" });
    } else {
      return NextResponse.json(
        { error: "メール送信に失敗しました" },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("API エラー:", error);
    return NextResponse.json(
      { error: "サーバーエラー" },
      { status: 500 }
    );
  }
}
