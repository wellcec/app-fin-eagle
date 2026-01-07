import React, { useCallback, useEffect, useState } from 'react'
import { Box, Button, Divider, Grid, Hidden, IconButton, MenuItem, Select, Theme, Typography, useMediaQuery } from '@mui/material'
import StarIcon from '@mui/icons-material/Star'
import * as Yup from 'yup'

import ContainerMain from '~/components/layout/ContainerMain'
import Paper from '~/components/layout/Paper'
import InputSearch from '~/components/atoms/inputs/InputSearch'
import { ACTIONS, ActionsType, SampleFilterType } from '~/models'
import DEFAULT_PAGESIZE, { DEFAULT_GAP_IZE, DefaultsSegments, MEDIUM_BALL_SIZE, Segments, SMALL_BALL_SIZE } from '~/constants'
import useDebounce from '~/shared/hooks/useDebounce'
import categoriesRepository from '~/client/repository/categoriesRepository'
import { CategoryType } from '~/client/models/categories'
import useAlerts from '~/shared/alerts/useAlerts'
import { IconDelete, IconDoubleArrowDown } from '~/constants/icons'
import Modal from '~/components/molecules/Modal'
import InputForm from '~/components/atoms/inputs/InputForm'
import InputText from '~/components/atoms/inputs/InputText'
import { useFormik } from 'formik'
import { PREENCHIMENTO_OBRIGATORIO } from '~/constants/messages'
import InputColor from '~/components/atoms/inputs/InputColor'
import Dialog from '~/components/molecules/Dialog'
import BallColor from '~/components/atoms/BallColor'
import { SegmentTransactionType } from '~/client/models/transactions'
import Chip from '~/components/atoms/Chip'
import transactionsRepository from '~/client/repository/transactionsRepository'
import CheckBoxGoal from '~/components/atoms/inputs/CheckBoxGoal'
import useUtils from '~/shared/hooks/useUtils'
import colors from '~/layout/theme/colors'
import AddButton from '~/components/atoms/buttons/AddButton'
import { Titles } from '~/constants/menus'

const IconArrowSelect = (): React.JSX.Element => {
  return <Box mr={1} mt={0.5}><IconDoubleArrowDown /></Box>
}

interface TypeForm {
  name: string
  type: SegmentTransactionType
  isGoal: number
  valueGoal: string
}

const DEFAULT_VALUES: TypeForm = {
  name: '',
  type: DefaultsSegments.Receive,
  isGoal: 0,
  valueGoal: ''
}

const emptyFilter: SampleFilterType = {
  term: '',
  page: 1,
  pageSize: DEFAULT_PAGESIZE
}

