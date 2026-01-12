import iconEdit from '~/assets/icons/icon-edit.svg'
import iconDelete from '~/assets/icons/icon-delete.svg'
import iconSearch from '~/assets/icons/icon-search.svg'
import iconDoubleArrowDown from '~/assets/icons/icon-double-arrow-down.svg'
import iconSingleArrowDownCircule from '~/assets/icons/icon-single-arrow-circule.svg'
import iconSingleArrowUpCircule from '~/assets/icons/icon-single-arrow-up-circule.svg'
import iconSingleArrowLeftCircule from '~/assets/icons/icon-single-arrow-left-circule.svg'
import iconSingleArrowRightCircule from '~/assets/icons/icon-single-arrow-right-circule.svg'
import iconCheckCircule from '~/assets/icons/icon-check-circule.svg'
import iconMenuHamburguer from '~/assets/icons/icon-menu-hambuguer.svg'
import iconUpload from '~/assets/icons/icon-upload.svg'
import iconFilter from '~/assets/icons/icon-filter.svg'
import iconCalendar from '~/assets/icons/icon-calendar.svg'
import iconChartSimpleBar from '~/assets/icons/icon-chart-simple-bar.svg'
import iconChartSimpleLine from '~/assets/icons/icon-chart-simple-line.svg'
import iconChartSimplePizza from '~/assets/icons/icon-chart-simple-pizza.svg'
import iconRevenue from '~/assets/icons/icon-revenue.svg'
import iconBalance from '~/assets/icons/icon-balance.svg'
import iconRevenueDashboard from '~/assets/icons/icon-receives.svg'
import iconDowns from '~/assets/icons/icon-downs.svg'
import iconTransaction from '~/assets/icons/icon-money-transaction.svg'
import iconInformation from '~/assets/icons/icon-info.svg'
import iconLock from '~/assets/icons/icon-lock.svg'
import iconUser from '~/assets/icons/icon-user.svg'
import iconEyeOpened from '~/assets/icons/icon-eye-opened.svg'
import iconEyeClosed from '~/assets/icons/icon-eye-closed.svg'
import iconBank from '~/assets/icons/icon-bank.svg'
import iconArchieved from '~/assets/icons/icon-goal-archieved.svg'

export const iconsMap = {
  edit: iconEdit,
  delete: iconDelete,
  search: iconSearch,
  doubleArrowDown: iconDoubleArrowDown,
  singleArrowDownCircule: iconSingleArrowDownCircule,
  singleArrowUpCircule: iconSingleArrowUpCircule,
  singleArrowLeftCircule: iconSingleArrowLeftCircule,
  singleArrowRightCircule: iconSingleArrowRightCircule,
  checkCircule: iconCheckCircule,
  menuHamburguer: iconMenuHamburguer,
  upload: iconUpload,
  filter: iconFilter,
  calendar: iconCalendar,
  chartBar: iconChartSimpleBar,
  chartLine: iconChartSimpleLine,
  chartPizza: iconChartSimplePizza,
  revenue: iconRevenue,
  balance: iconBalance,
  revenues: iconRevenueDashboard,
  downs: iconDowns,
  transaction: iconTransaction,
  information: iconInformation,
  lock: iconLock,
  user: iconUser,
  eyeOpened: iconEyeOpened,
  eyeClosed: iconEyeClosed,
  bank: iconBank,
  archieved: iconArchieved
} as const

export type IconName = keyof typeof iconsMap
