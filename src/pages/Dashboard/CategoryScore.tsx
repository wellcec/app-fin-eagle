import React, { useEffect, useState } from 'react'
import { Box, Tooltip, Typography } from '@mui/material'

import { TotalTransactionByCategoryType } from '~/client/models/transactions'
import transactionsRepository from '~/client/repository/transactionsRepository'
import Paper from '~/components/layout/Paper'
import useUtils from '~/shared/hooks/useUtils'
import { DefaultsSegments } from '~/constants'
import colors from '~/layout/theme/colors'
import receiveImg from '~/assets/images/receive.png'
import expenseImg from '~/assets/images/expense.png'

const SIZE_IMG = 60
const MIN_SIZE_PAPER = 135

const CategoryScore = (): React.JSX.Element => {
  const [expense, setExpense] = useState<TotalTransactionByCategoryType>()
  const [receive, setReceive] = useState<TotalTransactionByCategoryType>()

  const { getTotalByCategory } = transactionsRepository()
  const { formatCurrencyString } = useUtils()

  useEffect(() => {
    getTotalByCategory().then(
      (response) => {
        if (response) {
          const biggerExpense = response.filter(x => x.segment === DefaultsSegments.Expense).reduce((max, item) =>
            item.total > max.total ? item : max
          )

          const biggerReceive = response.filter(x => x.segment === DefaultsSegments.Receive).reduce((max, item) =>
            item.total > max.total ? item : max
          )

          setExpense(biggerExpense)
          setReceive(biggerReceive)
        } else {
          setExpense(undefined)
          setReceive(undefined)
        }
      }
    )
  }, [])

  return (
    <Box>
      <Box display="flex" gap={2}>
        <Paper bgColor={colors.success.background} fullWidth>
          <Box display="flex" flexDirection="column" gap={2} justifyContent="center" minWidth={MIN_SIZE_PAPER}>
            <Box textAlign="center">
              <img src={receiveImg} alt="Receitas" style={{ maxWidth: SIZE_IMG }} />
            </Box>

            <Tooltip title="Categoria que mais arrecadou" placement="right">
              <Box sx={{ cursor: 'help' }}>
                <Typography variant="subtitle1" fontWeight={500} textAlign="center" color={colors.success.light}>
                  {receive?.categoryName}
                </Typography>

                <Typography variant="h6" fontWeight={500} textAlign="center" color={colors.success.light}>
                  {formatCurrencyString(receive?.total ?? 0)}
                </Typography>
              </Box>
            </Tooltip>
          </Box>
        </Paper>

        <Paper bgColor={colors.error.background} fullWidth>
          <Box display="flex" flexDirection="column" gap={2} justifyContent="center" minWidth={MIN_SIZE_PAPER}>
            <Box textAlign="center">
              <img src={expenseImg} alt="Despesas" style={{ maxWidth: SIZE_IMG }} />
            </Box>

            <Tooltip title="Categoria que mais gastou" placement="right">
              <Box sx={{ cursor: 'help' }}>
                <Typography variant="subtitle1" fontWeight={500} textAlign="center" color={colors.error.light}>
                  {expense?.categoryName}
                </Typography>

                <Typography variant="h6" fontWeight={500} textAlign="center" color={colors.error.light}>
                  {formatCurrencyString(expense?.total ?? 0)}
                </Typography>
              </Box>
            </Tooltip>
          </Box>
        </Paper>
      </Box>
    </Box>
  )
}

export default CategoryScore