const Categories = (): React.JSX.Element => {
  const [action, setAction] = useState<ActionsType>(ACTIONS.create)
  const [filter, setFilter] = useState<SampleFilterType>(emptyFilter)
  const [categories, setCategories] = useState<CategoryType[]>([])
  const [openModal, setOpenModal] = useState<boolean>(false)
  const [color, setColor] = useState<string>('#fff')
  const [objToAction, setObjToAction] = useState<CategoryType>()
  const [confirmOpen, setConfirmOpen] = useState<boolean>(false)

  const downSM = useMediaQuery((theme: Theme) => theme.breakpoints.down('sm'))
  const { debounceWait } = useDebounce()
  const { getCategories, createCategory, deleteCategory } = categoriesRepository()
  const { transactionByCategory } = transactionsRepository()
  const { notifyError, notifySuccess, notifyWarning } = useAlerts()
  const { formatNumberInput, formatFormCurrency, formatCurrencyRequest, formatCurrencyString } = useUtils()

  const formik = useFormik({
    initialValues: DEFAULT_VALUES,
    validationSchema: Yup.object({
      name: Yup.string().required(PREENCHIMENTO_OBRIGATORIO),
      type: Yup.string().required(PREENCHIMENTO_OBRIGATORIO),
      isGoal: Yup.number().notRequired(),
      valueGoal: Yup.string().when('isGoal', ([isGoal], schema) => {
        if (isGoal === 1) {
          return schema.required('Valor da meta é obrigatório');
        }
        return schema.notRequired();
      })
    }),
    validateOnBlur: true,
    validateOnChange: true,
    onSubmit: (data: TypeForm) => {
      const newCategory: CategoryType = {
        name: data.name,
        segment: data.type,
        color,
        isGoal: data.isGoal,
        valueGoal: data.isGoal === 1 ? formatCurrencyRequest(data.valueGoal) : 0
      }

      createCategory(newCategory).then(
        (response) => {
          if (response) {
            setOpenModal(!openModal)
            getAll()
            notifySuccess('Categoria criada')
            return
          }

          notifyError('Algo deu errado ao criar categoria')
        }
      )
    }
  })

  const getAll = useCallback((newFilter?: SampleFilterType) => {
    getCategories(newFilter?.term ?? '').then(
      (response) => {
        const data = response ?? []
        setCategories(data)
      }
    )
  }, [getCategories, notifyError, filter])

  const deleteCat = useCallback(() => {
    transactionByCategory(objToAction?.id).then(
      (response) => {
        if (response > 0) {
          setConfirmOpen(false)
          notifyWarning(`Não foi possível excluir a categoria pois existem transações com a categoria ${objToAction?.name}`)
          return
        }

        deleteCategory(objToAction?.id ?? '').then(
          (response) => {
            if (response) {
              notifySuccess('Categoria excluída')
              setConfirmOpen(false)
              setObjToAction(undefined)
              getAll()

              return
            }

            notifyError('Algo deu errado ao excluir categoria')
          }
        )
      }
    )
  }, [deleteCategory, objToAction, getAll, notifyError, notifySuccess, notifyWarning])

  const handleChangeSearch = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>): void => {
    const { value } = event.target
    const newFilter = { ...filter, term: value }
    setFilter(newFilter)

    debounceWait(() => { getAll(newFilter) })
  }

  const handleChangeColor = (value: string): void => {
    setColor(value)
  }

  const handleNewCategory = (): void => {
    formik.resetForm()
    setAction('create')
    setOpenModal(true)
  }

  const handleConfirmDelete = (obj: CategoryType): void => {
    setObjToAction(obj)
    setConfirmOpen(true)
  }

  const handleCloseDelete = (): void => { setConfirmOpen(false) }

  const handleChangeStatus = (checked: boolean): void => {
    formik.setFieldValue('isGoal', checked ? 1 : 0)
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

  return (
    <ContainerMain title={Titles.CATEGORIES} fullCard={false}>
      <Box display="flex" flexGrow={0} justifyContent="end" mb={2}>
        <Paper fullWidth>
          <Box display="flex" flexWrap="wrap" gap={2} alignItems="center">
            <Box flexGrow={1}>
              <InputSearch placeholder="Procure por nome ou tipo" onChange={handleChangeSearch} />
            </Box>

            <Box>
              <AddButton label="Nova categoria" handleClick={handleNewCategory} />
            </Box>
          </Box>
        </Paper>
      </Box>

      <Box overflow="auto" flexGrow={1} pr={1}>
        {categories.length === 0 && (
          <Box pb={1} mb={2} textAlign="center">
            <Paper>
              <Typography variant="body2">Nenhuma categoria cadastrada</Typography>
            </Paper>
          </Box>
        )}

        {categories.map((item, index) => (
          <Box key={index} pb={1} mb={0.1}>
            <Paper grid>
              <Grid container display="flex" alignItems="center">
                <Grid item xs={2}>
                  <Typography variant="body2">{item.name}</Typography>
                </Grid>

                <Grid item xs={1} display="flex" flexWrap="wrap" gap={2}>
                  <BallColor color={item.color} size={SMALL_BALL_SIZE} />
                </Grid>

                <Grid item xs={2} display="flex" flexWrap="wrap" gap={2}>
                  <Chip
                    label={Segments[item.segment].title}
                    color={Segments[item.segment].color}
                  />
                </Grid>

                <Grid item xs={4}>
                  {item.isGoal === 1 && (
                    <Box display="flex" alignItems="end" gap={1}>
                      <StarIcon htmlColor={colors.danger.main} />
                      <Typography variant="body1">{formatCurrencyString(item.valueGoal ?? 0)}</Typography>
                    </Box>
                  )}
                </Grid>

                <Grid item xs={12} md={3} display="flex" alignItems="flex-end" justifyContent="flex-end" gap={1}>
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
          title="Excluir categoria"
          open={confirmOpen}
          handleCloseConfirm={handleCloseDelete}
          handleDelete={deleteCat}
        >
          <Typography variant="body1" color="primary">
            Deseja realmente excluir a categoria
            {' '}
            <b>{objToAction?.name}</b>
            ?
          </Typography>
        </Dialog>
      )}

      <Modal title={action === 'create' ? 'Nova Categoria' : 'Atualizar Categoria'} open={openModal} handleClose={() => { setOpenModal(false) }}>
        <Box minWidth={downSM ? 0 : 600} maxWidth={900} mb={3}>
          <Grid container>
            <Grid item xs={12} sm={6}>
              <Box display="flex" flexDirection="column">
                <Box mb={2}>
                  <InputForm fullWidth title="Título*" helperText formik={formik} propField="name">
                    <InputText
                      placeholder="Informe um nome"
                      {...formik.getFieldProps('name')}
                      error={formik.touched.name && !!formik.errors.name}
                    />
                  </InputForm>
                </Box>

                <Box mb={2}>
                  <InputForm fullWidth title="Tipo*" helperText formik={formik} propField="type">
                    <Select
                      variant="outlined"
                      size="small"
                      {...formik.getFieldProps('type')}
                      error={formik.touched.type && !!formik.errors.type}
                      IconComponent={IconArrowSelect}
                    >
                      <MenuItem value="Receita">
                        <Box display="flex" alignItems="center" gap={DEFAULT_GAP_IZE}>
                          <BallColor color={Segments.Receita.color} size={MEDIUM_BALL_SIZE} />
                          <Box>
                            Receita
                          </Box>
                        </Box>
                      </MenuItem>

                      <MenuItem value="Despesa">
                        <Box display="flex" alignItems="center" gap={DEFAULT_GAP_IZE}>
                          <BallColor color={Segments.Despesa.color} size={MEDIUM_BALL_SIZE} />
                          <Box>
                            Despesa
                          </Box>
                        </Box>
                      </MenuItem>
                    </Select>
                  </InputForm>
                </Box>

                {formik.values.type === DefaultsSegments.Expense && (
                  <Box mb={2}>
                    <CheckBoxGoal
                      checked={formik.values.isGoal === 1}
                      onChange={(_, checked) => { handleChangeStatus(checked) }}
                    />
                  </Box>
                )}

                {formik.values.isGoal === 1 && (
                  <Box>
                    <InputForm fullWidth title="Quanto*" helperText formik={formik} propField="valueGoal">
                      <InputText
                        placeholder="Informe um valor"
                        inputProps={{ inputMode: 'numeric', pattern: '[0-9]*' }}
                        {...formik.getFieldProps('valueGoal')}
                        error={formik.touched.valueGoal && !!formik.errors.valueGoal}
                        value={formik.values.valueGoal}
                        onChange={(event: React.ChangeEvent<HTMLInputElement>) => { handleChange(event, 'valueGoal') }}
                      />
                    </InputForm>
                  </Box>
                )}
              </Box>
            </Grid>

            <Hidden smDown>
              <Grid item display="flex" justifyContent="center" xs={1}>
                <Divider orientation="vertical" />
              </Grid>
            </Hidden>

            <Grid item xs={12} sm={5}>
              <Box display="flex" justifyContent="center" alignItems="center" textAlign="center" height={1}>
                <InputForm fullWidth title="Cor correspondente" propField="name">
                  <InputColor onChange={handleChangeColor} />
                </InputForm>
              </Box>
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

export default Categories
