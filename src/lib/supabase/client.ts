import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

// Verificação de segurança para ambiente de build sem credenciais
if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('Supabase credentials not found. Using mock client for build.')
  
  // Cliente mock para builds sem credenciais
  export const supabase = {
    auth: {
      signUp: () => Promise.resolve({ data: null, error: new Error('Mock client') }),
      signInWithPassword: () => Promise.resolve({ data: null, error: new Error('Mock client') }),
      signOut: () => Promise.resolve({ error: null }),
      getUser: () => Promise.resolve({ data: { user: null }, error: null }),
      onAuthStateChange: () => ({ data: { subscription: null } })
    }
  } as any
} else {
  export const supabase = createClient(supabaseUrl, supabaseAnonKey)
}