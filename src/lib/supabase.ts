import { createClient } from '@supabase/supabase-js'

// Fallback configuration if environment variables are not injected during Vercel build
const DEFAULT_SUPABASE_URL = 'https://rpcshubvumzlaxqyscln.supabase.co'
const DEFAULT_SUPABASE_ANON_KEY = 'sb_publishable_CQTkXCxhOMycWBUjR_-Ifg_8J56PtlD'

const rawUrl = import.meta.env.VITE_SUPABASE_URL || DEFAULT_SUPABASE_URL
export const supabaseUrl = rawUrl.replace(/\/rest\/v1\/?$/, '')
export const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || DEFAULT_SUPABASE_ANON_KEY

export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey)

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
