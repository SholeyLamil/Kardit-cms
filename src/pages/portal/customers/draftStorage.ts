export type SavedDraft = {
  ref: string
  customerType: 'individual' | 'corporate'
  title: string | null
  firstName: string
  middleName: string | null
  lastName: string
  dob: string
  gender: 'M' | 'F'
  nationality: string
  phone: string
  phoneAlt: string | null
  email: string | null
  street: string
  lga: string
  state: string
  postcode: string | null
  country: string
  bvn: string
  nin: string | null
  idType: string | null
  idNumber: string | null
  capturedBy: string
  createdAt: string
}

const KEY = 'kardit_customer_draft_v1'

export function saveDraft(d: SavedDraft) {
  sessionStorage.setItem(KEY, JSON.stringify(d))
}
export function readDraft(): SavedDraft | null {
  try {
    const raw = sessionStorage.getItem(KEY)
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}
export function clearDraft() {
  sessionStorage.removeItem(KEY)
}
export function genDraftRef() {
  return 'CUST-2026-' + String(346 + Math.floor(Math.random() * 50)).padStart(5, '0')
}
