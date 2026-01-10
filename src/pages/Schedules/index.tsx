import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { getDaysInMonth, format, startOfMonth, addMonths, subMonths, endOfMonth } from 'date-fns'
import { blue } from '@mui/material/colors'
import AddIcon from '@mui/icons-material/Add'
import RadioButtonUncheckedIcon from '@mui/icons-material/RadioButtonUnchecked'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import { Avatar, Box, Button, Checkbox, Divider, FormControlLabel, FormGroup, IconButton, MenuItem, Select, Theme, Typography, Paper as PaperMui } from '@mui/material'
import makeStyles from '@mui/styles/makeStyles'

import ContainerMain from '~/components/layout/ContainerMain'
import { DAYS_WEEK, DEFAULT_GAP_SIZE, DefaultsSegments, LABEL_MONTHS, Segments, SMALL_BALL_SIZE } from '~/constants'
import Paper from '~/components/layout/Paper'
import InputForm from '~/components/atoms/inputs/InputForm'
import BallColor from '~/components/atoms/BallColor'
import { SegmentTransactionType } from '~/client/models/transactions'
import InputText from '~/components/atoms/inputs/InputText'
import { ScheduleType } from '~/client/models/schedules'
import schedulesRepository from '~/client/repository/schedulesRepository'
import useAlerts from '~/shared/alerts/useAlerts'
import ViewCalendarType from '~/models/schedules'
import Modal from '~/components/molecules/Modal'
import { Titles } from '~/constants/menus'
import { Icon } from '~/components/atoms/icons'
import Description from './fragments/Description'
import SchedulesForDayItem from './fragments/SchedulesForDayItem'
import useSchedules from '~/shared/hooks/useSchedules'

const ICON_SIZE = 25
const CUSTOM_BALL_SIZE = 32
const SCREEN_SIZE = 600

const STEPS = {
  adding: 0,
  list: 1,
  description: 2
}

