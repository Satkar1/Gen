import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Session storage functions
export const getSessionId = () => {
  if (typeof window !== 'undefined') {
    let sessionId = sessionStorage.getItem('aura_session_id')
    if (!sessionId) {
      sessionId = Date.now().toString(36) + Math.random().toString(36).substring(2)
      sessionStorage.setItem('aura_session_id', sessionId)
    }
    return sessionId
  }
  return null
}