import React, { useCallback, useEffect, useState } from 'react'
import { Box, Button, Divider, Grid, IconButton, LinearProgress, MenuItem, Select, Theme, Typography, useMediaQuery } from '@mui/material'
import * as Yup from 'yup'

import ContainerMain from '~/components/layout/ContainerMain'
import Paper from '~/components/layout/Paper'
import InputSearch from '~/components/atoms/inputs/InputSearch'
import { ACTIONS, ActionsType, SampleFilterType } from '~/models'
import DEFAULT_PAGESIZE, { DEFAULT_GAP_IZE, DefaultsSegments, SMALL_BALL_SIZE } from '~/constants'
import useDebounce from '~/shared/hooks/useDebounce'
import limitsRepository from '~/client/repository/limitsRepository'
import categoriesRepository from '~/client/repository/categoriesRepository'
import { LimitType, LimitWithCategoryType } from '~/client/models/limits'
import { CategoryType } from '~/client/models/categories'
import useAlerts from '~/shared/alerts/useAlerts'
import { IconDelete, IconDoubleArrowDown, IconEdit } from '~/constants/icons'
import Modal from '~/components/molecules/Modal'
import InputForm from '~/components/atoms/inputs/InputForm'
import InputText from '~/components/atoms/inputs/InputText'
import { useFormik } from 'formik'
import { PREENCHIMENTO_OBRIGATORIO } from '~/constants/messages'
import Dialog from '~/components/molecules/Dialog'
import BallColor from '~/components/atoms/BallColor'
import useUtils from '~/shared/hooks/useUtils'
import useTestsForm from '~/shared/hooks/useTestForm'
import AddButton from '~/components/atoms/buttons/AddButton'

const IconArrowSelect = (): React.JSX.Element => {
  return <Box mr={1} mt={0.5}><IconDoubleArrowDown /></Box>
}

interface TypeForm {
  idCategory: string
  limitAmount: string
}

const DEFAULT_VALUES: TypeForm = {
  idCategory: '',
  limitAmount: ''
}

const emptyFilter: SampleFilterType = {
  term: '',
  page: 1,
  pageSize: DEFAULT_PAGESIZE
}

