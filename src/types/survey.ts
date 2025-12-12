export interface SurveyResponse {
  id?: string
  company_name: string
  industry: string
  employee_count: string
  revenue: string
  cost_categories: CostCategory[]
  challenges: string[]
  comments: string
  email: string
  created_at?: string
}

export interface CostCategory {
  category: string
  actual_cost: number
  estimated_cost: number
  difference_reason: string
}

export interface SearchFilters {
  industry?: string
  employee_count?: string
  date_from?: string
  date_to?: string
}
