'use client'

import { supabase } from '@/lib/supabase/client'

export interface AuthResult {
  success: boolean
  error?: string
}

export async function signUpUser(name: string, email: string, password: string): Promise<AuthResult> {
  try {
    // Validação básica
    if (!name || !email || !password) {
      return { success: false, error: 'Nome, email e senha são obrigatórios' }
    }

    if (password.length < 6) {
      return { success: false, error: 'Senha deve ter pelo menos 6 caracteres' }
    }

    // Criar conta (tentativa de auto-confirmação)
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
      // Verificar se precisa confirmar email
      if (data.user && !data.session) {
        return { 
          success: false, 
          error: 'Conta criada! Verifique seu email para confirmar a conta.' 
        }
      }
      
      return { success: true }
    }

    return { success: false, error: 'Erro desconhecido ao criar conta' }
  } catch (error) {
    return { success: false, error: 'Erro interno do servidor' }
  }
}

export async function signInUser(email: string, password: string): Promise<AuthResult> {
  try {
    // Validação básica
    if (!email || !password) {
      return { success: false, error: 'Email e senha são obrigatórios' }
    }

    // Fazer login
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
  } catch (error) {
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
  } catch (error) {
    return { success: false, error: 'Erro interno do servidor' }
  }
}