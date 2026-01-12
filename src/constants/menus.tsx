import React from 'react'
import SVG from 'react-inlinesvg'

import iconHome from '../assets/icons/icon-home.svg'
import iconTransactions from '../assets/icons/icon-transaction.svg'
import iconCategories from '../assets/icons/icon-categories.svg'
import iconStats from '../assets/icons/icon-stats.svg'
import iconWatchCalendar from '../assets/icons/icon-watch-calendar.svg'
import iconLimits from '../assets/icons/icon-limits.svg'
import iconBank from '../assets/icons/icon-bank.svg'
//import iconArchieved from '../assets/icons/icon-goal-archieved.svg'

import { IMenuItem } from '../models'

export const SIZE_ICONS_HOME = 20

export const Titles = {
  DASHBOARD: 'Home',
  TRANSACTIONS: 'Transações',
  CATEGORIES: 'Tipos de gastos',
  BANKACOUNTS: 'Contas',
  STATS: 'Estatísticas',
  CALENDAR: 'Calendário',
  LIMITS: 'Limites',
  ARCHIEVED: 'Concluídos'
}

export const MenuItems: IMenuItem[] = [
  {
    title: Titles.DASHBOARD,
    path: '/home',
    paths: ['/', '/home'],
    icon: (size: number = SIZE_ICONS_HOME) => (<SVG src={iconHome} width={size} height={size} />)
  },
  {
    title: Titles.TRANSACTIONS,
    path: '/transactions',
    paths: ['/transactions'],
    icon: (size: number = SIZE_ICONS_HOME) => (<SVG src={iconTransactions} width={size} height={size} />)
  },
  {
    title: Titles.CATEGORIES,
    path: '/categories',
    paths: ['/categories'],
    icon: (size: number = SIZE_ICONS_HOME) => (<SVG src={iconCategories} width={size} height={size} />)
  },
  {
    title: Titles.BANKACOUNTS,
    path: '/banks',
    paths: ['/banks'],
    icon: (size: number = SIZE_ICONS_HOME) => (<SVG src={iconBank} width={size} height={size} />)
  },
  {
    title: Titles.LIMITS,
    path: '/limits',
    paths: ['/limits'],
    icon: (size: number = SIZE_ICONS_HOME) => (<SVG src={iconLimits} width={size} height={size} />)
  },
  {
    title: Titles.CALENDAR,
    path: '/calendar',
    paths: ['/calendar'],
    icon: (size: number = SIZE_ICONS_HOME) => (<SVG src={iconWatchCalendar} width={size} height={size} />)
  },
  // TODO: fazer tela de listagem para metas e dividas concluidas
  // {
  //   title: Titles.ARCHIEVED,
  //   path: '/archieveds',
  //   paths: ['/archieveds'],
  //   icon: (size: number = SIZE_ICONS_HOME) => (<SVG src={iconArchieved} width={size} height={size} />)
  // },
  {
    title: Titles.STATS,
    path: '/stats',
    paths: ['/stats'],
    icon: (size: number = SIZE_ICONS_HOME) => (<SVG src={iconStats} width={size} height={size} />)
  }
]
