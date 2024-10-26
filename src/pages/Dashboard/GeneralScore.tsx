import { Box, Typography } from '@mui/material'
import React, { useEffect, useState } from 'react'
import { TotalTransactionDashType } from '~/client/models/transactions'
import transactionsRepository from '~/client/repository/transactionsRepository'
import Paper from '~/components/layout/Paper'
import { Segments } from '~/constants'
import useUtils from '~/shared/hooks/useUtils'

const defaultData = {
  TotalDespesa: 0,
  TotalReceita: 0,
  TotalGeral: 0
}

const GeneralScore = (): React.JSX.Element => {
  const [data, setData] = useState<TotalTransactionDashType>(defaultData)
  const { getAllTransactions } = transactionsRepository()
  const { formatCurrencyString } = useUtils()

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
    <Paper>
      <Box>
        <Box textAlign="center">
          <Typography variant="subtitle1" fontWeight={500}>
            Total geral até aqui...
          </Typography>
        </Box>

        <Box display="flex" justifyContent="center" gap={2}>
          <Typography variant="h6" component="div" color={Segments.Receita.color}>
            + {formatCurrencyString(data?.TotalReceita ?? 0)}
          </Typography>
          <Typography variant="h6" component="div" color={Segments.Despesa.color}>
            - {formatCurrencyString(data?.TotalDespesa ?? 0)}
          </Typography>
          <Typography variant="h6" component="div" color={data?.TotalGeral > 0 ? Segments.Receita.color : Segments.Despesa.color}>
            = {(data?.TotalGeral < 0 ? '-' : '+') + formatCurrencyString(data?.TotalGeral)}
          </Typography>
        </Box>
      </Box>
    </Paper>
  )
}

export default GeneralScore
