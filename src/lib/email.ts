import { SESClient, SendEmailCommand } from "@aws-sdk/client-ses";

const sesClient = new SESClient({
  region: process.env.AWS_REGION || "ap-northeast-1",
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || "",
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || "",
  },
});

interface SendRegistrationEmailParams {
  to: string;
  businessName: string;
  contactName: string;
}

export async function sendRegistrationEmail({
  to,
  businessName,
  contactName,
}: SendRegistrationEmailParams): Promise<boolean> {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://mlitcostsurvey.vercel.app";
  const fromEmail = process.env.AWS_SES_FROM_EMAIL || "noreply@example.com";

  const subject = "【国土交通省】適正原価実態調査 アカウント登録完了";

  const htmlBody = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
</head>
<body style="font-family: sans-serif; line-height: 1.6; color: #333;">
  <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
    <div style="border-bottom: 2px solid #2563eb; padding-bottom: 20px; margin-bottom: 20px;">
      <h1 style="color: #1e293b; font-size: 24px; margin: 0;">国土交通省</h1>
      <p style="color: #64748b; margin: 5px 0 0;">貨物自動車運送事業 適正原価に関する実態調査</p>
    </div>

    <p><strong>${businessName}</strong><br>${contactName} 様</p>

    <p>アカウント登録が完了しました。</p>

    <div style="background: #f1f5f9; padding: 20px; border-radius: 8px; margin: 20px 0;">
      <h2 style="font-size: 16px; margin: 0 0 10px; color: #1e293b;">【ログイン情報】</h2>
      <p style="margin: 5px 0;">メールアドレス: ${to}</p>
      <p style="margin: 5px 0;">パスワード: ご登録時に設定したパスワード</p>
    </div>

    <div style="margin: 20px 0;">
      <a href="${siteUrl}/auth/login" style="display: inline-block; background: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; font-weight: bold;">ログインする</a>
    </div>

    <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 30px 0;">

    <h3 style="font-size: 14px; color: #1e293b;">【調査について】</h3>
    <ul style="padding-left: 20px; color: #64748b;">
      <li>回答期限: 令和7年1月31日</li>
      <li><a href="${siteUrl}/qa" style="color: #2563eb;">よくある質問</a></li>
      <li><a href="${siteUrl}/download" style="color: #2563eb;">資料ダウンロード</a></li>
    </ul>

    <p style="color: #94a3b8; font-size: 12px; margin-top: 30px;">
      ※本メールに心当たりのない場合は破棄してください。
    </p>
  </div>
</body>
</html>
  `.trim();

  const textBody = `
${businessName}
${contactName} 様

アカウント登録が完了しました。

【ログイン情報】
メールアドレス: ${to}
パスワード: ご登録時に設定したパスワード

【ログインURL】
${siteUrl}/auth/login

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
【調査について】
- 回答期限: 令和7年1月31日
- 調査についてのご質問: ${siteUrl}/qa
- 資料ダウンロード: ${siteUrl}/download

※本メールに心当たりのない場合は破棄してください。
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  `.trim();

  try {
    const command = new SendEmailCommand({
      Source: fromEmail,
      Destination: {
        ToAddresses: [to],
      },
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
    return true;
  } catch (error) {
    console.error("メール送信エラー:", error);
    return false;
  }
}
