import React, { useEffect, useState } from 'react'
import { Box, Typography } from '@mui/material'
import makeStyles from '@mui/styles/makeStyles'

import { TotalTransactionByCategoryType } from '~/client/models/transactions'
import transactionsRepository from '~/client/repository/transactionsRepository'
import Paper from '~/components/layout/Paper'
import useUtils from '~/shared/hooks/useUtils'
import { Segments } from '~/constants'

const useStyles = makeStyles(() => ({
  boxValue: {
    display: 'flex',
    flexDirection: 'column',
    borderRadius: '50%',
    height: 120,
    width: 120,
    justifyContent: 'center',
    alignItems: 'center'
  },
  categoryName: {
    fontWeight: '500'
  }
}))

const CategoryScore = (): React.JSX.Element => {
  const [expense, setExpense] = useState<TotalTransactionByCategoryType>()
  const [receive, setReceive] = useState<TotalTransactionByCategoryType>()

  const styles = useStyles()
  const { getTotalByCategory } = transactionsRepository()
  const { formatCurrencyString } = useUtils()

  useEffect(() => {
    getTotalByCategory().then(
      (response) => {
        if (response) {
          const biggerExpense = response.filter(x => x.segment === 'Despesa').reduce((max, item) =>
            item.total > max.total ? item : max
          )

          const biggerReceive = response.filter(x => x.segment === 'Receita').reduce((max, item) =>
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
    <Box flex="auto">
      <Paper>
        <Box display="flex" justifyContent="center" gap={2.3}>
          <Box>
            <Box textAlign="center" mb={2}>
              <Typography variant="subtitle1" fontWeight={500}>
                Categoria que mais arrecadou
              </Typography>
            </Box>

            <Box display="flex" justifyContent="center">
              <Box className={styles.boxValue} sx={{ border: `solid 10px ${Segments.Receita.color}` }}>
                <Box className={styles.categoryName}>
                  {receive?.categoryName}
                </Box>

                <Box>
                  {formatCurrencyString(receive?.total ?? 0)}
                </Box>
              </Box>
            </Box>
          </Box>

          <Box>
            <Box textAlign="center" mb={2}>
              <Typography variant="subtitle1" fontWeight={500}>
                Categoria que mais gastou
              </Typography>
            </Box>

            <Box display="flex" justifyContent="center">
              <Box className={styles.boxValue} sx={{ border: `solid 10px ${Segments.Despesa.color}` }}>
                <Box className={styles.categoryName}>
                  {expense?.categoryName}
                </Box>

                <Box>
                  {formatCurrencyString(expense?.total ?? 0)}
                </Box>
              </Box>
            </Box>
          </Box>
        </Box>
      </Paper>
    </Box>
  )
}

export default CategoryScore
