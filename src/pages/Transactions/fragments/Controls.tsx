import React from 'react'
import { Box, Button, Checkbox, FormControlLabel, FormGroup, IconButton } from '@mui/material'
import { endOfDay, format, startOfDay } from 'date-fns'
import dayjs from 'dayjs'
import RadioButtonUncheckedIcon from '@mui/icons-material/RadioButtonUnchecked'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'

import InputBasicDate from '~/components/atoms/inputs/InputBasicDate'
import InputForm from '~/components/atoms/inputs/InputForm'
import InputSearch from '~/components/atoms/inputs/InputSearch'
import Paper from '~/components/layout/Paper'
import { DEFAULT_FORMAT_DATE, DEFAULT_SHORT_FORMAT_DATE } from '~/constants'
import colors from '~/layout/theme/colors'
import { useTransactionContext } from '../context'
import { Icon } from '~/components/atoms/icons'

interface ControlsProps {
  startDate: string
  setStartDate: (value: React.SetStateAction<string>) => void
  endDate: string
  setEndDate: (value: React.SetStateAction<string>) => void
  showFilter: boolean
  setShowFilter: (value: React.SetStateAction<boolean>) => void
  handleChangeSearch: (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void
  handleClearFilter: () => void
  handleFilter: () => void
}

const Controls = ({
  showFilter,
  startDate,
  setStartDate,
  endDate,
  setEndDate,
  setShowFilter,
  handleChangeSearch,
  handleClearFilter,
  handleFilter
}: ControlsProps) => {
  const {
    includeGoalActive,
    openAddTransaction,
    setIncludeGoalActive,
    setOpenAddTransaction,
    setTransactionModalType
  } = useTransactionContext()

  return (
    <Box display="flex" flexGrow={0} justifyContent="end" mb={1}>
      <Paper fullWidth grid>
        <Box display="flex" flexWrap="wrap" gap={2} alignItems="center" mb={showFilter ? 2 : 0}>
          <Box flexGrow={1}>
            <InputSearch placeholder="Procure por categoria, descrição ou banco" onChange={handleChangeSearch} />
          </Box>

          <Box>
            <IconButton title="Filtrar" onClick={() => { setShowFilter(!showFilter) }}>
              <Icon name="filter" />
            </IconButton>
          </Box>

          <Box display="flex" alignItems="center" gap={1}>
            <Button
              fullWidth
              variant="contained"
              color="success"
              startIcon={
                <Box display="flex" style={{ transform: 'rotate(180deg)' }}>
                  <Icon name="transaction" color={colors.background.main} size={20} />
                </Box>
              }
              onClick={() => {
                setTransactionModalType('income')
                setOpenAddTransaction(!openAddTransaction)
              }}
            >
              Receber
            </Button>

            <Button
              fullWidth
              variant="contained"
              color="error"
              startIcon={<Icon name="transaction" color={colors.background.main} size={20} />}
              onClick={() => {
                setTransactionModalType('expense')
                setOpenAddTransaction(!openAddTransaction)
              }}
            >
              Gastar
            </Button>
          </Box>
        </Box>

        {showFilter && (
          <>
            <Box display="flex" flexWrap="wrap" gap={3} alignItems="end" justifyContent="space-between">
              <Box display="flex" flexWrap="nowrap" gap={3} alignItems="end" flex={1}>
                <Box>
                  <InputForm fullWidth title="Data inicial">
                    <InputBasicDate
                      placeholder="Informe uma data"
                      value={startDate === '' ? null : dayjs(format(new Date(startDate), DEFAULT_SHORT_FORMAT_DATE))}
                      onChange={(value: dayjs.Dayjs) => {
                        const newDate = startOfDay(new Date(value.toISOString()))
                        setStartDate(format(newDate, DEFAULT_FORMAT_DATE))
                      }}
                    />
                  </InputForm>
                </Box>

                <Box>
                  <InputForm fullWidth title="Data final">
                    <InputBasicDate
                      placeholder="Informe uma data"
                      value={endDate === '' ? null : dayjs(format(new Date(endDate), DEFAULT_SHORT_FORMAT_DATE))}
                      onChange={(value: dayjs.Dayjs) => {
                        const newDate = endOfDay(new Date(value.toISOString()))
                        setEndDate(format(newDate, DEFAULT_FORMAT_DATE))
                      }}
                    />
                  </InputForm>
                </Box>

                <Box>
                  <FormGroup>
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={includeGoalActive}
                          onChange={(event) => { setIncludeGoalActive(event.target.checked) }}
                          icon={<RadioButtonUncheckedIcon />}
                          checkedIcon={<CheckCircleIcon color="primary" />}
                        />
                      }
                      label="Incluir metas?"
                    />
                  </FormGroup>
                </Box>
              </Box>

              <Box display="flex" alignItems="center" justifyContent="end" gap={1} mt={2}>
                <Button variant="outlined" color="primary" onClick={handleClearFilter}>
                  Limpar
                </Button>
                <Button variant="contained" color="primary" onClick={handleFilter}>
                  Filtrar
                </Button>
              </Box>
            </Box>
          </>
        )}
      </Paper>
    </Box>
  )
}

export default Controls