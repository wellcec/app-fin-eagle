import React from 'react'
import SVG from 'react-inlinesvg'

import iconDashboard from '../assets/icons/icon-dashboard.svg'
import iconCustomers from '../assets/icons/icon-customers.svg'
import iconTransactions from '../assets/icons/icon-transaction.svg'
import iconCategories from '../assets/icons/icon-categories.svg'
import iconStats from '../assets/icons/icon-stats.svg'
import iconWatchCalendar from '../assets/icons/icon-watch-calendar.svg'

import { IMenuItem } from '../models'

export const SIZE_ICONS_HOME = 20

export const MenuItems: IMenuItem[] = [
  {
    title: 'Dashboard',
    path: '/dashboard',
    paths: ['/', '/dashboard'],
    icon: () => (
      <SVG
        src={iconDashboard}
        width={SIZE_ICONS_HOME}
        height={SIZE_ICONS_HOME}
      />
    )
  },
  // {
  //   title: 'Usuários',
  //   path: '/users',
  //   paths: ['/users'],
  //   icon: () => (
  //     <SVG
  //       src={iconCustomers}
  //       width={SIZE_ICONS_HOME}
  //       height={SIZE_ICONS_HOME}
  //     />
  //   )
  // },
  {
    title: 'Transações',
    path: '/transactions',
    paths: ['/transactions'],
    icon: () => (
      <SVG
        src={iconTransactions}
        width={SIZE_ICONS_HOME}
        height={SIZE_ICONS_HOME}
      />
    )
  },
  {
    title: 'Estatísticas',
    path: '/stats',
    paths: ['/stats'],
    icon: () => (
      <SVG
        src={iconStats}
        width={SIZE_ICONS_HOME}
        height={SIZE_ICONS_HOME}
      />
    )
  },
  {
    title: 'Agendamentos',
    path: '/schedules',
    paths: ['/schedules'],
    icon: () => (
      <SVG
        src={iconWatchCalendar}
        width={SIZE_ICONS_HOME}
        height={SIZE_ICONS_HOME}
      />
    )
  },
  {
    title: 'Categorias',
    path: '/categories',
    paths: ['/categories'],
    icon: () => (
      <SVG
        src={iconCategories}
        width={SIZE_ICONS_HOME}
        height={SIZE_ICONS_HOME}
      />
    )
  }
  // {
  //   title: 'Produtos',
  //   path: '/products',
  //   paths: ['/products'],
  //   icon: () => (
  //     <SVG
  //       src={iconProducts}
  //       width={SIZE_ICONS_HOME}
  //       height={SIZE_ICONS_HOME}
  //     />
  //   )
  // },
  // {
  //   title: 'Categorias',
  //   path: '/categories',
  //   paths: ['/categories'],
  //   icon: () => (
  //     <SVG
  //       src={iconCategories}
  //       width={SIZE_ICONS_HOME}
  //       height={SIZE_ICONS_HOME}
  //     />
  //   )
  // }
]
