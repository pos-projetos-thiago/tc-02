'use client'

import { supabase } from '@/lib/supabase/client'

export interface AuthResult {
  success: boolean
  error?: string
}

export async function signUpUser(name: string, email: string, password: string): Promise<AuthResult> {
  try {
  if (!name || !email || !password) {
      return { success: false, error: 'Nome, email e senha são obrigatórios' }
    }

    if (password.length < 6) {
      return { success: false, error: 'Senha deve ter pelo menos 6 caracteres' }
    }

    const { data, error } = await supabase.auth.signUp({
      email: email.trim(),
      password: password,
      options: {
        data: {
          display_name: name.trim(),
        },
        emailRedirectTo: undefined, // Desabilita redirect
      },
    })

    if (error) {
      return { success: false, error: error.message }
    }

    if (data?.user) {
      if (data.user && !data.session) {
        return { 
          success: false, 
          error: 'Conta criada! Verifique seu email para confirmar a conta.' 
        }
      }
      
      return { success: true }
    }

    return { success: false, error: 'Erro desconhecido ao criar conta' }
  } catch {
    return { success: false, error: 'Erro interno do servidor' }
  }
}

export async function signInUser(email: string, password: string): Promise<AuthResult> {
  try {
  if (!email || !password) {
      return { success: false, error: 'Email e senha são obrigatórios' }
    }

  const { data, error } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password: password,
    })

    if (error) {
      if (error.message.includes('Email not confirmed')) {
        return { success: false, error: 'Email não confirmado. Verifique sua caixa de entrada.' }
      }
      
      return { success: false, error: 'E-mail ou senha incorretos' }
    }

    if (data?.user) {
      return { success: true }
    }

    return { success: false, error: 'Erro desconhecido ao fazer login' }
  } catch {
    return { success: false, error: 'Erro interno do servidor' }
  }
}

export async function signOutUser(): Promise<AuthResult> {
  try {
    const { error } = await supabase.auth.signOut()
    
    if (error) {
      return { success: false, error: error.message }
    }

    return { success: true }
  } catch {
    return { success: false, error: 'Erro interno do servidor' }
  }
}

export async function resetPassword(email: string): Promise<AuthResult> {
  try {
  if (!email) {
      return { success: false, error: 'Email é obrigatório' }
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email.trim())) {
      return { success: false, error: 'Email inválido' }
    }

    // Enviar email de reset
    const { error } = await supabase.auth.resetPasswordForEmail(email.trim(), {
      redirectTo: `${window.location.origin}/reset-password`
    })

    if (error) {
      return { success: false, error: error.message }
    }

    return { success: true }
  } catch {
    return { success: false, error: 'Erro interno do servidor' }
  }
}