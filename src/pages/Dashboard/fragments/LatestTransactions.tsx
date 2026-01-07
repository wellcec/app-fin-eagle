import React, { useCallback, useEffect, useState } from 'react'
import { Box, Typography, Divider, Button } from '@mui/material'
import { useNavigate } from 'react-router-dom'
import { endOfMonth, format, startOfMonth } from 'date-fns'
import Paper from '~/components/layout/Paper'
import { FilterTransactionType, TransactionType } from '~/client/models/transactions'
import transactionsRepository from '~/client/repository/transactionsRepository'
import { DEFAULT_BR_FORMAT_DATE, DEFAULT_FORMAT_DATE, DefaultsSegments, Segments } from '~/constants'
import useUtils from '~/shared/hooks/useUtils'

const LatestTransactions = (): React.JSX.Element => {
  const [transactions, setTransactions] = useState<TransactionType[]>([])
  const { getTransactions } = transactionsRepository()
  const { formatCurrencyString } = useUtils()
  const navigate = useNavigate()

  const getAll = useCallback(() => {
    const filter: FilterTransactionType = {
      page: 1,
      take: 5,
      term: '',
      category: '',
      segment: '',
      endDate: format(endOfMonth(new Date()), DEFAULT_FORMAT_DATE),
      startDate: format(startOfMonth(new Date()), DEFAULT_FORMAT_DATE),
    }

    getTransactions(filter).then(
      (response) => {
        const data = response.data ?? []
        setTransactions(data)
      }
    )
  }, [getTransactions])

  useEffect(() => {
    getAll()
  }, [])

  if (transactions.length === 0) return <></>

  return (
    <Box flex="auto">
      <Paper>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
          <Typography variant="subtitle1" fontWeight={500}>
            Últimas Transações
          </Typography>

          <Button size="small" variant="text" onClick={() => { navigate('/transactions') }}>
            Ver todas
          </Button>
        </Box>

        <Box display="flex" flexDirection="column" gap={1}>
          {transactions.map((item, index) => (
            <React.Fragment key={item.id}>
              <Box display="flex" justifyContent="space-between" alignItems="center">
                <Box>
                  <Typography variant="body2" fontWeight={500}>
                    {item.description}
                  </Typography>

                  <Typography variant="caption" color="text.secondary">
                    {format(new Date(item.date ?? new Date()), DEFAULT_BR_FORMAT_DATE)}
                  </Typography>
                </Box>

                <Typography
                  variant="body2"
                  fontWeight={600}
                  color={item.segment === DefaultsSegments.Receive ? Segments.Receita.color : Segments.Despesa.color}
                >
                  {item.segment === DefaultsSegments.Receive ? '+' : '-'} {formatCurrencyString(item.value)}
                </Typography>
              </Box>

              {index < transactions.length - 1 && <Divider />}
            </React.Fragment>
          ))}
        </Box>
      </Paper>
    </Box>
  )
}

export default LatestTransactions
