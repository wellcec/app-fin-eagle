import { Box, Button, FormLabel, Stack, Typography } from '@mui/material'
import React from 'react'
import { BankAccountType } from '~/client/models/bankAccounts'
import Chip from '~/components/atoms/Chip'
import colors from '~/layout/theme/colors'
import { TransactionModalType } from '~/models'

interface BanksAccountsProps {
  type: TransactionModalType
  selectedBank?: BankAccountType
  bankAccounts: BankAccountType[]
  handleSelectBank: (selected: BankAccountType) => void
}

const BanksAccounts = ({ selectedBank, bankAccounts, handleSelectBank, type }: BanksAccountsProps) => {
  return (
    <>
      <Box mb={1}>
        <FormLabel>
          <Typography variant="body1" component="span" color={colors.text.main}>
            {type === 'income' ? 'Para onde vai' : 'Saindo de onde'}
          </Typography>
        </FormLabel>
      </Box>

      <Box display="flex" gap={2} flexWrap="wrap" mb={1}>
        {bankAccounts.map((item, index) => (
          <Button
            key={index}
            sx={{
              borderRadius: 3,
            }}
            onClick={() => { handleSelectBank(item) }}
          >
            <Box
              p={1.2}
              minWidth={115}
              sx={{
                transition: 'all ease',
                borderRadius: 3,
                cursor: 'pointer',
                border: item.id !== selectedBank?.id ? `1px solid ${colors.background.main}` : `1px solid ${item.color}`
              }}
            >
              <Stack display="flex" flexDirection="column" gap={2}>
                <Box display="flex" justifyContent="space-between">
                  <Box>
                    <Typography variant="subtitle1">{item.name}</Typography>
                  </Box>
                </Box>

                <Stack>
                  <Chip color={item.color} fullWidth />
                </Stack>
              </Stack>
            </Box>
          </Button>
        ))}

        {(bankAccounts && bankAccounts.length === 0) && (
          <Box
            p={2}
            width={1}
            display="flex"
            justifyContent="center"
            alignItems="center"
            border="1px dashed gray"
          >
            <Typography variant="body1">
              Nenhum conta foi adicionada
            </Typography>
          </Box>
        )}
      </Box>
    </>
  )
}

export default BanksAccounts