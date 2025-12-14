/**
 * 郵便番号から住所を検索
 * zipcloud API（無料・登録不要）を使用
 */
export async function searchAddressByPostalCode(postalCode: string): Promise<string | null> {
  try {
    // ハイフンを除去
    const cleanCode = postalCode.replace(/-/g, '')

    // 7桁でない場合はnull
    if (cleanCode.length !== 7) {
      return null
    }

    const res = await fetch(`https://zipcloud.ibsnet.co.jp/api/search?zipcode=${cleanCode}`)
    const data = await res.json()

    if (data.results && data.results.length > 0) {
      const result = data.results[0]
      return `${result.address1}${result.address2}${result.address3}`
    }

    return null
  } catch (error) {
    console.error('住所検索エラー:', error)
    return null
  }
}
