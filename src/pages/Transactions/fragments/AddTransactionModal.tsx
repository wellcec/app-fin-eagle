import React, { useCallback, useEffect, useState } from 'react'
import { Box, Button, Divider, MenuItem, Select } from '@mui/material'
import StarIcon from '@mui/icons-material/Star'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import dayjs from 'dayjs'
import { format } from 'date-fns'

import { SegmentTransactionType, TransactionType } from '~/client/models/transactions'
import Modal from '~/components/molecules/Modal'
import { ACTIONS, ActionsType, TransactionModalType } from '~/models'
import { PREENCHIMENTO_OBRIGATORIO } from '~/constants/messages'
import { CategoryType } from '~/client/models/categories'
import InputForm from '~/components/atoms/inputs/InputForm'
import InputText from '~/components/atoms/inputs/InputText'
import useUtils from '~/shared/hooks/useUtils'
import InputBasicDate from '~/components/atoms/inputs/InputBasicDate'
import { DEFAULT_FORMAT_DATE, DEFAULT_GAP_IZE, DEFAULT_SHORT_FORMAT_DATE, DefaultsSegments } from '~/constants'
import BallColor from '~/components/atoms/BallColor'
import categoriesRepository from '~/client/repository/categoriesRepository'
import useTestsForm from '~/shared/hooks/useTestForm'
import useAlerts from '~/shared/alerts/useAlerts'
import transactionsRepository from '~/client/repository/transactionsRepository'
import { IconDoubleArrowDown } from '~/constants/icons'
import colors from '~/layout/theme/colors'

const IconArrowSelect = (): React.JSX.Element => {
  return <Box mr={1} mt={0.5}><IconDoubleArrowDown /></Box>
}

type TypeForm = {
  value: string
  category: string
  description: string
  date: Date
}

const DEFAULT_VALUES: TypeForm = {
  value: '',
  category: '',
  description: '',
  date: new Date()
}

interface IProps {
  open: boolean
  handleClose: () => void
  callback: () => void
  objToEdit: TransactionType | null
  type: TransactionModalType
}

