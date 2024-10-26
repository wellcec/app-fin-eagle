import React from 'react'

import { ChartsType } from '~/models/charts'
import { DefaultThemeType } from '../models'
import { IconChartSimpleBar, IconChartSimpleLine, IconChartSimplePizza } from '~/constants/icons'
export const DEFAULT_THEME: DefaultThemeType = {
  id: 'default',
  primary: '#141422'
}

export const Segments = {
  Receita: {
    code: 0,
    title: 'Receita',
    color: '#50ad6e'
  },
  Despesa: {
    code: 1,
    title: 'Despesa',
    color: '#C3284C'
  },
  Lembrete: {
    code: 2,
    title: 'Lembrete',
    color: '#FFC654'
  }
}

export const DEFAULT_FORMAT_DATE = 'yyyy-MM-dd HH:mm:ss'
export const DEFAULT_SHORT_FORMAT_DATE = 'yyyy-MM-dd'
export const DEFAULT_BR_FORMAT_DATE = 'dd/MM/yyyy'

export const BIG_BALL_SIZE = 32
export const MEDIUM_BALL_SIZE = 22
export const SMALL_BALL_SIZE = 16

export const DEFAULT_PAGESIZE = 10
export const DEFAULT_OVER_PAGESIZE = 10000 * 10000

export const DEFAULT_GAP_IZE = 1.5

export const DAYS_WEEK = [
  { eng: 'Sunday', pt: 'Dom' },
  { eng: 'Monday', pt: 'Seg' },
  { eng: 'Tuesday', pt: 'Ter' },
  { eng: 'Wednesday', pt: 'Qua' },
  { eng: 'Thursday', pt: 'Qui' },
  { eng: 'Friday', pt: 'Sex' },
  { eng: 'Saturday', pt: 'Sáb' }
]

export const LABEL_DAYS = ['domingo', 'segunda-feira', 'terça-feira', 'quarta-feira', 'quinta-feira', 'sexta-feira', 'sábado']
export const LABEL_MONTHS = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro']

export const TypesCharts: ChartsType[] = [
  {
    id: 0,
    key: 'SimpleMonth',
    title: 'Ganhos e Gastos',
    icon: (color) => <IconChartSimpleBar color={color} />
  },
  {
    id: 1,
    key: 'SimpleCategories',
    title: 'Balanço por categoria',
    icon: (color) => <IconChartSimplePizza color={color} />
  },
  {
    id: 2,
    key: 'SimpleLineMonth',
    title: 'Balanço em linha',
    icon: (color) => <IconChartSimpleLine color={color} />
  }
]

export default DEFAULT_PAGESIZE
