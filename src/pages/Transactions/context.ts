import React, { useContext } from 'react'
import { TransactionModalType } from '~/models'

type Context = {
  openAddTransaction: boolean
  setOpenAddTransaction: (value: React.SetStateAction<boolean>) => void
  includeGoalActive: boolean
  setIncludeGoalActive: (value: React.SetStateAction<boolean>) => void
  transactionModalType: TransactionModalType
  setTransactionModalType: (value: React.SetStateAction<TransactionModalType>) => void
}

const transactionContext = React.createContext<Context>({
  openAddTransaction: false,
  setOpenAddTransaction: () => { },
  includeGoalActive: false,
  setIncludeGoalActive: () => { },
  transactionModalType: 'income',
  setTransactionModalType: () => { }
})

export const useTransactionContext = (): Context => {
  const {
    openAddTransaction,
    setOpenAddTransaction,
    includeGoalActive,
    setIncludeGoalActive,
    transactionModalType,
    setTransactionModalType
  } = useContext(transactionContext)

  return {
    openAddTransaction,
    setOpenAddTransaction,
    includeGoalActive,
    setIncludeGoalActive,
    transactionModalType,
    setTransactionModalType
  }
}

export const { Provider } = transactionContext
export default transactionContext
