import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";

function getAnthropicClient() {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    throw new Error("ANTHROPIC_API_KEY is not set");
  }
  return new Anthropic({ apiKey });
}

const SYSTEM_PROMPT = `あなたは国土交通省の「一般貨物自動車運送事業 適正原価に関する実態調査」についての相談員AIです。

この調査について以下の情報を基に、丁寧かつ分かりやすく回答してください：

【調査の概要】
- 調査名: 一般貨物自動車運送事業 適正原価に関する実態調査
- 目的: 貨物自動車運送事業における適正な原価の実態を把握し、持続可能な運送事業の発展に寄与すること
- 対象: 一般貨物自動車運送事業者
- 調査年度: 令和6年度
- 回答期限: 令和7年1月31日

【対象車両タイプ（12種類）】
1. バンタイプ等の車両
2. 冷蔵車・冷凍車
3. ダンプ車
4. タンク車
5. バルク車
6. コンテナ輸送車
7. コンクリートミキサー車
8. トラック搭載型クレーン車
9. 霊柩車
10. 一般廃棄物輸送車（塵芥車、衛生車等）
11. 車積載車（キャリアカー）
12. 重量物輸送車

【回答方法】
1. サイトでサインアップ（事業者情報・ログイン情報を登録）
2. ダッシュボードから調査に回答
3. 調査票はエクセルファイルでもダウンロード可能（記載要領付き）

【サポート】
- よくある質問（Q&A）ページあり
- お問い合わせフォームあり
- 動画解説あり

回答時の注意:
- 丁寧な敬語を使用してください
- 具体的で分かりやすい説明を心がけてください
- 不明な点は正直に「詳細についてはお問い合わせフォームをご利用ください」と案内してください
- 調査と関係ない質問には「この相談窓口は適正原価実態調査に関するご質問専用です」と伝えてください`;

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { messages } = body;

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json(
        { error: "メッセージが必要です" },
        { status: 400 }
      );
    }

    let anthropic: Anthropic;
    try {
      anthropic = getAnthropicClient();
    } catch {
      console.error("ANTHROPIC_API_KEY is not set");
      return NextResponse.json(
        { error: "サーバー設定エラー" },
        { status: 500 }
      );
    }

    const anthropicMessages = messages.map((msg: { role: string; content: string }) => ({
      role: msg.role as "user" | "assistant",
      content: msg.content,
    }));

    const response = await anthropic.messages.create({
      model: "claude-sonnet-4-20250514",
      max_tokens: 1024,
      system: SYSTEM_PROMPT,
      messages: anthropicMessages,
    });

    const assistantMessage = response.content[0].type === "text"
      ? response.content[0].text
      : "申し訳ございません。回答を生成できませんでした。";

    return NextResponse.json({ message: assistantMessage });
  } catch (error) {
    console.error("AI相談員エラー:", error);
    return NextResponse.json(
      { error: "回答の生成に失敗しました" },
      { status: 500 }
    );
  }
}
