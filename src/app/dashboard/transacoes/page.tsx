'use client'

import React, { useEffect, useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/hooks/useJWTAuth'
import { useDashboard } from '@/contexts/DashboardContextJWT'
import { FilterProvider } from '@/contexts/FilterContext'
import { useFilters } from '@/hooks/useFilters'
import { UserProfileJWT } from '@/components/molecules/UserProfile/UserProfileJWT'
import { FilterBar } from '@/components/molecules/FilterBar'
import { Pagination } from '@/components/molecules/Pagination'
import type { Transaction } from '@/contexts/DashboardContextJWT'
import { Button } from '@/components/atoms/Button/Button'
import { LoadingScreen } from '@/components/atoms/Loading'
import {
  generateExtractPDF,
  downloadPDF,
  type ExtractPDFOptions
} from '@/lib/pdf/extract-generator'
import type { FinancialTransaction, DocumentSummary } from '@/lib/ai/document-processor'
import styles from './transacoes.module.scss'

function TransacoesContent() {
  const { user, isLoading } = useAuth()
  const { transactions, deleteTransaction, editTransaction } = useDashboard()
  const router = useRouter()

  // Derivar userName do user data
  const userName = user?.username || user?.email?.split('@')[0] || 'Usuário'

  const {
    filteredTransactions,
    paginatedTransactions,
    pagination,
    updatePagination,
    getTransactionTypeText
  } = useFilters(transactions || [])

  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null)
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    type: '',
    amount: ''
  })

  const formatCurrency = useCallback((value: string) => {
    const numbers = value.replace(/\D/g, '')
    if (numbers === '') return ''

    const numericValue = parseInt(numbers) / 100
    return numericValue.toLocaleString('pt-BR', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    })
  }, [])

  const handleEdit = useCallback((transaction: Transaction) => {
    setEditingTransaction(transaction)

    let editType = transaction.type
    if (transaction.type === 'investment') {
      if (transaction.investmentType) {
        editType = `investment-${transaction.investmentType}` as Transaction['type']
      } else if (transaction.subtype) {
        editType = `investment-${transaction.subtype}` as Transaction['type']
      }
    }

    setFormData({
      type: editType,
      amount: transaction.amount.toLocaleString('pt-BR', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      })
    })
  }, [])

  const handleDelete = useCallback(
    async (transactionId: string) => {
      if (!confirm('Tem certeza que deseja deletar esta transação?')) return

      try {
        setDeletingId(transactionId)
        await deleteTransaction(transactionId)
      } catch (error) {
        console.error('Error deleting transaction:', error)
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

    const updates: Partial<Transaction> = {
      amount: amount
    }

    if (formData.type.startsWith('investment-')) {
      updates.type = 'investment'

      const investmentTypeMap = {
        'investment-fundos': {
          investmentType: 'fundos' as const,
          subtype: 'renda-variavel' as const
        },
        'investment-tesouro-direto': {
          investmentType: 'tesouro-direto' as const,
          subtype: 'renda-fixa' as const
        },
        'investment-previdencia': {
          investmentType: 'previdencia' as const,
          subtype: 'renda-fixa' as const
        },
        'investment-bolsa': {
          investmentType: 'bolsa' as const,
          subtype: 'renda-variavel' as const
        },
        'investment-renda-fixa': { subtype: 'renda-fixa' as const },
        'investment-renda-variavel': { subtype: 'renda-variavel' as const }
      }

      const mapping = investmentTypeMap[formData.type as keyof typeof investmentTypeMap]
      if (mapping) {
        updates.investmentType = 'investmentType' in mapping ? mapping.investmentType : undefined
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
    } catch (error) {
      console.error('Error editing transaction:', error)
      alert('Erro ao editar transação. Tente novamente.')
    }
  }, [editingTransaction, formData, editTransaction, handleCancelEdit])

  const handleAmountChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value
      const currentValue = formData.amount

      if (value === '' || value.length < currentValue.length) {
        setFormData((prev) => ({ ...prev, amount: value }))
        return
      }

      const formattedValue = formatCurrency(value)
      setFormData((prev) => ({ ...prev, amount: formattedValue }))
    },
    [formData.amount, formatCurrency]
  )

  const handleInputChange = useCallback((field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }, [])

  const handleAmountBlur = useCallback(() => {
    if (formData.amount) {
      const formattedValue = formatCurrency(formData.amount)
      setFormData((prev) => ({ ...prev, amount: formattedValue }))
    }
  }, [formData.amount, formatCurrency])

  const handlePageChange = (page: number) => {
    updatePagination({ currentPage: page })
  }

  const handleItemsPerPageChange = (itemsPerPage: number) => {
    updatePagination({ itemsPerPage, currentPage: 1 })
  }

  // Função auxiliar para descrição da transação
  const getTransactionDescription = useCallback((transaction: Transaction): string => {
    switch (transaction.type) {
      case 'deposit':
        return 'DEPÓSITO EM CONTA CORRENTE'
      case 'withdrawal':
        return 'SAQUE EM CONTA CORRENTE'
      case 'transfer':
        return 'TRANSFERÊNCIA BANCÁRIA'
      case 'investment':
        return `INVESTIMENTO - ${transaction.investmentType || 'APLICAÇÃO'}`
      default:
        return 'MOVIMENTAÇÃO BANCÁRIA'
    }
  }, []);

  // Gerar PDF do extrato
  const handleGeneratePDF = useCallback(async () => {
    if (!transactions || transactions.length === 0) {
      alert('Nenhuma transação encontrada para gerar PDF.')
      return
    }

    try {
      // Converter transações para o formato do PDF
      const pdfTransactions: FinancialTransaction[] = filteredTransactions.map((t) => ({
        date: new Date(t.date).toLocaleDateString('pt-BR'),
        amount: t.amount,
        type: t.type === 'deposit' ? 'income' : 'expense',
        description: getTransactionDescription(t),
        category: t.subtype || 'outros',
        confidence: 100
      }))

      // Calcular resumo
      const totalIncome = pdfTransactions
        .filter((t) => t.type === 'income')
        .reduce((sum, t) => sum + t.amount, 0)

      const totalExpenses = pdfTransactions
        .filter((t) => t.type === 'expense')
        .reduce((sum, t) => sum + t.amount, 0)

      const categories = [...new Set(pdfTransactions.map((t) => t.category))]

      const summary: DocumentSummary = {
        totalTransactions: pdfTransactions.length,
        totalIncome,
        totalExpenses,
        dateRange: {
          start: pdfTransactions.length > 0 ? pdfTransactions[pdfTransactions.length - 1].date : '',
          end: pdfTransactions.length > 0 ? pdfTransactions[0].date : ''
        },
        mainCategories: categories.filter((cat): cat is string => Boolean(cat))
      }

      // Gerar PDF
      const pdfOptions: ExtractPDFOptions = {
        userName,
        accountNumber: '123456-7',
        period: {
          start: summary.dateRange.start || new Date().toLocaleDateString('pt-BR'),
          end: summary.dateRange.end || new Date().toLocaleDateString('pt-BR')
        },
        transactions: pdfTransactions,
        summary,
        includeLogo: true,
        theme: 'light'
      }

      const pdfBlob = await generateExtractPDF(pdfOptions)
      const fileName = `extrato-bytebank-${new Date().toISOString().slice(0, 10)}.pdf`
      downloadPDF(pdfBlob, fileName)
    } catch (error) {
      console.error('Erro ao gerar PDF:', error)
      alert('Erro ao gerar PDF. Tente novamente.')
    }
  }, [transactions, filteredTransactions, userName, getTransactionDescription])

  useEffect(() => {
    if (!isLoading && !user) {
      router.replace('/')
    }
  }, [user, isLoading, router])

  if (isLoading) {
    return <LoadingScreen isVisible={true} size="large" text="Carregando extrato..." />
  }

  if (!user) {
    return null
  }

  return (
    <>
      <UserProfileJWT userName={userName} />
      <main className={styles.main}>
        <div className={styles['dashboard-container']}>
          <div className={styles['page-header']}>
            <div className={styles['header-content']}>
              <h1 className={styles['page-title']}>Extrato</h1>
              <p className={styles.subtitle}>Gerencie suas movimentações financeiras</p>
            </div>
            <div className={styles['header-actions']}>
              <Button variant="primary" onClick={handleGeneratePDF}>
                Gerar PDF
              </Button>
              <Button
                variant="secondary"
                onClick={() => router.back()}
                className={styles['back-button']}
              >
                Dashboard
              </Button>
            </div>
          </div>

          <FilterBar />

          <div className={styles['transactions-card']}>
            <div className={styles['card-header']}>
              <h2 className={styles['card-title']}>Histórico de Transações</h2>
              <span className={styles.counter}>
                {filteredTransactions.length} de {transactions.length}{' '}
                {filteredTransactions.length === 1 ? 'transação' : 'transações'}
              </span>
            </div>

            <div className={styles['card-content']}>
              {(paginatedTransactions && paginatedTransactions.length === 0) ||
              (!paginatedTransactions && transactions.length === 0) ? (
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
                  {(paginatedTransactions || transactions).map((transaction) => (
                    <div key={transaction.id} className={styles['transaction-row']}>
                      <div className={styles['transaction-info']}>
                        <div className={styles['transaction-month']}>
                          {new Date(transaction.date).toLocaleDateString('pt-BR', {
                            month: 'long'
                          })}
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
                        <Button
                          variant="primary"
                          size="small"
                          onClick={() => handleEdit(transaction)}
                        >
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

            {paginatedTransactions && paginatedTransactions.length > 0 && (
              <Pagination
                currentPage={pagination.currentPage}
                totalPages={pagination.totalPages}
                totalItems={pagination.totalItems}
                itemsPerPage={pagination.itemsPerPage}
                onPageChange={handlePageChange}
                onItemsPerPageChange={handleItemsPerPageChange}
              />
            )}
          </div>
        </div>
      </main>

      {editingTransaction && (
        <div className={styles.modal}>
          <div className={styles['modal-content']}>
            <h2 className={styles['modal-title']}>Editar Transação</h2>

            <form
              className={styles.form}
              onSubmit={(e) => {
                e.preventDefault()
                handleSaveEdit()
              }}
            >
              <div className={styles['form-group']}>
                <label htmlFor="type" className={styles.label}>
                  Tipo de Transação
                </label>
                <select
                  id="type"
                  value={formData.type}
                  onChange={(e) => handleInputChange('type', e.target.value)}
                  className={styles.select}
                >
                  <option value="">Selecione o tipo</option>
                  <option value="deposit">Depósito</option>
                  <option value="withdrawal">Saque</option>
                  <option value="investment-fundos">Fundos de investimento</option>
                  <option value="investment-tesouro-direto">Tesouro Direto</option>
                  <option value="investment-previdencia">Previdência Privada</option>
                  <option value="investment-bolsa">Bolsa de Valores</option>
                  <option value="investment-renda-fixa">Investimento - Renda Fixa</option>
                  <option value="investment-renda-variavel">Investimento - Renda Variável</option>
                </select>
              </div>

              <div className={styles['form-group']}>
                <label htmlFor="amount" className={styles.label}>
                  Valor (R$)
                </label>
                <input
                  type="text"
                  id="amount"
                  value={formData.amount}
                  onChange={handleAmountChange}
                  onBlur={handleAmountBlur}
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

export default function TransacoesPage() {
  return (
    <FilterProvider>
      <TransacoesContent />
    </FilterProvider>
  )
}
