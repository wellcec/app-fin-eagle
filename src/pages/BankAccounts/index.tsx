import React, { useCallback, useEffect, useState } from 'react'
import { Box, Button, Divider, IconButton, Stack, Theme, Typography, useMediaQuery } from '@mui/material'

import * as Yup from 'yup'

import ContainerMain from '~/components/layout/ContainerMain'
import Paper from '~/components/layout/Paper'
import InputSearch from '~/components/atoms/inputs/InputSearch'
import { SampleFilterType } from '~/models'
import DEFAULT_PAGESIZE, { Segments } from '~/constants'
import useDebounce from '~/shared/hooks/useDebounce'
import useAlerts from '~/shared/alerts/useAlerts'
import Modal from '~/components/molecules/Modal'
import InputForm from '~/components/atoms/inputs/InputForm'
import InputText from '~/components/atoms/inputs/InputText'
import { useFormik } from 'formik'
import { PREENCHIMENTO_OBRIGATORIO } from '~/constants/messages'
import InputColor from '~/components/atoms/inputs/InputColor'
import Dialog from '~/components/molecules/Dialog'
import Chip from '~/components/atoms/Chip'
import transactionsRepository from '~/client/repository/transactionsRepository'
import AdditionButton from '~/components/atoms/buttons/AdditionButton'
import { Titles } from '~/constants/menus'
import bankAccountsRepository from '~/client/repository/bankAccountsRepository'
import { BankAccountType } from '~/client/models/bankAccounts'
import { Icon } from '~/components/atoms/icons'
import useUtils from '~/shared/hooks/useUtils'

interface TypeForm {
  name: string
}

const DEFAULT_VALUES: TypeForm = {
  name: ''
}

const emptyFilter: SampleFilterType = {
  term: '',
  page: 1,
  pageSize: DEFAULT_PAGESIZE
}

