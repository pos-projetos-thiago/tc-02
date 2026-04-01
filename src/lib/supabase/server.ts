import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { ReadonlyRequestCookies } from 'next/dist/server/web/spec-extension/adapters/request-cookies'

export async function createClient() {
  const cookieStore = await cookies() as ReadonlyRequestCookies

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          const cookie = cookieStore.get(name)
          return cookie?.value
        },
        set(name: string, value: string, options: Record<string, unknown>) {
          try {
            (cookieStore as { set: (name: string, value: string, options?: Record<string, unknown>) => void }).set(name, value, options)
          } catch {
            // Server Component - cookies will be set in middleware
          }
        },
        remove(name: string, options: Record<string, unknown>) {
          try {
            (cookieStore as { set: (name: string, value: string, options?: Record<string, unknown>) => void }).set(name, '', { ...options, maxAge: 0 })
          } catch {
            // Server Component - cookies will be removed in middleware
          }
        },
      },
    }
  )
}