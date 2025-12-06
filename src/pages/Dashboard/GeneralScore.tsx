import { Box } from '@mui/material'
import React, { useEffect, useState } from 'react'
import { TotalTransactionDashType } from '~/client/models/transactions'
import transactionsRepository from '~/client/repository/transactionsRepository'
import { Segments } from '~/constants'
import { IconBalance, IconDowns, IconRevenues } from '~/constants/icons'
import GeneralScoreItem from './fragments/GeneralScoreItem'

const DEFAULT_SIZE_ICONS = 30

const defaultData = {
  TotalDespesa: 0,
  TotalReceita: 0,
  TotalGeral: 0
}

const GeneralScore = (): React.JSX.Element => {
  const [data, setData] = useState<TotalTransactionDashType>(defaultData)
  const { getAllTransactions } = transactionsRepository()

  const getColorValue = (value: number): string => value < 0 ? Segments.Despesa.color : Segments.Receita.color

  useEffect(() => {
    getAllTransactions().then(
      (response) => {
        if (response) {
          setData(response)
        } else {
          setData(defaultData)
        }
      }
    )
  }, [])

  return (
    <Box display="flex" flexWrap="wrap" gap={3}>
      <Box flex="auto">
        <GeneralScoreItem
          label="Saldo"
          value={data?.TotalGeral ?? 0}
          color={getColorValue(data?.TotalGeral ?? 0)}
          icon={<IconBalance size={DEFAULT_SIZE_ICONS} />}
        />
      </Box>

      <Box flex="auto">
        <GeneralScoreItem
          value={data?.TotalReceita ?? 0}
          label="Receitas"
          color={Segments.Receita.color}
          icon={<IconRevenues color={Segments.Receita.color} size={DEFAULT_SIZE_ICONS} />}
        />
      </Box>

      <Box flex="auto">
        <GeneralScoreItem
          label="Gastos"
          value={data?.TotalDespesa ?? 0}
          color={Segments.Despesa.color}
          icon={<IconDowns color={Segments.Despesa.color} size={DEFAULT_SIZE_ICONS} />}
        />
      </Box>
    </Box>
  )
}

export default GeneralScore
