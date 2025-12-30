import React from 'react'
import SVG from 'react-inlinesvg'

import iconDashboard from '../assets/icons/icon-dashboard.svg'
import iconTransactions from '../assets/icons/icon-transaction.svg'
import iconCategories from '../assets/icons/icon-categories.svg'
import iconStats from '../assets/icons/icon-stats.svg'
import iconWatchCalendar from '../assets/icons/icon-watch-calendar.svg'
import iconLimits from '../assets/icons/icon-limits.svg'

import { IMenuItem } from '../models'

export const SIZE_ICONS_HOME = 20

export const MenuItems: IMenuItem[] = [
  {
    title: 'Home',
    path: '/dashboard',
    paths: ['/', '/dashboard'],
    icon: (size: number = SIZE_ICONS_HOME) => (<SVG src={iconDashboard} width={size} height={size} />)
  },
  {
    title: 'Transações',
    path: '/transactions',
    paths: ['/transactions'],
    icon: (size: number = SIZE_ICONS_HOME) => (<SVG src={iconTransactions} width={size} height={size} />)
  },
  {
    title: 'Estatísticas',
    path: '/stats',
    paths: ['/stats'],
    icon: (size: number = SIZE_ICONS_HOME) => (<SVG src={iconStats} width={size} height={size} />)
  },
  {
    title: 'Agendamentos',
    path: '/schedules',
    paths: ['/schedules'],
    icon: (size: number = SIZE_ICONS_HOME) => (<SVG src={iconWatchCalendar} width={size} height={size} />)
  },
  {
    title: 'Limites',
    path: '/limits',
    paths: ['/limits'],
    icon: (size: number = SIZE_ICONS_HOME) => (<SVG src={iconLimits} width={size} height={size} />)
  },
  {
    title: 'Categorias',
    path: '/categories',
    paths: ['/categories'],
    icon: (size: number = SIZE_ICONS_HOME) => (<SVG src={iconCategories} width={size} height={size} />)
  }
]
