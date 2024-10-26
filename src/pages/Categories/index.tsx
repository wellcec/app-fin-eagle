import React, { useCallback, useEffect, useState } from 'react'
import { Box, Button, Divider, Grid, Hidden, IconButton, MenuItem, Select, Theme, Typography, useMediaQuery } from '@mui/material'
import AddIcon from '@mui/icons-material/Add'
import * as Yup from 'yup'

import ContainerMain from '~/components/layout/ContainerMain'
import Paper from '~/components/layout/Paper'
import InputSearch from '~/components/atoms/inputs/InputSearch'
import { ACTIONS, ActionsType, SampleFilterType } from '~/models'
import DEFAULT_PAGESIZE, { DEFAULT_GAP_IZE, MEDIUM_BALL_SIZE, Segments, SMALL_BALL_SIZE } from '~/constants'
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

const IconArrowSelect = (): React.JSX.Element => {
  return <Box mr={1} mt={0.5}><IconDoubleArrowDown /></Box>
}

interface TypeForm {
  name: string
  type: SegmentTransactionType
}

const DEFAULT_VALUES: TypeForm = {
  name: '',
  type: 'Receita'
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

  const formik = useFormik({
    initialValues: DEFAULT_VALUES,
    validationSchema: Yup.object({
      name: Yup.string().required(PREENCHIMENTO_OBRIGATORIO),
      type: Yup.string().required(PREENCHIMENTO_OBRIGATORIO)
    }),
    validateOnBlur: true,
    validateOnChange: true,
    onSubmit: (data: TypeForm) => {
      const newCategory: CategoryType = {
        name: data.name,
        segment: data.type,
        color
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

  useEffect(() => {
    getAll()
  }, [])

  return (
    <ContainerMain title="Categorias" fullCard={false}>
      <Box display="flex" flexGrow={0} justifyContent="end" mb={2}>
        <Paper fullWidth>
          <Box display="flex" flexWrap="wrap" gap={2} alignItems="center">
            <Box flexGrow={1}>
              <InputSearch placeholder="Procure por nome ou tipo" onChange={handleChangeSearch} />
            </Box>

            <Box>
              <Button variant="contained" color="success" onClick={handleNewCategory}>
                <Box display="flex" alignItems="center" gap={1}>
                  <Box>
                    <AddIcon />
                  </Box>

                  <Box>
                    Nova Categoria
                  </Box>
                </Box>
              </Button>
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

                <Grid item xs={2} display="flex" flexWrap="wrap" gap={2}>
                  <BallColor color={item.color} size={SMALL_BALL_SIZE} />
                </Grid>

                <Grid item xs={5} display="flex" flexWrap="wrap" gap={2}>
                  <Chip
                    label={Segments[item.segment].title}
                    color={Segments[item.segment].color}
                  />
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

                <Box>
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
