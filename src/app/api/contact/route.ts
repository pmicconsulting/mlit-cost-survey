import { NextRequest, NextResponse } from "next/server";
import { SESClient, SendEmailCommand } from "@aws-sdk/client-ses";

const sesClient = new SESClient({
  region: process.env.AWS_REGION || "ap-northeast-1",
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || "",
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || "",
  },
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, message } = body;

    if (!email || !message) {
      return NextResponse.json(
        { error: "必要なパラメータが不足しています" },
        { status: 400 }
      );
    }

    const adminEmail = "ask@mlit.site";
    const fromEmail = process.env.AWS_SES_FROM_EMAIL || "noreply@example.com";

    if (!adminEmail) {
      console.error("管理者メールアドレスが設定されていません");
      return NextResponse.json(
        { error: "サーバー設定エラー" },
        { status: 500 }
      );
    }

    const subject = "【国土交通省 適正原価実態調査】お問い合わせ";

    const htmlBody = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
</head>
<body style="font-family: sans-serif; line-height: 1.6; color: #333;">
  <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
    <div style="border-bottom: 2px solid #2563eb; padding-bottom: 20px; margin-bottom: 20px;">
      <h1 style="color: #1e293b; font-size: 24px; margin: 0;">お問い合わせ</h1>
      <p style="color: #64748b; margin: 5px 0 0;">適正原価実態調査システム</p>
    </div>

    <div style="background: #f1f5f9; padding: 20px; border-radius: 8px; margin: 20px 0;">
      <h2 style="font-size: 16px; margin: 0 0 10px; color: #1e293b;">【返信先メールアドレス】</h2>
      <p style="margin: 5px 0;"><a href="mailto:${email}">${email}</a></p>
    </div>

    <div style="margin: 20px 0;">
      <h2 style="font-size: 16px; margin: 0 0 10px; color: #1e293b;">【質問内容】</h2>
      <div style="background: #fff; border: 1px solid #e2e8f0; padding: 15px; border-radius: 8px; white-space: pre-wrap;">${message}</div>
    </div>

    <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 30px 0;">

    <p style="color: #94a3b8; font-size: 12px;">
      このメールは適正原価実態調査システムから自動送信されています。
    </p>
  </div>
</body>
</html>
    `.trim();

    const textBody = `
【お問い合わせ】
適正原価実態調査システム

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
【返信先メールアドレス】
${email}

【質問内容】
${message}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

このメールは適正原価実態調査システムから自動送信されています。
    `.trim();

    const command = new SendEmailCommand({
      Source: fromEmail,
      Destination: {
        ToAddresses: [adminEmail],
      },
      ReplyToAddresses: [email],
      Message: {
        Subject: {
          Data: subject,
          Charset: "UTF-8",
        },
        Body: {
          Text: {
            Data: textBody,
            Charset: "UTF-8",
          },
          Html: {
            Data: htmlBody,
            Charset: "UTF-8",
          },
        },
      },
    });

    await sesClient.send(command);

    return NextResponse.json({ message: "お問い合わせを送信しました" });
  } catch (error) {
    console.error("お問い合わせ送信エラー:", error);
    return NextResponse.json(
      { error: "送信に失敗しました" },
      { status: 500 }
    );
  }
}
