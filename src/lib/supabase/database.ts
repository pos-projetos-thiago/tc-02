import { supabase } from '@/lib/supabase/client';

export interface SupabaseTransaction {
  id: string;
  user_id: string;
  type: 'deposit' | 'withdrawal' | 'transfer' | 'investment';
  subtype?: 'renda-fixa' | 'renda-variavel';
  investment_type?: 'fundos' | 'tesouro-direto' | 'previdencia' | 'bolsa';
  amount: number;
  description: string;
  date: string;
  created_at: string;
}

// Buscar saldo do usuário
export async function getUserBalance(userId: string): Promise<number> {
  try {
    const { data, error } = await supabase
      .from('user_balances')
      .select('balance')
      .eq('user_id', userId)
      .single();

    if (error && error.code === 'PGRST116') {
      // Usuário não existe, criar com saldo inicial
      return await createUserBalance(userId);
    }

    if (error) {
      console.error('Erro ao buscar saldo:', error);
      return 2000.00;
    }

    return data.balance || 2000.00;
  } catch (error) {
    console.error('Erro ao buscar saldo:', error);
    return 2000.00;
  }
}

// Criar saldo inicial do usuário
export async function createUserBalance(userId: string): Promise<number> {
  try {
    const { data, error } = await supabase
      .from('user_balances')
      .insert({
        user_id: userId,
        balance: 2000.00
      })
      .select('balance')
      .single();

    if (error) {
      console.error('Erro ao criar saldo:', error);
      return 2000.00;
    }

    return data.balance;
  } catch (error) {
    console.error('Erro ao criar saldo:', error);
    return 2000.00;
  }
}

// Atualizar saldo do usuário
export async function updateUserBalance(userId: string, newBalance: number): Promise<boolean> {
  try {
    // Primeiro, tenta atualizar registro existente
    const { data: updateData, error: updateError } = await supabase
      .from('user_balances')
      .update({
        balance: newBalance,
        updated_at: new Date().toISOString()
      })
      .eq('user_id', userId)
      .select();

    // Se não encontrou registro para atualizar, cria um novo
    if (updateError || !updateData || updateData.length === 0) {
      const { error: insertError } = await supabase
        .from('user_balances')
        .insert({
          user_id: userId,
          balance: newBalance,
          updated_at: new Date().toISOString()
        });

      if (insertError) {
        console.error('Erro ao inserir saldo:', insertError);
        return false;
      }
    }

    return true;
  } catch (error) {
    console.error('Erro ao atualizar saldo:', error);
    return false;
  }
}

// Buscar transações do usuário
export async function getUserTransactions(userId: string): Promise<SupabaseTransaction[]> {
  try {
    const { data, error } = await supabase
      .from('transactions')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Erro ao buscar transações:', error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error('Erro ao buscar transações:', error);
    return [];
  }
}

// Adicionar transação
export async function addTransaction(
  userId: string,
  transaction: Omit<SupabaseTransaction, 'id' | 'user_id' | 'created_at'>
): Promise<SupabaseTransaction | null> {
  try {
    const { data, error } = await supabase
      .from('transactions')
      .insert({
        user_id: userId,
        ...transaction
      })
      .select('*')
      .single();

    if (error) {
      console.error('Erro ao adicionar transação:', error);
      return null;
    }

    return data;
  } catch (error) {
    console.error('Erro ao adicionar transação:', error);
    return null;
  }
}

// Atualizar transação
export async function updateTransaction(
  transactionId: string,
  updates: Partial<Omit<SupabaseTransaction, 'id' | 'user_id' | 'created_at'>>
): Promise<SupabaseTransaction | null> {
  try {
    const { data, error } = await supabase
      .from('transactions')
      .update(updates)
      .eq('id', transactionId)
      .select('*')
      .single();

    if (error) {
      console.error('Erro ao atualizar transação:', error);
      return null;
    }

    return data;
  } catch (error) {
    console.error('Erro ao atualizar transação:', error);
    return null;
  }
}

// Deletar transação
export async function deleteTransaction(transactionId: string): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('transactions')
      .delete()
      .eq('id', transactionId);

    if (error) {
      console.error('Erro ao deletar transação:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Erro ao deletar transação:', error);
    return false;
  }
}