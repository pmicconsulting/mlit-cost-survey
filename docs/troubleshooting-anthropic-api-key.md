# ANTHROPIC_API_KEY 環境変数問題のトラブルシューティング

**日付**: 2024年12月14日

## 問題の概要

AI相談員機能（Claude API）が動作せず、以下のエラーが発生していた：

```json
{
  "error": "回答の生成に失敗しました"
}
```

サーバーログには以下のように表示：
```
API Key prefix: your-api-key-he
API Key length: 17
```

## 調査の経緯

### 1. 初期調査

- `.env.local`ファイルには正しいAPIキー（`sk-ant-api03-...`）が設定されていることを確認
- `.env.local.example`にはプレースホルダー`your-api-key-here`が存在
- 開発サーバーの再起動、`.next`キャッシュの削除を試みるも改善せず

### 2. 原因の特定（第1段階）

`printenv`コマンドで環境変数を確認したところ、問題を発見：

```bash
$ printenv | grep -i ANTHROPIC
ANTHROPIC_API_KEY=your-api-key-here
```

当初、Windowsのシステム環境変数が原因と考えたが、ユーザーは「登録していない」と回答。

### 3. 真の根本原因の特定（第2段階）

さらに調査したところ、**Git Bashの設定ファイル**に原因があった：

```bash
$ grep -r "ANTHROPIC" ~/.bashrc
/c/Users/pmic/.bashrc:export ANTHROPIC_API_KEY="your-api-key-here"
```

**真の根本原因**: 以前のClaude Codeセッションが誤って`~/.bashrc`にプレースホルダーを追加していた。

bash履歴にも記録が残っていた：
```bash
echo 'export ANTHROPIC_API_KEY="your-api-key-here"' >> ~/.bashrc
```

この設定がGit Bash起動時に毎回読み込まれ、`.env.local`の正しいAPIキーを上書きしていた。

## 解決策

### 一時的な回避策

環境変数を上書きしてサーバーを起動：

```bash
export ANTHROPIC_API_KEY="sk-ant-api03-xxxxx" && npm run dev
```

### 恒久的な対策（実施済み）

`~/.bashrc`（`C:\Users\pmic\.bashrc`）からプレースホルダーを削除：

**修正前：**
```bash
export ANTHROPIC_API_KEY="your-api-key-here"
```

**修正後：**
```bash
# Bash configuration
# (ANTHROPIC_API_KEY is managed in project's .env.local)
```

修正後は**ターミナルを再起動**する必要がある（既存のターミナルは古い環境変数を保持しているため）。

## 動作確認

修正後、APIが正常に動作することを確認：

```bash
curl -s -X POST http://localhost:3000/api/ai-consultant \
  -H "Content-Type: application/json" \
  -d '{"messages":[{"role":"user","content":"調査の目的は？"}]}'
```

レスポンス例：
```json
{
  "message": "本調査の目的は、一般貨物自動車運送事業における適正な運送原価を明らかにすることです...",
  "debug": {
    "relevantQACount": 0,
    "categories": []
  }
}
```

## 教訓

1. **環境変数の読み込み順序**: Git Bashでは`~/.bashrc`が起動時に読み込まれ、その後のプロセスに影響する
2. **Next.jsの`.env.local`の優先度**: シェルの環境変数より優先度が低い
3. **プレースホルダーの危険性**: 自動化ツールがプレースホルダーを設定ファイルに追加することがある
4. **デバッグの重要性**: APIキーのプレフィックスをログ出力することで問題を特定できた
5. **調査の徹底**: Windowsシステム環境変数になくても、シェル設定ファイル（.bashrc等）を確認すること

## 関連ファイル

| ファイル | 役割 |
|----------|------|
| `src/app/api/ai-consultant/route.ts` | AI相談員APIエンドポイント |
| `.env.local` | ローカル環境変数（正しいAPIキーを設定） |
| `.env.local.example` | 環境変数テンプレート |
| `~/.bashrc` | Git Bash設定ファイル（問題の原因だった） |

## Claude Codeが落ちる問題について

セッション中にClaude Codeが途中で落ちることがあった。考えられる原因：

- 長時間のバックグラウンドタスク（`npm run dev`など）の監視中にタイムアウト
- 大量の出力を処理中のメモリ問題
- ネットワーク接続の不安定さ

**対策**: 開発サーバーは別のターミナルで起動し、Claude Codeではタスクを完了してから終了するようにすると安定する。

## 環境変数のデバッグ方法（今後の参考）

```bash
# シェルの環境変数を確認
echo $ANTHROPIC_API_KEY
printenv | grep -i ANTHROPIC

# どこで設定されているか検索
grep -r "ANTHROPIC" ~/.bashrc ~/.bash_profile ~/.profile ~/ 2>/dev/null

# Next.jsが読み込む値を確認（APIルートにデバッグログを追加）
console.log("API Key prefix:", apiKey.substring(0, 15));
console.log("API Key length:", apiKey.length);
```
