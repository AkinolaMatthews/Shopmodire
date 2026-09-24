// The dependency is provided by the application's package setup; keep the
// import type-checkable when the editor has not yet refreshed node_modules.
// @ts-expect-error Module resolution may be unavailable until dependencies are installed.
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  // Surfaced clearly in the console instead of a cryptic runtime error.
  console.error(
    'Missing Supabase env vars. Create a .env file from .env.example with your project URL and anon key.'
  )
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
