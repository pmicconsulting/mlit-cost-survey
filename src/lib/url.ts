/**
 * サイトのベースURLを取得
 * 優先順位:
 * 1. NEXT_PUBLIC_SITE_URL（環境変数で明示的に設定）
 * 2. VERCEL_URL（Vercelが自動設定）
 * 3. window.location.origin（クライアント側フォールバック）
 * 4. localhost:3000（開発環境デフォルト）
 */
export function getBaseUrl(): string {
  // 環境変数で明示的に設定されている場合
  if (process.env.NEXT_PUBLIC_SITE_URL) {
    return process.env.NEXT_PUBLIC_SITE_URL
  }

  // Vercelデプロイ時は自動的にVERCEL_URLが設定される
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`
  }

  // クライアント側の場合
  if (typeof window !== 'undefined') {
    return window.location.origin
  }

  // 開発環境のデフォルト
  return 'http://localhost:3000'
}

/**
 * 認証コールバックURLを取得
 */
export function getAuthCallbackUrl(): string {
  return `${getBaseUrl()}/auth/callback`
}
