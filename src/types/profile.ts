// 事業種別
export type BusinessType =
  | 'general'       // 一般貨物
  | 'specific'      // 特定貨物
  | 'consolidated'  // 特積貨物
  | 'freight_type1' // 第一種利用運送
  | 'freight_type2' // 第二種利用運送

export const BUSINESS_TYPE_LABELS: Record<BusinessType, string> = {
  general: '一般貨物',
  specific: '特定貨物',
  consolidated: '特積貨物',
  freight_type1: '第一種利用運送',
  freight_type2: '第二種利用運送',
}

export const BUSINESS_TYPES: { value: BusinessType; label: string }[] = [
  { value: 'general', label: '一般貨物' },
  { value: 'specific', label: '特定貨物' },
  { value: 'consolidated', label: '特積貨物' },
  { value: 'freight_type1', label: '第一種利用運送' },
  { value: 'freight_type2', label: '第二種利用運送' },
]

export interface Profile {
  id: string
  email: string
  // 事業者情報
  business_name: string
  postal_code?: string
  address: string
  business_number?: string
  office_count?: number
  permit_year?: number
  business_types?: BusinessType[]
  // 記入者情報
  contact_name: string
  phone: string
  // 互換性
  display_name?: string
  avatar_url?: string
  provider?: string
  created_at: string
  updated_at: string
}

export interface RegisterFormData {
  // 事業者情報
  business_name: string
  postal_code: string
  address: string
  business_number: string
  office_count: string
  permit_year: string
  business_types: BusinessType[]
  // 記入者情報
  contact_name: string
  phone: string
  // 認証
  email: string
  password: string
  password_confirm: string
}

export interface SurveyDraft {
  id: string
  user_id: string
  survey_year: number
  form_data: Record<string, unknown>
  current_step: number
  is_submitted: boolean
  submitted_at?: string
  created_at: string
  updated_at: string
}