const IconArrowSelect = (): React.JSX.Element => {
  return <Box mr={1} mt={0.5}><Icon name="doubleArrowDown" /></Box>
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
    height: 70,
    width: 100,

    '@media (min-height: 800px)': {
      height: 95
    },
    '@media (min-height: 1000px)': {
      height: 120
    }
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
    textAlign: 'start',

    '@media (max-height: 799px)': {
      '& h6': {
        fontSize: 14
      }
    }
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
  const [isAdding, setIsAdding] = useState<boolean>(false)
  const [currentDate, setCurrentDate] = useState<Date>(new Date())
  const [currentMonth, setCurrentMonth] = useState<number>(0)
  const [currentYear, setCurrentYear] = useState<number>(1990)
  const [currentListDays, setCurrentListDays] = useState<number[]>([])
  const [loopFirstDayPosition, setLoopFirstDayPosition] = useState<number>(0)

  const [schedulesForDay, setSchedulesForDay] = useState<ScheduleType[]>([])
  const [viewCalendar, setViewCalendar] = useState<ViewCalendarType[]>([])
  const [chooseDay, setChooseDay] = useState<number>(1)
  const [showForm, setShowForm] = useState<boolean>(false)
  const [segment, setSegment] = useState<SegmentTransactionType>(DefaultsSegments.Reminder)
  const [description, setDescription] = useState<string>('')
  const [title, setTitle] = useState<string>('')
  const [isRecurrent, setIsRecurrent] = useState<boolean>(false)
  const [steps, setSteps] = useState<number>(STEPS.adding)
  const [scheduleToShow, setScheduleToShow] = useState<ScheduleType>()

  const styles = useStyles()
  const { getSchedulesByDay, getSchedulesByRange, createSchedule, deleteSchedule } = schedulesRepository()
  const { notifyWarning, notifyError, notifySuccess } = useAlerts()
  const { buildViewCalendar } = useSchedules()

  const nowDayAsNumber = (day: number): boolean => {
    const now = new Date()
    const nowDay = now.getDate()
    const nowMonth = now.getMonth()
    const nowYear = now.getFullYear()

    const month = currentDate.getMonth()
    const year = currentDate.getFullYear()

    return (day === nowDay && nowMonth === month && nowYear === year)
  }

  const getViewCalendar = (day: number, type: SegmentTransactionType): number => {
    const view = viewCalendar.find((v) => v.day === day)
    if (type === DefaultsSegments.Expense) {
      return view?.expenses ?? 0
    }

    if (type === DefaultsSegments.Receive) {
      return view?.received ?? 0
    }

    if (type === DefaultsSegments.Reminder) {
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
        buildViewCalendar(response.data, setViewCalendar)
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

  const handleAdding = (): void => {
    setIsAdding(!isAdding)
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

  const toggleDrawer = (open: boolean): void => {
    setShowForm(open)
  }

  const handleInitForm = (item: number): void => {

    const dateToSearch = new Date(currentYear, currentMonth, item)

    getSchedulesByDay(dateToSearch).then(
      (response) => {
        setIsRecurrent(false)
        setDescription('')
        setTitle('')
        setSchedulesForDay(response.data)
        setChooseDay(item)
        setShowForm(!showForm)
        setScheduleToShow(undefined)
        setIsAdding(response.data.length === 0)
        setSteps(STEPS.adding)
      }
    )
  }

  const handleSaveSchedule = (): void => {
    const dateToSave = new Date(currentYear, currentMonth, chooseDay)

    if (title === '') {
      notifyWarning('Um título deve ser informado')
      return
    }

    const newSchedule: ScheduleType = {
      title,
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
          setTitle('')
          getSchedulesForDay()
          getCurrentDate()
          setIsAdding(false)
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

  const handleShowSchedule = (item: ScheduleType): void => {
    setSteps(STEPS.description)
    setScheduleToShow(item)
  }

  useEffect(() => {
    getCurrentDate()
  }, [currentDate])

  console.log(isAdding)
  return (
    <>
      <ContainerMain title={Titles.CALENDAR} fullCard={false}>
        <Box display="flex" flexGrow={0} justifyContent="end" mb={2}>
          <PaperMui className={styles.paperSelectMonth}>
            <Box display="flex" flexWrap="wrap" gap={2} alignItems="center" justifyContent="space-around">
              <Box>
                <IconButton onClick={handlePreviousMonth}>
                  <Icon name="singleArrowLeftCircule" size={ICON_SIZE} />
                </IconButton>
              </Box>

              <Box>
                <Typography variant="h6">
                  {LABEL_MONTHS[currentMonth]}/{currentYear}
                </Typography>
              </Box>

              <Box>
                <IconButton onClick={handleNextMonth}>
                  <Icon name="singleArrowRightCircule" size={ICON_SIZE} />
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
                <React.Fragment key={`fragment-day-${index}`}>
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

                      <Box display="flex" gap={0.6} justifyContent="flex-end">
                        {getViewCalendar(item, DefaultsSegments.Receive) >= 1 && (
                          <BallColor label={getViewCalendar(item, DefaultsSegments.Receive).toString()} color={Segments.Receita.color} size={CUSTOM_BALL_SIZE} />
                        )}

                        {getViewCalendar(item, DefaultsSegments.Expense) >= 1 && (
                          <BallColor label={getViewCalendar(item, DefaultsSegments.Expense).toString()} color={Segments.Despesa.color} size={CUSTOM_BALL_SIZE} />
                        )}

                        {getViewCalendar(item, DefaultsSegments.Reminder) >= 1 && (
                          <BallColor label={getViewCalendar(item, DefaultsSegments.Reminder).toString()} color={Segments.Lembrete.color} size={CUSTOM_BALL_SIZE} />
                        )}
                      </Box>
                    </Box>
                  </Button>
                </React.Fragment>
              ))}
            </Box>
          </Box>
        </Paper>
      </ContainerMain>

      <Modal open={showForm} handleClose={() => { toggleDrawer(!showForm) }}>
        <Box minWidth={SCREEN_SIZE}>
          <Typography variant="h6" color="text.main" display="flex" justifyContent="center" alignItems="center">
            O que fazer dia
            <Box m={2}>
              <Avatar sx={{ bgcolor: blue.A700 }}>{chooseDay}</Avatar>
            </Box>
            ?
          </Typography>
        </Box>

        {steps === STEPS.adding && (
          <Box>
            <Box display="block" px={2} gap={1}>
              {(schedulesForDay.length === 0 && !isAdding) && (
                <Box pb={1} mb={2} textAlign="center">
                  <Typography mb={3} variant="body2">Então... você não tem nenhum lembrete para esse dia</Typography>

                  <Button variant="outlined" color="success" onClick={handleAdding}>
                    Adicione algum
                  </Button>
                </Box>
              )}

              {isAdding && (
                <Box width={SCREEN_SIZE}>
                  <Box display="flex" gap={2} flex={1} mb={1}>
                    <InputForm fullWidth title="Tipo">
                      <Select
                        variant="outlined"
                        size="small"
                        value={segment}
                        onChange={(event) => { setSegment(event.target.value as SegmentTransactionType) }}
                        IconComponent={IconArrowSelect}
                      >
                        <MenuItem value="Lembrete">
                          <Box display="flex" alignItems="center" gap={DEFAULT_GAP_SIZE}>
                            <BallColor color={Segments.Lembrete.color} size={SMALL_BALL_SIZE} />
                            <Box>
                              {DefaultsSegments.Reminder}
                            </Box>
                          </Box>
                        </MenuItem>

                        <MenuItem value="Despesa">
                          <Box display="flex" alignItems="center" gap={DEFAULT_GAP_SIZE}>
                            <BallColor color={Segments.Despesa.color} size={SMALL_BALL_SIZE} />
                            <Box>
                              {DefaultsSegments.Expense}
                            </Box>
                          </Box>
                        </MenuItem>

                        <MenuItem value="Receita">
                          <Box display="flex" alignItems="center" gap={DEFAULT_GAP_SIZE}>
                            <BallColor color={Segments.Receita.color} size={SMALL_BALL_SIZE} />
                            <Box>
                              {DefaultsSegments.Receive}
                            </Box>
                          </Box>
                        </MenuItem>
                      </Select>
                    </InputForm>

                    <InputForm fullWidth title="Lembrar de" propField="title">
                      <InputText
                        placeholder="Informe um título"
                        value={title}
                        onChange={(event: React.ChangeEvent<HTMLInputElement>) => { setTitle(event.target.value) }}
                      />
                    </InputForm>
                  </Box>

                  <Box mb={2}>
                    <InputForm fullWidth title="Sobre" propField="description">
                      <InputText
                        multiline
                        rows={8}
                        value={description}
                        placeholder="Informe uma observação"
                        onChange={(event: React.ChangeEvent<HTMLInputElement>) => { setDescription(event.target.value) }}
                      />
                    </InputForm>
                  </Box>

                  <Divider />

                  <Box display="flex" justifyContent="end" mt={2}>
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
                          label="Recorrente?"
                        />
                      </FormGroup>
                    </Box>

                    <Box display="flex" gap={1}>
                      {(isAdding) && (
                        <Button variant="outlined" color="primary" onClick={() => { toggleDrawer(!showForm) }}>
                          <Box display="flex" alignItems="center" gap={1}>
                            <Box>
                              Cancelar
                            </Box>
                          </Box>
                        </Button>
                      )}

                      <Button variant="contained" color="primary" onClick={handleSaveSchedule}>
                        <Box display="flex" alignItems="center" gap={1}>
                          <Box>
                            Salvar
                          </Box>
                        </Box>
                      </Button>
                    </Box>
                  </Box>
                </Box>
              )}

              {(schedulesForDay.length > 0 && !isAdding) && (
                <Box mt={2} width={SCREEN_SIZE}>
                  <Box mb={2}>
                    {schedulesForDay.map((item, index) => (
                      <React.Fragment key={`fragment-schedules-day-${index}`}>
                        <SchedulesForDayItem
                          item={item}
                          handleDeleteSchedule={handleDeleteSchedule}
                          handleShowSchedule={handleShowSchedule}
                        />
                      </React.Fragment>
                    ))}
                  </Box>

                  <Divider />

                  <Box display="flex" justifyContent="end" mt={2}>
                    <Button
                      variant="contained"
                      color="success"
                      onClick={handleAdding}
                      startIcon={<AddIcon fontSize="small" />}
                    >
                      Novo lembrete
                    </Button>
                  </Box>
                </Box>
              )}
            </Box>
          </Box>
        )}

        {steps === STEPS.description && (
          <Description
            scheduleToShow={scheduleToShow}
            setSteps={setSteps}
            steps={STEPS}
            SCREEN_SIZE={SCREEN_SIZE}
          />
        )}
      </Modal>
    </>
  )
}

export default Schedules
