import { Box, Typography } from '@mui/material'
import React, { useCallback, useEffect, useState } from 'react'
import { BankAccountType } from '~/client/models/bankAccounts'
import bankAccountsRepository from '~/client/repository/bankAccountsRepository'
import Paper from '~/components/layout/Paper'
import { Segments } from '~/constants'
import useUtils from '~/shared/hooks/useUtils'

const BanksScore = () => {
  const [banksScore, setBanksScore] = useState<BankAccountType[]>([])

  const { formatCurrencyString } = useUtils()
  const { getAccounts } = bankAccountsRepository()

  const _getAll = useCallback(() => {
    getAccounts(undefined, true).then(
      (response) => {
        setBanksScore(response)
      }
    )
  }, [])

  useEffect(() => {
    _getAll()
  }, [])

  if (banksScore.length === 0) return <></>

  return (
    <>
      {banksScore.map((item, index) => (
        <Box key={index} display="flex" alignItems="center" flex="1" minWidth={280} width={1}>
          <Paper grid fullWidth>
            <Box display="flex" justifyContent="space-between">
              <Typography variant="subtitle1" fontWeight={500}>
                {item.name}
              </Typography>

              <Typography variant="h6" component="div" color={(item.totalValue ?? 0) > 0 ? Segments.Receita.color : Segments.Despesa.color}>
                {formatCurrencyString(item.totalValue ?? 0)}
              </Typography>
            </Box>
          </Paper>
        </Box>
      ))}
    </>
  )
}

export default BanksScore