const AddTransactionModal = ({ open, handleClose, callback, objToEdit, type }: IProps): React.JSX.Element => {
  const [action, setAction] = useState<ActionsType>(ACTIONS.create)
  const [categories, setCategories] = useState<CategoryType[]>([])
  const [segment, setSegment] = useState<SegmentTransactionType>(DefaultsSegments.Receive)
  const [dateTransaction, setDateTransaction] = useState<string>('')

  const { notifyError, notifySuccess } = useAlerts()
  const { formatNumberInput, formatFormCurrency, formatCurrencyRequest } = useUtils()
  const { getCategories } = categoriesRepository()
  const { createTransaction } = transactionsRepository()
  const { greaterThanZeroCurrency } = useTestsForm()

  const formik = useFormik({
    initialValues: DEFAULT_VALUES,
    validationSchema: Yup.object({
      value: Yup.string().required(PREENCHIMENTO_OBRIGATORIO).test(greaterThanZeroCurrency),
      category: Yup.string().required(PREENCHIMENTO_OBRIGATORIO),
      date: Yup.date().required(PREENCHIMENTO_OBRIGATORIO),
      description: Yup.string()
    }),
    validateOnBlur: true,
    validateOnChange: true,
    onSubmit: (data: TypeForm) => {
      const newTransaction: TransactionType = {
        value: formatCurrencyRequest(data.value),
        description: data.description,
        date: data.date,
        idCategory: data.category
      }

      createTransaction(newTransaction).then(
        (response) => {
          if (response) {
            notifySuccess('Transação adicionada')
            callback()
            return
          }

          notifyError('Algo deu errado ao adicionar transação')
        }
      )
    }
  })

  const { setFieldValue } = formik

  const loadCategories = useCallback((segmentChosen: string) => {
    getCategories(segmentChosen).then(
      (response) => {
        const data = response ?? []

        if (data.length > 0) {
          setFieldValue('category', data[0].id)
        }

        setCategories(data)
      }
    )
  }, [getCategories, segment])

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>, prop: string): void => {
    const { value } = event.target
    const numericValue = formatNumberInput(value)
    const formattedValue = formatFormCurrency(numericValue)

    formik.setFieldValue(prop, formattedValue)
  }

  const valueDateTransaction = (): dayjs.Dayjs => {
    if (dateTransaction === '') {
      return dayjs()
    }

    const d1 = format(new Date(dateTransaction), DEFAULT_SHORT_FORMAT_DATE)
    return dayjs(d1)
  }

  const handleKeydown = (event: React.KeyboardEvent<HTMLDivElement>): void => {
    if (event.key === 'Enter') {
      event.preventDefault()
      formik.submitForm()
    }
  }

  useEffect(() => {
    setFieldValue('date', new Date())

    if (objToEdit) {
      setAction('update')
    }
  }, [])

  useEffect(() => {
    loadCategories(segment)
  }, [segment])

  useEffect(() => {
    setSegment(type === 'income' ? DefaultsSegments.Receive : DefaultsSegments.Expense)
  }, [type])

  return (
    <Modal
      title={action === 'create' ? 'Nova Transação' : 'Atualizar Transação'}
      open={open}
      handleClose={handleClose}
    >
      <Box onKeyDown={handleKeydown}>
        <Box minWidth={450} mb={3}>
          <Box display="grid" gap={DEFAULT_GAP_IZE} mb={2}>
            <Box flex={1}>
              <InputForm fullWidth title="Quanto" helperText formik={formik} propField="value">
                <InputText
                  placeholder="Informe um valor"
                  inputProps={{ inputMode: 'numeric', pattern: '[0-9]*' }}
                  {...formik.getFieldProps('value')}
                  error={formik.touched.value && !!formik.errors.value}
                  value={formik.values.value}
                  onChange={(event: React.ChangeEvent<HTMLInputElement>) => { handleChange(event, 'value') }}
                />
              </InputForm>
            </Box>

            <Box flex={1}>
              <InputForm fullWidth title="Quando" helperText formik={formik} propField="date">
                <InputBasicDate
                  placeholder="Informe uma data"
                  {...formik.getFieldProps('date')}
                  value={valueDateTransaction()}
                  error={formik.touched.date && !!formik.errors.date}
                  onChange={(value: dayjs.Dayjs) => {
                    const newDate = new Date(value.toISOString())
                    setFieldValue('date', newDate)
                    setDateTransaction(format(newDate, DEFAULT_FORMAT_DATE))
                  }}
                />
              </InputForm>
            </Box>
          </Box>

          <Box display="grid" gap={DEFAULT_GAP_IZE} mb={2}>
            <Box flex={1}>
              <InputForm fullWidth title="Com o que" helperText formik={formik} propField="category">
                {categories.length > 0 && (
                  <Select
                    variant="outlined"
                    size="small"
                    {...formik.getFieldProps('category')}
                    IconComponent={IconArrowSelect}
                  >
                    {categories.map((item, index) => (
                      <MenuItem key={`cat-add-transaction-${index}`} value={item.id}>
                        <Box display="flex" alignItems="center" gap={DEFAULT_GAP_IZE}>
                          <BallColor color={item.color} size={22} />
                          <Box>
                            {item.name}
                          </Box>
                          {item.isGoal === 1 && (
                            <StarIcon htmlColor={colors.danger.main} />
                          )}
                        </Box>
                      </MenuItem>
                    ))}
                  </Select>
                )}
              </InputForm>
            </Box>
          </Box>

          <Box mb={2}>
            <InputForm fullWidth title="Algo mais" helperText formik={formik} propField="description">
              <InputText
                multiline
                placeholder="Informe uma descrição"
                {...formik.getFieldProps('description')}
                error={formik.touched.description && !!formik.errors.description}
              />
            </InputForm>
          </Box>
        </Box>

        <Divider />

        <Box display="flex" alignItems="center" justifyContent="end" gap={1} mt={2}>
          <Button variant="outlined" color="primary" onClick={handleClose}>
            Cancelar
          </Button>
          <Button variant="contained" color={segment === DefaultsSegments.Receive ? 'success' : 'error'} onClick={() => formik.submitForm()}>
            Salvar
          </Button>
        </Box>
      </Box>
    </Modal>
  )
}

export default AddTransactionModal
