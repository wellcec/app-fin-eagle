import React from 'react'
import { Box, Grid, IconButton, Typography } from '@mui/material'
import StarIcon from '@mui/icons-material/Star'
import { format } from 'date-fns'
import makeStyles from '@mui/styles/makeStyles'
import Paper from '~/components/layout/Paper'
import { DEFAULT_BR_FORMAT_DATE, DefaultsSegments, Segments } from '~/constants'
import { IconDelete, IconTransaction } from '~/constants/icons'
import colors from '~/layout/theme/colors'
import { TransactionType } from '~/client/models/transactions'
import Chip from '~/components/atoms/Chip'
import useUtils from '~/shared/hooks/useUtils'

const useStyles = makeStyles(() => ({
  description: {
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    textWrap: 'nowrap'
  }
}))

interface TransactionItemProps {
  transaction: TransactionType
  handleConfirmDelete: (obj: TransactionType) => void
}

const TransactionItem = ({ transaction, handleConfirmDelete }: TransactionItemProps) => {
  const styles = useStyles()
  const { formatCurrencyString } = useUtils()

  const getColorSegment = (item: TransactionType): string => Segments[item?.segment ?? DefaultsSegments.Receive].color

  return (
    <Box pb={1} mb={0.1}>
      <Paper grid color={getColorSegment(transaction)}>
        <Grid container display="flex" alignItems="center">
          <Grid display="flex" alignItems="center" item xs={1}>
            {transaction.segment === DefaultsSegments.Receive && (
              <Box display="flex" style={{ transform: 'rotate(180deg)' }}>
                <IconTransaction color={getColorSegment(transaction)} />
              </Box>
            )}

            {transaction.segment === DefaultsSegments.Expense && (
              <IconTransaction color={getColorSegment(transaction)} />
            )}
          </Grid>

          <Grid item xs={1}>
            <Typography variant="body1" color={getColorSegment(transaction)}>
              {format(transaction.date ?? new Date(), DEFAULT_BR_FORMAT_DATE)}
            </Typography>
          </Grid>

          <Grid item xs={2}>
            <Typography variant="body1" color={getColorSegment(transaction)}>
              {transaction.segment === DefaultsSegments.Receive ? '+' : '-'}
              {formatCurrencyString(transaction.value)}
            </Typography>
          </Grid>

          <Grid item xs={2} display="flex">
            <Box display="flex" alignItems="center" gap={1}>
              <Chip label={transaction.name ?? ''} color={transaction.color ?? 'info'} />
              {transaction.isGoal === 1 && (
                <StarIcon htmlColor={colors.danger.main} />
              )}
            </Box>
          </Grid>

          <Grid item xs={5} display="flex">
            <Typography variant="body1" className={styles.description}>{transaction.description}</Typography>
          </Grid>

          <Grid item xs={1} display="flex" alignItems="flex-end" justifyContent="flex-end" gap={1}>
            <Box display="flex">
              <IconButton title="Excluir" onClick={() => { handleConfirmDelete(transaction) }} sx={{ padding: 0 }}>
                <IconDelete />
              </IconButton>
            </Box>
          </Grid>
        </Grid>
      </Paper>
    </Box>
  )
}

export default TransactionItem