const Limits = (): React.JSX.Element => {
  const [action, setAction] = useState<ActionsType>(ACTIONS.create)
  const [filter, setFilter] = useState<SampleFilterType>(emptyFilter)
  const [limits, setLimits] = useState<LimitWithCategoryType[]>([])
  const [categories, setCategories] = useState<CategoryType[]>([])
  const [openModal, setOpenModal] = useState<boolean>(false)
  const [objToAction, setObjToAction] = useState<LimitWithCategoryType>()
  const [confirmOpen, setConfirmOpen] = useState<boolean>(false)

  const downSM = useMediaQuery((theme: Theme) => theme.breakpoints.down('sm'))
  const { debounceWait } = useDebounce()
  const { getLimits, createLimit, updateLimit, deleteLimit } = limitsRepository()
  const { getCategories } = categoriesRepository()
  const { notifyError, notifySuccess } = useAlerts()
  const { formatNumberInput, formatFormCurrency, formatCurrencyString, currencyToNumber } = useUtils()
  const { greaterThanZeroCurrency } = useTestsForm()

  const formik = useFormik({
    initialValues: DEFAULT_VALUES,
    validationSchema: Yup.object({
      idCategory: Yup.string().required(PREENCHIMENTO_OBRIGATORIO),
      limitAmount: Yup.string().required(PREENCHIMENTO_OBRIGATORIO).test(greaterThanZeroCurrency)
    }),
    validateOnBlur: true,
    validateOnChange: true,
    onSubmit: (data: TypeForm) => {
      const limitData: LimitType = {
        idCategory: data.idCategory,
        limitAmount: currencyToNumber(data.limitAmount),
        period: 'monthly'
      }

      if (action === 'create') {
        createLimit(limitData).then(
          (response) => {
            if (response) {
              setOpenModal(!openModal)
              getAll()
              notifySuccess('Limite criado com sucesso')
              return
            }

            notifyError('Algo deu errado ao criar limite')
          }
        )
      } else {
        const updatedLimit: LimitType = {
          ...limitData,
          id: objToAction?.id
        }

        updateLimit(updatedLimit).then(
          (response) => {
            if (response) {
              setOpenModal(!openModal)
              getAll()
              notifySuccess('Limite atualizado com sucesso')
              return
            }

            notifyError('Algo deu errado ao atualizar limite')
          }
        )
      }
    }
  })

  const getAll = useCallback(() => {
    getLimits().then(
      (response) => {
        const data = response ?? []
        setLimits(data)
      }
    )
  }, [getLimits])

  const { setFieldValue } = formik

  const loadCategories = useCallback(() => {
    getCategories().then(
      (response) => {
        const expenseCategories = response.filter(cat => cat.segment === DefaultsSegments.Expense)

        if (expenseCategories.length > 0) {
          setFieldValue('idCategory', expenseCategories[0].id)
        }

        setCategories(expenseCategories)
      }
    )
  }, [getCategories, openModal])

  const deleteLimit_ = useCallback(() => {
    deleteLimit(objToAction?.id ?? '').then(
      (response) => {
        if (response) {
          notifySuccess('Limite excluído')
          setConfirmOpen(false)
          setObjToAction(undefined)
          getAll()
          return
        }

        notifyError('Algo deu errado ao excluir limite')
      }
    )
  }, [deleteLimit, objToAction, getAll, notifyError, notifySuccess])

  const handleChangeSearch = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>): void => {
    const { value } = event.target
    const newFilter = { ...filter, term: value }
    setFilter(newFilter)

    debounceWait(() => {
      const filtered = limits.filter(limit =>
        limit.categoryName.toLowerCase().includes(value.toLowerCase())
      )
      setLimits(filtered)

      if (value === '') {
        getAll()
      }
    })
  }

  const handleNewLimit = (): void => {
    formik.resetForm()
    setAction('create')
    setObjToAction(undefined)
    setOpenModal(true)
  }

  const handleEditLimit = (obj: LimitWithCategoryType): void => {
    setAction('update')
    setObjToAction(obj)

    formik.setValues({
      idCategory: obj.idCategory,
      limitAmount: formatFormCurrency(obj.limitAmount)
    })
    setOpenModal(true)
  }

  const handleConfirmDelete = (obj: LimitWithCategoryType): void => {
    setObjToAction(obj)
    setConfirmOpen(true)
  }

  const handleCloseDelete = (): void => { setConfirmOpen(false) }

  const getProgressColor = (percentage: number): 'success' | 'warning' | 'error' => {
    if (percentage >= 100) return 'error'
    if (percentage >= 80) return 'warning'
    return 'success'
  }

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>, prop: string): void => {
    const { value } = event.target
    const numericValue = formatNumberInput(value)
    const formattedValue = formatFormCurrency(numericValue)
    formik.setFieldValue(prop, formattedValue)
  }

  useEffect(() => {
    getAll()
  }, [])

  useEffect(() => {
    loadCategories()
  }, [openModal])

  return (
    <ContainerMain title="Limites" fullCard={false}>
      <Box display="flex" flexGrow={0} justifyContent="end" mb={2}>
        <Paper fullWidth>
          <Box display="flex" flexWrap="wrap" gap={2} alignItems="center">
            <Box flexGrow={1}>
              <InputSearch placeholder="Procure por categoria" onChange={handleChangeSearch} />
            </Box>

            <Box>
              <AddButton label="Novo Limite" handleClick={handleNewLimit} />
            </Box>
          </Box>
        </Paper>
      </Box>

      <Box overflow="auto" flexGrow={1} pr={1}>
        {limits.length === 0 && (
          <Box pb={1} mb={2} textAlign="center">
            <Paper>
              <Typography variant="body2">Nenhum limite cadastrado</Typography>
            </Paper>
          </Box>
        )}

        {limits.map((item, index) => (
          <Box key={index} pb={1} mb={0.1}>
            <Paper grid>
              <Grid container display="flex" alignItems="center" spacing={2}>
                <Grid item xs={12} md={3}>
                  <Box display="flex" alignItems="center" gap={1}>
                    <BallColor color={item.categoryColor} size={SMALL_BALL_SIZE} />
                    <Typography variant="body2" fontWeight={500}>{item.categoryName}</Typography>
                  </Box>
                </Grid>

                <Grid item xs={12} md={2}>
                  <Box>
                    <Typography variant="body1" color="Gray">Limite</Typography>
                    <Typography variant="body2" fontWeight={500}>
                      {formatCurrencyString(item.limitAmount)}
                    </Typography>
                  </Box>
                </Grid>

                <Grid item xs={12} md={2}>
                  <Box>
                    <Typography variant="body1" color="Gray">Gasto Atual</Typography>
                    <Typography variant="body2" fontWeight={500} color={item.isExceeded ? 'error' : 'inherit'}>
                      {formatCurrencyString(item.currentSpending)}
                    </Typography>
                  </Box>
                </Grid>

                <Grid item xs={12} md={3}>
                  <Box>
                    <Box display="flex" justifyContent="space-between" mb={0.5}>
                      <Typography variant="caption">Progresso (mês atual)</Typography>
                      <Typography variant="caption" fontWeight={500}>
                        {item.percentageUsed.toFixed(0)}%
                      </Typography>
                    </Box>
                    <LinearProgress
                      variant="determinate"
                      value={Math.min(item.percentageUsed, 100)}
                      color={getProgressColor(item.percentageUsed)}
                    />
                  </Box>
                </Grid>

                <Grid item xs={12} md={2} display="flex" alignItems="flex-end" justifyContent="flex-end" gap={1}>
                  <Box>
                    <IconButton title="Editar" onClick={() => { handleEditLimit(item) }}>
                      <IconEdit />
                    </IconButton>
                  </Box>
                  <Box>
                    <IconButton title="Excluir" onClick={() => { handleConfirmDelete(item) }}>
                      <IconDelete />
                    </IconButton>
                  </Box>
                </Grid>
              </Grid>
            </Paper>
          </Box>
        ))}
      </Box>

      {confirmOpen && (
        <Dialog
          title="Excluir limite"
          open={confirmOpen}
          handleCloseConfirm={handleCloseDelete}
          handleDelete={deleteLimit_}
        >
          <Typography variant="body1" color="primary">
            Deseja realmente excluir o limite da categoria
            {' '}
            <b>{objToAction?.categoryName}</b>
            ?
          </Typography>
        </Dialog>
      )}

      <Modal title={action === 'create' ? 'Novo Limite' : 'Atualizar Limite'} open={openModal} handleClose={() => { setOpenModal(false) }}>
        <Box minWidth={downSM ? 0 : 600} maxWidth={900} mb={3}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <InputForm fullWidth title="Categoria*" helperText formik={formik} propField="idCategory">
                <Select
                  variant="outlined"
                  size="small"
                  {...formik.getFieldProps('idCategory')}
                  error={formik.touched.idCategory && !!formik.errors.idCategory}
                  IconComponent={IconArrowSelect}
                  disabled={action === 'update'}
                >
                  {categories.map((cat) => (
                    <MenuItem key={cat.id} value={cat.id}>
                      <Box display="flex" alignItems="center" gap={DEFAULT_GAP_IZE}>
                        <BallColor color={cat.color} size={SMALL_BALL_SIZE} />
                        <Box>
                          {cat.name}
                        </Box>
                      </Box>
                    </MenuItem>
                  ))}
                </Select>
              </InputForm>
            </Grid>

            <Grid item xs={12}>
              <InputForm fullWidth title="Valor do Limite*" helperText formik={formik} propField="limitAmount">
                <InputText
                  placeholder="Informe o valor do limite mensal"
                  inputProps={{ inputMode: 'numeric', pattern: '[0-9]*' }}
                  {...formik.getFieldProps('limitAmount')}
                  error={formik.touched.limitAmount && !!formik.errors.limitAmount}
                  value={formik.values.limitAmount}
                  onChange={(event: React.ChangeEvent<HTMLInputElement>) => { handleChange(event, 'limitAmount') }}
                />
              </InputForm>
            </Grid>
          </Grid>
        </Box>

        <Divider />

        <Box display="flex" alignItems="center" justifyContent="end" gap={1} mt={2}>
          <Button variant="outlined" color="primary" onClick={() => { setOpenModal(false) }}>
            Cancelar
          </Button>
          <Button variant="contained" color="primary" onClick={() => formik.submitForm()}>
            Salvar
          </Button>
        </Box>
      </Modal>
    </ContainerMain>
  )
}

export default Limits
