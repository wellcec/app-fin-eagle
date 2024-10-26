import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { getDaysInMonth, format, startOfMonth, addMonths, subMonths, endOfMonth } from 'date-fns'
import { blue } from '@mui/material/colors'
import AddIcon from '@mui/icons-material/Add'
import RadioButtonUncheckedIcon from '@mui/icons-material/RadioButtonUnchecked'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import { Avatar, Box, Button, Checkbox, Divider, Drawer, FormControlLabel, FormGroup, IconButton, MenuItem, Select, Theme, Typography, Paper as PaperMui } from '@mui/material'
import makeStyles from '@mui/styles/makeStyles'

import ContainerMain from '~/components/layout/ContainerMain'
import { DAYS_WEEK, DEFAULT_GAP_IZE, LABEL_MONTHS, MEDIUM_BALL_SIZE, Segments } from '~/constants'
import Paper from '~/components/layout/Paper'
import { IconDelete, IconDoubleArrowDown, IconSingleArrowLeftCircule, IconSingleArrowRightCircule } from '~/constants/icons'
import InputForm from '~/components/atoms/inputs/InputForm'
import BallColor from '~/components/atoms/BallColor'
import { SegmentTransactionType } from '~/client/models/transactions'
import InputText from '~/components/atoms/inputs/InputText'
import { ScheduleType } from '~/client/models/schedules'
import schedulesRepository from '~/client/repository/schedulesRepository'
import useAlerts from '~/shared/alerts/useAlerts'
import ViewCalendarType from '~/models/schedules'

const ICON_SIZE = 25

const IconArrowSelect = (): React.JSX.Element => {
  return <Box mr={1} mt={0.5}><IconDoubleArrowDown /></Box>
}

const useStyles = makeStyles((theme: Theme) => ({
  buttonDay: {
    maxHeight: 100,
    marginRight: 10,
    marginBottom: 10
  },
  buttonDayDecoration: {
    border: `1px solid ${theme.palette.grey[300]}`
  },
  boxList: {
    '& .item': {
      width: 'calc((100% / 7) - 10px)'
    }
  },
  boxDaySize: {
    height: 100,
    width: 100
  },
  boxDayWeek: {
    width: 100,
    paddingBottom: 3
  },
  boxDayWeekend: {
    backgroundColor: 'cornflowerblue',
    color: 'white',
    borderRadius: 10
  },
  boxDate: {
    marginLeft: 16,
    marginRight: 16,
    marginTop: 12,
    width: '100%',
    height: '100%',
    textAlign: 'start'
  },
  boxSchedulesDetails: {
    borderRadius: 8
  },
  currentDay: {
    border: '2px solid cornflowerblue',
    '& h6': {
      color: 'cornflowerblue'
    }
  },
  paperSelectMonth: {
    width: '100%',
    padding: 5
  }
}))

