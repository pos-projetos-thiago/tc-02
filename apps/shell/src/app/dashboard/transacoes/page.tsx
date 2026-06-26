'use client'

import React, { useEffect, useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/hooks/useJWTAuth'
import { useDashboard } from '@/contexts/DashboardContextJWT'
import { UserProfileJWT } from '@/components/molecules/UserProfile/UserProfileJWT'
import { Button } from '@/components/atoms/Button/Button'
import { LoadingScreen } from '@/components/atoms/Loading'
import type { Transaction } from '@/contexts/DashboardContextJWT'
import styles from './transacoes.module.scss'

const ITEMS_PER_PAGE = 10

function getTransactionTypeText(transaction: Transaction): string {
  switch (transaction.type) {
    case 'deposit':    return 'Depósito'
    case 'withdrawal': return 'Saque'
    case 'transfer':   return 'Transferência'
    case 'investment':
      if (transaction.investmentType === 'fundos')        return 'Fundos de Investimento'
      if (transaction.investmentType === 'tesouro-direto') return 'Tesouro Direto'
      if (transaction.investmentType === 'previdencia')   return 'Previdência Privada'
      if (transaction.investmentType === 'bolsa')         return 'Bolsa de Valores'
      return 'Investimento'
    default: return 'Transação'
  }
}

export default function TransacoesPage() {
  const { user, isLoading } = useAuth()
  const { transactions, deleteTransaction, editTransaction } = useDashboard()
  const router = useRouter()

  const userName = user?.username || user?.email?.split('@')[0] || 'Usuário'

  // Filtros simples
  const [search, setSearch] = useState('')
  const [typeFilter, setTypeFilter] = useState('')
  const [currentPage, setCurrentPage] = useState(1)

  // Edição
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null)
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [formData, setFormData] = useState({ type: '', amount: '' })

  // Filtrar transações
  const filtered = transactions.filter((t) => {
    const matchesSearch =
      !search ||
      getTransactionTypeText(t).toLowerCase().includes(search.toLowerCase()) ||
      new Date(t.date).toLocaleDateString('pt-BR').includes(search)
    const matchesType = !typeFilter || t.type === typeFilter
    return matchesSearch && matchesType
  })

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE)
  const paginated = filtered.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  )

  // Resetar página ao filtrar
  useEffect(() => { setCurrentPage(1) }, [search, typeFilter])

  const formatCurrency = useCallback((value: string) => {
    const numbers = value.replace(/\D/g, '')
    if (numbers === '') return ''
    const numericValue = parseInt(numbers) / 100
    return numericValue.toLocaleString('pt-BR', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })
  }, [])

  const handleEdit = useCallback((transaction: Transaction) => {
    setEditingTransaction(transaction)
    let editType: string = transaction.type
    if (transaction.type === 'investment' && transaction.investmentType) {
      editType = `investment-${transaction.investmentType}`
    }
    setFormData({
      type: editType,
      amount: transaction.amount.toLocaleString('pt-BR', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }),
    })
  }, [])

  const handleDelete = useCallback(
    async (id: string) => {
      if (!confirm('Tem certeza que deseja deletar esta transação?')) return
      try {
        setDeletingId(id)
        await deleteTransaction(id)
      } catch {
        alert('Erro ao deletar transação. Tente novamente.')
      } finally {
        setDeletingId(null)
      }
    },
    [deleteTransaction]
  )

  const handleCancelEdit = useCallback(() => {
    setEditingTransaction(null)
    setFormData({ type: '', amount: '' })
  }, [])

  const handleSaveEdit = useCallback(async () => {
    if (!editingTransaction || !formData.amount.trim() || !formData.type) {
      alert('Por favor, preencha todos os campos.')
      return
    }
    const cleanValue = formData.amount.replace(/\./g, '').replace(',', '.')
    const amount = parseFloat(cleanValue)
    if (isNaN(amount) || amount <= 0) {
      alert('Por favor, insira um valor válido maior que zero.')
      return
    }

    const updates: Partial<Transaction> = { amount }

    if (formData.type.startsWith('investment-')) {
      updates.type = 'investment'
      const investMap: Record<string, { investmentType?: Transaction['investmentType']; subtype?: Transaction['subtype'] }> = {
        'investment-fundos':        { investmentType: 'fundos',        subtype: 'renda-variavel' },
        'investment-tesouro-direto':{ investmentType: 'tesouro-direto',subtype: 'renda-fixa' },
        'investment-previdencia':   { investmentType: 'previdencia',   subtype: 'renda-fixa' },
        'investment-bolsa':         { investmentType: 'bolsa',         subtype: 'renda-variavel' },
      }
      const mapping = investMap[formData.type]
      if (mapping) {
        updates.investmentType = mapping.investmentType
        updates.subtype = mapping.subtype
      }
    } else {
      updates.type = formData.type as Transaction['type']
      updates.subtype = undefined
      updates.investmentType = undefined
    }

    try {
      await editTransaction(editingTransaction.id, updates)
      handleCancelEdit()
    } catch {
      alert('Erro ao editar transação. Tente novamente.')
    }
  }, [editingTransaction, formData, editTransaction, handleCancelEdit])

  useEffect(() => {
    if (!isLoading && !user) router.replace('/')
  }, [user, isLoading, router])

  if (isLoading) {
    return <LoadingScreen isVisible size="large" text="Carregando extrato..." />
  }
  if (!user) return null

  return (
    <>
      <UserProfileJWT userName={userName} />
      <main className={styles.main}>
        <div className={styles['dashboard-container']}>

          {/* Cabeçalho */}
          <div className={styles['page-header']}>
            <div className={styles['header-content']}>
              <h1 className={styles['page-title']}>Extrato</h1>
              <p className={styles.subtitle}>Gerencie suas movimentações financeiras</p>
            </div>
            <div className={styles['header-actions']}>
              <Button variant="secondary" onClick={() => router.push('/dashboard')}>
                Voltar ao Dashboard
              </Button>
            </div>
          </div>

          {/* Filtros */}
          <div className={styles['filter-bar']}>
            <input
              type="text"
              placeholder="Buscar transações..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className={styles['search-input']}
            />
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className={styles['type-select']}
            >
              <option value="">Todos os tipos</option>
              <option value="deposit">Depósito</option>
              <option value="withdrawal">Saque</option>
              <option value="transfer">Transferência</option>
              <option value="investment">Investimento</option>
            </select>
            {(search || typeFilter) && (
              <Button
                variant="secondary"
                size="small"
                onClick={() => { setSearch(''); setTypeFilter('') }}
              >
                Limpar
              </Button>
            )}
          </div>

          {/* Lista */}
          <div className={styles['transactions-card']}>
            <div className={styles['card-header']}>
              <h2 className={styles['card-title']}>Histórico de Transações</h2>
              <span className={styles.counter}>
                {filtered.length} de {transactions.length}{' '}
                {filtered.length === 1 ? 'transação' : 'transações'}
              </span>
            </div>

            <div className={styles['card-content']}>
              {paginated.length === 0 ? (
                <div className={styles['empty-state']}>
                  <h3 className={styles['empty-title']}>
                    {transactions.length === 0
                      ? 'Nenhuma transação encontrada'
                      : 'Nenhuma transação corresponde aos filtros'}
                  </h3>
                  <p className={styles['empty-description']}>
                    {transactions.length === 0
                      ? 'Suas transações aparecerão aqui após você fazer movimentações'
                      : 'Tente ajustar os filtros para encontrar as transações desejadas'}
                  </p>
                </div>
              ) : (
                <div className={styles['transaction-list']}>
                  {paginated.map((transaction) => (
                    <div key={transaction.id} className={styles['transaction-row']}>
                      <div className={styles['transaction-info']}>
                        <div className={styles['transaction-month']}>
                          {new Date(transaction.date).toLocaleDateString('pt-BR', { month: 'long' })}
                        </div>
                        <div className={styles['transaction-main']}>
                          <div className={styles['transaction-details']}>
                            <div className={styles['transaction-type']}>
                              {getTransactionTypeText(transaction)}
                            </div>
                            <div className={styles['transaction-date']}>
                              {new Date(transaction.date).toLocaleDateString('pt-BR')}
                            </div>
                          </div>
                          <div className={styles['transaction-amount']}>
                            R$ {transaction.amount.toFixed(2).replace('.', ',')}
                          </div>
                        </div>
                      </div>
                      <div className={styles['transaction-actions']}>
                        <Button variant="primary" size="small" onClick={() => handleEdit(transaction)}>
                          Editar
                        </Button>
                        <Button
                          variant="danger"
                          size="small"
                          onClick={() => handleDelete(transaction.id)}
                          disabled={deletingId === transaction.id}
                        >
                          {deletingId === transaction.id ? 'Deletando...' : 'Deletar'}
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Paginação */}
            {totalPages > 1 && (
              <div className={styles.pagination}>
                <Button
                  variant="secondary"
                  size="small"
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage <= 1}
                >
                  Anterior
                </Button>
                <span className={styles['pagination-info']}>
                  {currentPage} / {totalPages}
                </span>
                <Button
                  variant="secondary"
                  size="small"
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                  disabled={currentPage >= totalPages}
                >
                  Próximo
                </Button>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Modal de edição */}
      {editingTransaction && (
        <div className={styles.modal}>
          <div className={styles['modal-content']}>
            <h2 className={styles['modal-title']}>Editar Transação</h2>
            <form
              className={styles.form}
              onSubmit={(e) => { e.preventDefault(); handleSaveEdit() }}
            >
              <div className={styles['form-group']}>
                <label htmlFor="type" className={styles.label}>Tipo de Transação</label>
                <select
                  id="type"
                  value={formData.type}
                  onChange={(e) => setFormData((f) => ({ ...f, type: e.target.value }))}
                  className={styles.select}
                >
                  <option value="">Selecione o tipo</option>
                  <option value="deposit">Depósito</option>
                  <option value="withdrawal">Saque</option>
                  <option value="transfer">Transferência</option>
                  <option value="investment-fundos">Fundos de Investimento</option>
                  <option value="investment-tesouro-direto">Tesouro Direto</option>
                  <option value="investment-previdencia">Previdência Privada</option>
                  <option value="investment-bolsa">Bolsa de Valores</option>
                </select>
              </div>

              <div className={styles['form-group']}>
                <label htmlFor="amount" className={styles.label}>Valor (R$)</label>
                <input
                  type="text"
                  id="amount"
                  value={formData.amount}
                  onChange={(e) => {
                    const formatted = formatCurrency(e.target.value)
                    setFormData((f) => ({ ...f, amount: formatted }))
                  }}
                  placeholder="0,00"
                  maxLength={15}
                  className={styles.input}
                />
              </div>

              <div className={styles['modal-actions']}>
                <Button type="button" variant="secondary" onClick={handleCancelEdit}>
                  Cancelar
                </Button>
                <Button type="submit" variant="primary">
                  Salvar Alterações
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  )
}
