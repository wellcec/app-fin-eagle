import React, { useEffect, useState } from 'react'
import { Box, Typography, Avatar } from '@mui/material'
import Paper from '~/components/layout/Paper'
import { TransactionType } from '~/client/models/transactions'
import transactionsRepository from '~/client/repository/transactionsRepository'
import useUtils from '~/shared/hooks/useUtils'
import colors from '~/layout/theme/colors'

const SIZE_AVATAR = 24

const TopExpenses = (): React.JSX.Element => {
  const [expenses, setExpenses] = useState<TransactionType[]>([])
  const { getTopExpenses } = transactionsRepository()
  const { formatCurrencyString } = useUtils()

  useEffect(() => {
    getTopExpenses(new Date()).then((data) => {
      setExpenses(data)
    })
  }, [])

  if (expenses.length === 0) return <></>

  return (
    <Box>
      <Paper>
        <Box mb={2}>
          <Typography variant="subtitle1" fontWeight={500}>
            Top 3 Despesas do Mês
          </Typography>
        </Box>

        <Box display="flex" flexDirection="column" gap={2}>
          {expenses.map((item, index) => (
            <Box key={item.id} display="flex" alignItems="center" gap={2}>
              <Avatar
                sx={{
                  bgcolor: index === 0 ? colors.error.light : index === 1 ? colors.danger.main : colors.secondary.contrastText,
                  width: SIZE_AVATAR,
                  height: SIZE_AVATAR,
                  fontSize: 12,
                  color: colors.secondary.main
                }}
              >
                {index + 1}
              </Avatar>

              <Box flexGrow={1}>
                <Typography variant="body2" fontWeight={500}>
                  {item.description}
                </Typography>

                <Typography variant="caption" color="text.secondary">
                  {item.name}
                </Typography>
              </Box>

              <Typography variant="body2" fontWeight={600} color="error">
                - {formatCurrencyString(item.value)}
              </Typography>
            </Box>
          ))}
        </Box>
      </Paper>
    </Box>
  )
}

export default TopExpenses
