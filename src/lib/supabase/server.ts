import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { ReadonlyRequestCookies } from 'next/dist/server/web/spec-extension/adapters/request-cookies'

export function createClient() {
  const cookieStore = cookies() as ReadonlyRequestCookies

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          const cookie = cookieStore.get(name)
          return cookie?.value
        },
        set(name: string, value: string, options: any) {
          try {
            (cookieStore as any).set(name, value, options)
          } catch {
            // Server Component - cookies will be set in middleware
          }
        },
        remove(name: string, options: any) {
          try {
            (cookieStore as any).set(name, '', { ...options, maxAge: 0 })
          } catch {
            // Server Component - cookies will be removed in middleware
          }
        },
      },
    }
  )
}