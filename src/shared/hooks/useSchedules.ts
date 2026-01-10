import { ScheduleType } from '~/client/models/schedules'
import { DefaultsSegments } from '~/constants'
import ViewCalendarType from '~/models/schedules'

interface IUseSchedules {
  buildViewCalendar: any
}

const useSchedules = (): IUseSchedules => {
  const buildViewCalendar = (data: ScheduleType[], callback: (t: ViewCalendarType[]) => void): void => {
    const dataToDisplay: ViewCalendarType[] = []

    for (const schedule of data) {
      const strDate = schedule.date?.toString() + 'T00:00:00Z'
      const dateOfSchedule = new Date(strDate)
      const dayAsNumber = (dateOfSchedule.getUTCDate() ?? 0)

      const isExpense = schedule.segment === DefaultsSegments.Expense
      const isReceived = schedule.segment === DefaultsSegments.Receive
      const isReminder = schedule.segment === DefaultsSegments.Reminder

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

    callback(dataToDisplay)
  }

  return { buildViewCalendar }
}

export default useSchedules
