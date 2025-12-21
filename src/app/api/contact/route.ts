import { NextRequest, NextResponse } from "next/server";
import { SESClient, SendEmailCommand } from "@aws-sdk/client-ses";

const sesClient = new SESClient({
  region: process.env.AWS_REGION || "ap-northeast-1",
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || "",
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || "",
  },
});

// リトライ付きメール送信関数
async function sendEmailWithRetry(
  command: SendEmailCommand,
  maxRetries: number = 3,
  delayMs: number = 1000
): Promise<{ success: boolean; messageId?: string; error?: string }> {
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      const result = await sesClient.send(command);
      return { success: true, messageId: result.MessageId };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      console.error(`メール送信試行 ${attempt}/${maxRetries} 失敗:`, errorMessage);

      if (attempt === maxRetries) {
        return { success: false, error: errorMessage };
      }

      // 次のリトライまで待機
      await new Promise(resolve => setTimeout(resolve, delayMs * attempt));
    }
  }
  return { success: false, error: "最大リトライ回数に到達" };
}

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
    const fromEmail = "ask@mlit.site";

    console.log("=== お問い合わせ処理開始 ===");
    console.log("送信者メールアドレス:", email);

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

    // 管理者へのメール送信
    const adminCommand = new SendEmailCommand({
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

    console.log("1. 管理者へのメール送信開始:", adminEmail);
    const adminResult = await sendEmailWithRetry(adminCommand);
    if (!adminResult.success) {
      console.error("1. 管理者へのメール送信失敗:", adminResult.error);
      throw new Error(`管理者メール送信失敗: ${adminResult.error}`);
    }
    console.log("1. 管理者へのメール送信成功:", adminResult.messageId);

    // 送信者への確認メール
    const now = new Date();
    const sendTime = now.toLocaleString("ja-JP", {
      timeZone: "Asia/Tokyo",
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });

    const confirmSubject = "【国土交通省 適正原価実態調査】お問い合わせを受け付けました";

    const confirmHtmlBody = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
</head>
<body style="font-family: sans-serif; line-height: 1.6; color: #333;">
  <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
    <div style="border-bottom: 2px solid #2563eb; padding-bottom: 20px; margin-bottom: 20px;">
      <h1 style="color: #1e293b; font-size: 24px; margin: 0;">お問い合わせ受付完了</h1>
      <p style="color: #64748b; margin: 5px 0 0;">国土交通省 適正原価実態調査</p>
    </div>

    <p style="margin: 20px 0;">
      お問い合わせいただきありがとうございます。<br>
      以下の内容で受け付けました。担当者より順次ご連絡いたします。
    </p>

    <div style="background: #f1f5f9; padding: 20px; border-radius: 8px; margin: 20px 0;">
      <h2 style="font-size: 16px; margin: 0 0 10px; color: #1e293b;">【送信日時】</h2>
      <p style="margin: 5px 0;">${sendTime}</p>
    </div>

    <div style="margin: 20px 0;">
      <h2 style="font-size: 16px; margin: 0 0 10px; color: #1e293b;">【質問内容】</h2>
      <div style="background: #fff; border: 1px solid #e2e8f0; padding: 15px; border-radius: 8px; white-space: pre-wrap;">${message}</div>
    </div>

    <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 30px 0;">

    <p style="color: #94a3b8; font-size: 12px;">
      このメールは適正原価実態調査システムから自動送信されています。<br>
      このメールに返信いただいても回答できませんのでご了承ください。
    </p>
  </div>
</body>
</html>
    `.trim();

    const confirmTextBody = `
【お問い合わせ受付完了】
国土交通省 適正原価実態調査

お問い合わせいただきありがとうございます。
以下の内容で受け付けました。担当者より順次ご連絡いたします。

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
【送信日時】
${sendTime}

【質問内容】
${message}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

このメールは適正原価実態調査システムから自動送信されています。
このメールに返信いただいても回答できませんのでご了承ください。
    `.trim();

    const confirmCommand = new SendEmailCommand({
      Source: fromEmail,
      Destination: {
        ToAddresses: [email],
      },
      Message: {
        Subject: {
          Data: confirmSubject,
          Charset: "UTF-8",
        },
        Body: {
          Text: {
            Data: confirmTextBody,
            Charset: "UTF-8",
          },
          Html: {
            Data: confirmHtmlBody,
            Charset: "UTF-8",
          },
        },
      },
    });

    console.log("2. 確認メール送信開始:", email);
    const confirmResult = await sendEmailWithRetry(confirmCommand);

    let confirmEmailSent = true;
    if (!confirmResult.success) {
      console.error("2. 確認メール送信失敗:", confirmResult.error);
      console.error("送信先アドレス:", email);
      console.error("エラー詳細:", JSON.stringify(confirmResult, null, 2));
      confirmEmailSent = false;
    } else {
      console.log("2. 確認メール送信成功:", confirmResult.messageId);
    }

    console.log("=== お問い合わせ処理完了 ===");
    console.log("管理者メール: 成功, 確認メール:", confirmEmailSent ? "成功" : "失敗");

    return NextResponse.json({
      message: "お問い合わせを送信しました",
      confirmEmailSent,
      ...(confirmEmailSent ? {} : { confirmEmailError: "確認メールの送信に失敗しましたが、お問い合わせは受け付けました" })
    });
  } catch (error) {
    console.error("お問い合わせ送信エラー:", error);
    return NextResponse.json(
      { error: "送信に失敗しました" },
      { status: 500 }
    );
  }
}