const Schedules = (): React.JSX.Element => {
  const [currentDate, setCurrentDate] = useState<Date>(new Date())
  const [currentMonth, setCurrentMonth] = useState<number>(0)
  const [currentYear, setCurrentYear] = useState<number>(1990)
  const [currentListDays, setCurrentListDays] = useState<number[]>([])
  const [loopFirstDayPosition, setLoopFirstDayPosition] = useState<number>(0)

  const [schedulesForDay, setSchedulesForDay] = useState<ScheduleType[]>([])
  const [viewCalendar, setViewCalendar] = useState<ViewCalendarType[]>([])
  const [chooseDay, setChooseDay] = useState<number>(1)
  const [showForm, setShowForm] = useState<boolean>(false)
  const [segment, setSegment] = useState<SegmentTransactionType>('Lembrete')
  const [description, setDescription] = useState<string>('')
  const [isRecurrent, setIsRecurrent] = useState<boolean>(false)

  const styles = useStyles()
  const { getSchedulesByDay, getSchedulesByRange, createSchedule, deleteSchedule } = schedulesRepository()
  const { notifyWarning, notifyError, notifySuccess } = useAlerts()

  const nowDayAsNumber = (day: number): boolean => {
    const now = new Date()
    const nowDay = now.getDate()
    const nowMonth = now.getMonth()
    const nowYear = now.getFullYear()

    const month = currentDate.getMonth()
    const year = currentDate.getFullYear()

    return (day === nowDay && nowMonth === month && nowYear === year)
  }

  const buildViewCalendar = (data: ScheduleType[]): void => {
    const dataToDisplay: ViewCalendarType[] = []

    for (const schedule of data) {
      const strDate = schedule.date?.toString() + 'T00:00:00Z'
      const dateOfSchedule = new Date(strDate)
      const dayAsNumber = (dateOfSchedule.getUTCDate() ?? 0)

      const isExpense = schedule.segment === 'Despesa'
      const isReceived = schedule.segment === 'Receita'
      const isReminder = schedule.segment === 'Lembrete'

      const dayFromList = dataToDisplay.find((d) => d.day === dayAsNumber)
      if (!dayFromList) {
        dataToDisplay.push({
          day: dayAsNumber,
          expenses: isExpense || (isExpense && schedule.isRecurrent === 1) ? 1 : 0,
          received: isReceived || (isReceived && schedule.isRecurrent === 1) ? 1 : 0,
          reminders: isReminder || (isReminder && schedule.isRecurrent === 1) ? 1 : 0
        })
      } else {
        const index = dataToDisplay.indexOf(dayFromList)
        dataToDisplay[index].expenses = isExpense ? dataToDisplay[index].expenses + 1 : dataToDisplay[index].expenses
        dataToDisplay[index].received = isReceived ? dataToDisplay[index].received + 1 : dataToDisplay[index].received
        dataToDisplay[index].reminders = isReminder ? dataToDisplay[index].reminders + 1 : dataToDisplay[index].reminders
      }
    }

    setViewCalendar(dataToDisplay)
  }

  const getViewCalendar = (day: number, type: SegmentTransactionType): number => {
    const view = viewCalendar.find((v) => v.day === day)
    if (type === 'Despesa') {
      return view?.expenses ?? 0
    }

    if (type === 'Receita') {
      return view?.received ?? 0
    }

    if (type === 'Lembrete') {
      return view?.reminders ?? 0
    }

    return 0
  }

  const getCurrentDate = useCallback(() => {
    const month = currentDate.getMonth()
    const year = currentDate.getFullYear()
    const daysInMonth = getDaysInMonth(currentDate)
    const startMonth = startOfMonth(currentDate)
    const endMonth = endOfMonth(currentDate)
    const listDays = Array.from({ length: daysInMonth }, (_, i) => i + 1)

    const nameDayWeek = format(startMonth, 'EEEE')
    const dayWeek = DAYS_WEEK.find((d) => d.eng === nameDayWeek)

    if (dayWeek) {
      const dayWeekIndex = DAYS_WEEK.indexOf(dayWeek)
      setLoopFirstDayPosition(dayWeekIndex)
    }

    setCurrentMonth(month)
    setCurrentYear(year)
    setCurrentListDays(listDays)

    getSchedulesByRange(startMonth, endMonth).then(
      (response) => {
        buildViewCalendar(response.data)
      }
    )
  }, [currentDate])

  const getSchedulesForDay = (): void => {
    const dateToSearch = new Date(currentYear, currentMonth, chooseDay)

    getSchedulesByDay(dateToSearch).then(
      (response) => {
        setSchedulesForDay(response.data)
      }
    )
  }

  const handlePreviousMonth = (): void => {
    const startMonth = startOfMonth(currentDate)
    const newDate = subMonths(startMonth, 1)

    setViewCalendar([])
    setCurrentDate(newDate)
  }

  const handleNextMonth = (): void => {
    const startMonth = startOfMonth(currentDate)
    const newDate = addMonths(startMonth, 1)

    setViewCalendar([])
    setCurrentDate(newDate)
  }

  const emptyInitMonthComponents = useMemo(() => Array.from({ length: loopFirstDayPosition }, (_, index) => (
    <Button key={`button-day-empy-${index}`} className={`item ${styles.buttonDay} ${styles.boxDaySize}`}>
      <Box className={styles.boxDaySize} />
    </Button>
  )), [loopFirstDayPosition])

  const toggleDrawer =
    (open: boolean) =>
      (event: React.KeyboardEvent | React.MouseEvent) => {
        if (
          event.type === 'keydown' &&
          ((event as React.KeyboardEvent).key === 'Tab' ||
            (event as React.KeyboardEvent).key === 'Shift')
        ) {
          return
        }

        setShowForm(open)
      }

  const handleInitForm = (item: number): void => {
    const dateToSearch = new Date(currentYear, currentMonth, item)
    getSchedulesByDay(dateToSearch).then(
      (response) => {
        setIsRecurrent(false)
        setDescription('')
        setSchedulesForDay(response.data)
        setChooseDay(item)
        setShowForm(!showForm)
      }
    )
  }

  const handleSaveSchedule = (): void => {
    const dateToSave = new Date(currentYear, currentMonth, chooseDay)

    if (description === '') {
      notifyWarning('Uma descrição deve ser informada')
      return
    }

    const newSchedule: ScheduleType = {
      description,
      date: dateToSave,
      segment,
      isRecurrent: isRecurrent ? 1 : 0
    }

    createSchedule(newSchedule).then(
      (response) => {
        if (response) {
          notifySuccess('Agendamento adicionando ao dia ' + chooseDay)
          setDescription('')
          getSchedulesForDay()
          getCurrentDate()
          return
        }

        notifyError('Algo deu errado ao adicionar agendamento')
      }
    )
  }

  const handleDeleteSchedule = (id: string): void => {
    deleteSchedule(id).then(
      (response) => {
        if (response) {
          getSchedulesForDay()
          getCurrentDate()
          return
        }

        notifyError('Algo deu errado ao excluir agendamento')
      }
    )
  }

  useEffect(() => {
    getCurrentDate()
  }, [currentDate])

  return (
    <>
      <ContainerMain title="Agendamentos" fullCard={false}>
        <Box display="flex" flexGrow={0} justifyContent="end" mb={2}>
          <PaperMui className={styles.paperSelectMonth}>
            <Box display="flex" flexWrap="wrap" gap={2} alignItems="center" justifyContent="space-around">
              <Box>
                <IconButton onClick={handlePreviousMonth}>
                  <IconSingleArrowLeftCircule size={ICON_SIZE} />
                </IconButton>
              </Box>

              <Box>
                <Typography variant="h6">
                  {LABEL_MONTHS[currentMonth]}/{currentYear}
                </Typography>
              </Box>

              <Box>
                <IconButton onClick={handleNextMonth}>
                  <IconSingleArrowRightCircule size={ICON_SIZE} />
                </IconButton>
              </Box>
            </Box>
          </PaperMui>
        </Box>

        <Paper>
          <Box overflow="auto" flexGrow={1} pr={1}>
            <Box display="flex" textAlign="center" className={styles.boxList}>
              {DAYS_WEEK.map((item, index) => (
                <Box
                  key={`button-day-name-${index}`}
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                  className={`item ${styles.buttonDay} ${styles.boxDayWeek} ${(index === 0 || index === 6) && styles.boxDayWeekend}`}
                >
                  {item.pt}
                </Box>
              ))}
            </Box>

            <Box display="flex" flexWrap="wrap" className={styles.boxList}>
              {currentListDays.map((item, index) => (
                <>
                  {(index === 0) && (
                    <>
                      {emptyInitMonthComponents}
                    </>
                  )}

                  <Button
                    key={`button-day-${index}`}
                    onClick={() => { handleInitForm(item) }}
                    className={`item ${styles.buttonDay} ${styles.boxDaySize} ${styles.buttonDayDecoration} ${nowDayAsNumber(item) && styles.currentDay}`}
                  >
                    <Box className={styles.boxDate}>
                      <Typography variant="h6">
                        {item}
                      </Typography>

                      <Box display="flex" gap={1.3} justifyContent="flex-end">
                        {getViewCalendar(item, 'Receita') >= 1 && (
                          <BallColor label={getViewCalendar(item, 'Receita').toString()} color={Segments.Receita.color} size={30} />
                        )}

                        {getViewCalendar(item, 'Despesa') >= 1 && (
                          <BallColor label={getViewCalendar(item, 'Despesa').toString()} color={Segments.Despesa.color} size={30} />
                        )}

                        {getViewCalendar(item, 'Lembrete') >= 1 && (
                          <BallColor label={getViewCalendar(item, 'Lembrete').toString()} color={Segments.Lembrete.color} size={30} />
                        )}
                      </Box>
                    </Box>
                  </Button>
                </>
              ))}
            </Box>
          </Box>
        </Paper>
      </ContainerMain>

      <Drawer
        elevation={2}
        anchor="right"
        open={showForm}
        onClose={toggleDrawer(!showForm)}
      >
        <Box p={4} width={400}>
          <Box>
            <Typography variant="h6" color="text.main" display="flex" justifyContent="center" alignItems="center">
              O que fazer dia
              <Box m={2}>
                <Avatar sx={{ bgcolor: blue.A700 }}>{chooseDay}</Avatar>
              </Box>
              ?
            </Typography>
          </Box>

          <Box flex={1} mb={1}>
            <InputForm fullWidth title="Lembrar de">
              <Select
                variant="outlined"
                size="small"
                value={segment}
                onChange={(event) => { setSegment(event.target.value as SegmentTransactionType) }}
                IconComponent={IconArrowSelect}
              >
                <MenuItem value="Lembrete">
                  <Box display="flex" alignItems="center" gap={DEFAULT_GAP_IZE}>
                    <BallColor color={Segments.Lembrete.color} size={MEDIUM_BALL_SIZE} />
                    <Box>
                      Lembrete
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

                <MenuItem value="Receita">
                  <Box display="flex" alignItems="center" gap={DEFAULT_GAP_IZE}>
                    <BallColor color={Segments.Receita.color} size={MEDIUM_BALL_SIZE} />
                    <Box>
                      Receita
                    </Box>
                  </Box>
                </MenuItem>
              </Select>
            </InputForm>
          </Box>

          <Box mb={1}>
            <InputForm fullWidth title="Sobre" propField="description">
              <InputText
                multiline
                placeholder="Informe uma descrição"
                value={description}
                onChange={(event: React.ChangeEvent<HTMLInputElement>) => { setDescription(event.target.value) }}
              />
            </InputForm>
          </Box>

          <Box display="flex" justifyContent="end" mb={2}>
            <Box>
              <FormGroup>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={isRecurrent}
                      onChange={(event) => { setIsRecurrent(event.target.checked) }}
                      icon={<RadioButtonUncheckedIcon />}
                      checkedIcon={<CheckCircleIcon color="primary" />}
                    />
                  }
                  label="É recorrente?"
                />
              </FormGroup>
            </Box>

            <Button variant="contained" color="success" onClick={handleSaveSchedule}>
              <Box display="flex" alignItems="center" gap={1}>
                <Box>
                  <AddIcon />
                </Box>

                <Box>
                  Salvar
                </Box>
              </Box>
            </Button>
          </Box>

          <Divider />

          <Box mt={2}>
            {schedulesForDay.map((item, index) => (
              <Box
                my={1}
                p={1}
                key={`schedulesForDay-${index}`}
                className={styles.boxSchedulesDetails}
                sx={{ border: `1px solid ${Segments[item.segment].color}` }}
              >
                <Box display="flex" justifyContent="space-between">
                  <Box>
                    <Typography variant="body1" sx={{ color: Segments[item.segment].color }} fontWeight={600}>
                      {item.segment}
                    </Typography>
                  </Box>

                  <Box>
                    <Typography variant="body1" color="GrayText">
                      {item.isRecurrent === 1 ? <Typography color="InfoText">Recorrente</Typography> : 'Não recorrente'}
                    </Typography>
                  </Box>
                </Box>

                <Box display="flex">
                  <Box display="flex" alignItems="center" flex={1}>
                    <Typography variant="subtitle2" color="primary" >
                      {item.description}
                    </Typography>
                  </Box>

                  <Box display="flex" justifyContent="center" alignItems="center">
                    <IconButton title="Excluir" onClick={() => { handleDeleteSchedule(item?.id ?? '') }}>
                      <IconDelete />
                    </IconButton>
                  </Box>
                </Box>
              </Box>
            ))}

            {schedulesForDay.length === 0 && (
              <Box textAlign="center">
                <Typography component="i" variant="body1" color="primary">
                  Nenhum lembrete para esse dia
                </Typography>
              </Box>
            )}
          </Box>
        </Box>
      </Drawer>
    </>
  )
}

export default Schedules
