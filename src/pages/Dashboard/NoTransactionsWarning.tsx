import React, { useCallback, useEffect, useState } from 'react'
import { Box, Typography } from '@mui/material'
import transactionsRepository from '~/client/repository/transactionsRepository'
import Paper from '~/components/layout/Paper'
import { emptyFilter } from '~/constants/transactions'
import colors from '~/layout/theme/colors'
import { Icon } from '~/components/atoms/icons'

const NoTransactionsWarning = () => {
  const [hasTransactions, setHasTransactions] = useState<boolean>(true);

  const { getTransactions } = transactionsRepository()

  const getAll = useCallback(() => {
    getTransactions({ ...emptyFilter, take: 1 }).then(
      (response) => {
        const data = response.data ?? []
        setHasTransactions(data.length > 0)
      }
    )
  }, [getTransactions])

  useEffect(() => {
    getAll()
  }, [])

  if (hasTransactions) return <></>

  return (
    <Box>
      <Paper bgColor={colors.danger.background}>
        <Box display="flex" gap={2} alignItems="center">
          <Icon name="information" color={colors.danger.main} />

          <Typography variant="body2" color="primary">
            Voçê ainda não possui transações cadastradas para o mês atual. Adicione receitas e despesas para começar a acompanhar suas finanças!
          </Typography>
        </Box>
      </Paper>
    </Box>
  )
}

export default NoTransactionsWarning