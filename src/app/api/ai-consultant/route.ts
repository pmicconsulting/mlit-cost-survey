import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import qaData from "@/data/qa-sample.json";

function getAnthropicClient() {
  const apiKey = process.env.ANTHROPIC_API_KEY?.trim();
  if (!apiKey) {
    throw new Error("ANTHROPIC_API_KEY is not set");
  }
  // デバッグ: キーの最初と最後の数文字を表示
  console.log("API Key prefix:", apiKey.substring(0, 15));
  console.log("API Key length:", apiKey.length);
  return new Anthropic({ apiKey });
}

// 簡易的なキーワードマッチングで関連Q&Aを検索
function findRelevantQA(userQuestion: string, topK: number = 5) {
  const keywords = userQuestion.toLowerCase().split(/[\s、。？！]+/).filter(k => k.length > 1);

  const scored = qaData.qa_items.map(item => {
    const text = `${item.question} ${item.answer} ${item.category}`.toLowerCase();
    let score = 0;

    for (const keyword of keywords) {
      if (text.includes(keyword)) {
        score += 1;
      }
    }

    return { ...item, score };
  });

  return scored
    .filter(item => item.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, topK);
}

function buildSystemPrompt(relevantQA: typeof qaData.qa_items) {
  const qaContext = relevantQA.length > 0
    ? `\n\n【参考Q&A】\n${relevantQA.map(qa =>
        `Q: ${qa.question}\nA: ${qa.answer}`
      ).join('\n\n')}`
    : '';

  return `あなたは国土交通省の「一般貨物自動車運送事業 適正原価に関する実態調査」についての相談員AIです。

以下の情報を基に、丁寧かつ分かりやすく回答してください。

【調査の基本情報】
- 調査名: 一般貨物自動車運送事業 適正原価に関する実態調査
- 調査年度: 令和6年度
- 回答期限: 令和7年1月31日
- 対象: 一般貨物自動車運送事業者

【対象車両タイプ（12種類）】
バンタイプ等の車両、冷蔵車・冷凍車、ダンプ車、タンク車、バルク車、コンテナ輸送車、コンクリートミキサー車、トラック搭載型クレーン車、霊柩車、一般廃棄物輸送車、車積載車（キャリアカー）、重量物輸送車
${qaContext}

【回答時の注意】
- 丁寧な敬語を使用してください
- 参考Q&Aがある場合は、その内容を基に回答してください
- 不明な点は「詳細についてはお問い合わせフォームをご利用ください」と案内してください
- 調査と関係ない質問には「この相談窓口は適正原価実態調査に関するご質問専用です」と伝えてください`;
}

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

    // 最新のユーザーメッセージから関連Q&Aを検索
    const lastUserMessage = messages.filter((m: { role: string }) => m.role === "user").pop();
    const relevantQA = lastUserMessage ? findRelevantQA(lastUserMessage.content) : [];

    const systemPrompt = buildSystemPrompt(relevantQA);

    const anthropicMessages = messages.map((msg: { role: string; content: string }) => ({
      role: msg.role as "user" | "assistant",
      content: msg.content,
    }));

    const response = await anthropic.messages.create({
      model: "claude-3-5-haiku-20241022",
      max_tokens: 1024,
      system: systemPrompt,
      messages: anthropicMessages,
    });

    const assistantMessage = response.content[0].type === "text"
      ? response.content[0].text
      : "申し訳ございません。回答を生成できませんでした。";

    return NextResponse.json({
      message: assistantMessage,
      // デバッグ用: 検索されたQ&A数
      debug: {
        relevantQACount: relevantQA.length,
        categories: [...new Set(relevantQA.map(q => q.category))]
      }
    });
  } catch (error) {
    console.error("AI相談員エラー:", error);
    return NextResponse.json(
      { error: "回答の生成に失敗しました" },
      { status: 500 }
    );
  }
}