const BankAccounts = (): React.JSX.Element => {
  const [filter, setFilter] = useState<SampleFilterType>(emptyFilter)
  const [bankAccounts, setBankAccounts] = useState<BankAccountType[]>([])
  const [openModal, setOpenModal] = useState<boolean>(false)
  const [color, setColor] = useState<string>('#259db3')
  const [objToAction, setObjToAction] = useState<BankAccountType>()
  const [confirmOpen, setConfirmOpen] = useState<boolean>(false)

  const downSM = useMediaQuery((theme: Theme) => theme.breakpoints.down('sm'))

  const { debounceWait } = useDebounce()
  const { getAccounts, createAccount, deleteAccount } = bankAccountsRepository()
  const { transactionByBankAccount } = transactionsRepository()
  const { notifyError, notifySuccess, notifyWarning } = useAlerts()
  const { formatCurrencyString } = useUtils()

  const formik = useFormik({
    initialValues: DEFAULT_VALUES,
    validationSchema: Yup.object({
      name: Yup.string().required(PREENCHIMENTO_OBRIGATORIO),
    }),
    validateOnBlur: true,
    validateOnChange: true,
    onSubmit: (data: TypeForm) => {
      const newBankAccount: BankAccountType = {
        name: data.name,
        color
      }

      createAccount(newBankAccount).then(
        (response) => {
          if (response) {
            setOpenModal(!openModal)
            getAll()
            notifySuccess('Conta de banco criada com sucesso')
            return
          }

          notifyError('Algo deu errado ao criar uma conta de banco')
        }
      )
    }
  })

  const getAll = useCallback((newFilter?: SampleFilterType) => {
    getAccounts(newFilter?.term ?? '').then(
      (response) => {
        const data = response ?? []
        setBankAccounts(data)
      }
    )
  }, [getAccounts, notifyError, filter])

  const deleteBankAccount = useCallback(() => {
    transactionByBankAccount(objToAction?.id ?? '').then(
      (response) => {
        if (response > 0) {
          setConfirmOpen(false)
          notifyWarning(`Não foi possível excluir pois existem transações com a conta ${objToAction?.name}`)
          return
        }

        deleteAccount(objToAction?.id ?? '').then(
          (response) => {
            if (response) {
              notifySuccess('Conta de banco excluída')
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
  }, [deleteAccount, objToAction, getAll, notifyError, notifySuccess, notifyWarning])

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
    setOpenModal(true)
  }

  const handleConfirmDelete = (obj: BankAccountType): void => {
    setObjToAction(obj)
    setConfirmOpen(true)
  }

  const handleCloseDelete = (): void => { setConfirmOpen(false) }

  useEffect(() => {
    getAll()
  }, [])

  return (
    <ContainerMain title={Titles.BANKACOUNTS} fullCard={false}>
      <Box display="flex" flexGrow={0} justifyContent="end" mb={2}>
        <Paper fullWidth>
          <Box display="flex" flexWrap="wrap" gap={2} alignItems="center">
            <Box flexGrow={1}>
              <InputSearch placeholder="Procure por nome" onChange={handleChangeSearch} />
            </Box>

            <Box>
              <AdditionButton label="Nova conta" handleClick={handleNewCategory} />
            </Box>
          </Box>
        </Paper>
      </Box>

      <Box overflow="auto" flexGrow={1} pr={1}>
        {bankAccounts.length === 0 && (
          <Box pb={1} mb={2} textAlign="center">
            <Paper>
              <Typography variant="body2">Nenhuma conta de banco cadastrada</Typography>
            </Paper>
          </Box>
        )}

        <Box display="flex" gap={2} flexWrap="wrap">
          {bankAccounts.map((item, index) => (
            <Box key={index} pb={1} mb={0.1} minWidth={250}>
              <Paper>
                <Stack display="flex" flexDirection="column" gap={2}>
                  <Box display="flex" justifyContent="space-between">
                    <Box>
                      <Typography variant="subtitle1">{item.name}</Typography>

                      <Box>
                        <Typography variant="h6" component="div" color={(item.totalValue ?? 0) > 0 ? Segments.Receita.color : Segments.Despesa.color}>
                          {(item.totalValue ?? 0) >= 0 && '+'}
                          {formatCurrencyString((item.totalValue ?? 0))}
                        </Typography>
                      </Box>
                    </Box>

                    <Box>
                      <IconButton title="Excluir" onClick={() => { handleConfirmDelete(item) }}>
                        <Icon name="delete" />
                      </IconButton>
                    </Box>
                  </Box>

                  <Stack>
                    <Chip color={item.color} fullWidth />
                  </Stack>
                </Stack>
              </Paper>
            </Box>
          ))}
        </Box>
      </Box>

      {confirmOpen && (
        <Dialog
          title="Excluir conta"
          open={confirmOpen}
          handleCloseConfirm={handleCloseDelete}
          handleDelete={deleteBankAccount}
        >
          <Typography variant="body1" color="primary">
            Deseja realmente excluir essa conta de banco
            {' '}
            <b>{objToAction?.name}</b>
            ?
          </Typography>
        </Dialog>
      )}

      <Modal title="Nova conta" open={openModal} handleClose={() => { setOpenModal(false) }}>
        <Box minWidth={downSM ? 0 : 600} mb={3}>
          <Box display="flex" gap={1}>
            <Box display="flex" flexDirection="column" width={360}>
              <Box mb={2}>
                <InputForm fullWidth title="Título*" helperText formik={formik} propField="name">
                  <InputText
                    placeholder="Informe um nome"
                    {...formik.getFieldProps('name')}
                    error={formik.touched.name && !!formik.errors.name}
                  />
                </InputForm>
              </Box>
            </Box>

            <Box display="flex" justifyContent="center" width={35}>
              <Divider orientation="vertical" />
            </Box>

            <Box display="flex" justifyContent="center" alignItems="center" textAlign="center" height={1} flex="1">
              <InputForm fullWidth title="Cor correspondente" propField="name">
                <InputColor onChange={handleChangeColor} />
              </InputForm>
            </Box>
          </Box>
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

export default BankAccounts
