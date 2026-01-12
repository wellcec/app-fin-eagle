import React, { useCallback, useEffect, useState } from 'react'
import { Box, Button, Divider } from '@mui/material'

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
import { DEFAULT_FORMAT_DATE, DEFAULT_GAP_SIZE, DEFAULT_SHORT_FORMAT_DATE, DefaultsSegments } from '~/constants'

import categoriesRepository from '~/client/repository/categoriesRepository'
import useTestsForm from '~/shared/hooks/useTestForm'
import useAlerts from '~/shared/alerts/useAlerts'
import transactionsRepository from '~/client/repository/transactionsRepository'
import { CategoryTypeEnum } from '~/constants/categories'
import { BankAccountType } from '~/client/models/bankAccounts'
import bankAccountsRepository from '~/client/repository/bankAccountsRepository'
import BanksAccounts from './BanksAccounts'
import Categories from './Categories'

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
  const [bankAccounts, setBankAccounts] = useState<BankAccountType[]>([])
  const [selectedBank, setSelectedBank] = useState<BankAccountType>()
  const [segment, setSegment] = useState<SegmentTransactionType>(DefaultsSegments.Receive)
  const [dateTransaction, setDateTransaction] = useState<string>('')
  const [inputEnable, setInputEnable] = useState<boolean>(false)

  const { notifyError, notifySuccess, notifyWarning } = useAlerts()
  const { formatNumberInput, formatFormCurrency, formatCurrencyRequest } = useUtils()
  const { getAccounts } = bankAccountsRepository()
  const { getCategories, getGoalsWithProgress, getDebitsWithProgress } = categoriesRepository()
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
      if (!selectedBank) {
        notifyWarning('Selecione uma conta para continuar')
        return
      }

      const newTransaction: TransactionType = {
        value: formatCurrencyRequest(data.value),
        description: data.description,
        date: data.date,
        idCategory: data.category,
        idBankAccount: selectedBank?.id ?? ''
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

  const loadCategories = useCallback(async (segmentChosen: string) => {
    const response = await getCategories(segmentChosen)

    if (response.length === 0) return

    setFieldValue('category', response[0].id)

    const categoriesWithAvailability = await Promise.all(
      response.map(async (category) => {
        if (category.isGoal === CategoryTypeEnum.Goal) {
          const progress = await getGoalsWithProgress(category.id ?? '')
          return {
            category,
            available: !progress?.[0]?.isAchieved
          }
        }

        if (category.isGoal === CategoryTypeEnum.Debit) {
          const progress = await getDebitsWithProgress(category.id ?? '')
          return {
            category,
            available: !progress?.[0]?.isAchieved
          }
        }

        return { category, available: true }
      })
    )

    const availableCategories = categoriesWithAvailability
      .filter(x => x.available)
      .map(x => x.category)

    setCategories(availableCategories)

  }, [getCategories, getGoalsWithProgress, getDebitsWithProgress, setFieldValue])

  const loadBanksAccounts = useCallback(() => {
    getAccounts().then(
      (response) => {
        const data = response ?? []

        if (data.length > 0) {
          setSelectedBank(data[0])
        }

        setBankAccounts(data)
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

  const handleSelectBank = (selected: BankAccountType) => {
    setSelectedBank(selected)
  }

  useEffect(() => {
    setFieldValue('date', new Date())

    if (objToEdit) {
      setAction('update')
    }
  }, [])

  useEffect(() => {
    loadCategories(segment)
    loadBanksAccounts()
  }, [segment])

  useEffect(() => {
    setSegment(type === 'income' ? DefaultsSegments.Receive : DefaultsSegments.Expense)
  }, [type])

  useEffect(() => {
    const categoryId = formik.values.category

    if (!categoryId) {
      setInputEnable(false)
      formik.setFieldValue('value', '')
      return
    }

    const category = categories.find(c => c.id === categoryId)

    if (category?.isGoal !== CategoryTypeEnum.Debit) {
      setInputEnable(false)
      formik.setFieldValue('value', '')
      return
    }

    const numericValue = category?.valueGoal ?? 0
    const formattedValue = formatFormCurrency(numericValue)

    setInputEnable(true)
    formik.setFieldValue('value', formattedValue)
  }, [formik.values.category, categories])

  return (
    <Modal
      title={action === 'create' ? 'Nova Transação' : 'Atualizar Transação'}
      open={open}
      handleClose={handleClose}
    >
      <Box onKeyDown={handleKeydown}>
        <Box minWidth={450} mb={3}>
          <BanksAccounts
            selectedBank={selectedBank}
            type={type}
            bankAccounts={bankAccounts}
            handleSelectBank={handleSelectBank}
          />

          <Categories categories={categories} formik={formik} />

          <Box display="grid" gap={DEFAULT_GAP_SIZE} mb={2}>
            <Box flex={1}>
              <InputForm fullWidth title="Quanto" helperText formik={formik} propField="value">
                <InputText
                  placeholder="Informe um valor"
                  inputProps={{ inputMode: 'numeric', pattern: '[0-9]*' }}
                  {...formik.getFieldProps('value')}
                  error={formik.touched.value && !!formik.errors.value}
                  value={formik.values.value}
                  onChange={(event: React.ChangeEvent<HTMLInputElement>) => { handleChange(event, 'value') }}
                  disabled={inputEnable}
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
