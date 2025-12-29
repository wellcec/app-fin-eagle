import React from 'react'

import { ChartsType } from '~/models/charts'
import { DefaultThemeType } from '../models'
import { IconChartSimpleBar, IconChartSimplePizza } from '~/constants/icons'
import { SegmentTransactionType } from '~/client/models/transactions'

export const DEFAULT_THEME: DefaultThemeType = {
  id: 'default',
  primary: '#11032d'
}

export const DefaultsSegments = {
  Receive: 'Receita' as SegmentTransactionType,
  Expense: 'Despesa' as SegmentTransactionType,
  Reminder: 'Lembrete' as SegmentTransactionType
}

export const Segments = {
  Receita: {
    code: 0,
    title: DefaultsSegments.Receive,
    color: '#50ad6e',
    colorTranslucent: 'rgba(80, 173, 110, 0.1)'
  },
  Despesa: {
    code: 1,
    title: DefaultsSegments.Expense,
    color: '#C3284C',
    colorTranslucent: 'rgba(195, 40, 76, 0.1)'
  },
  Lembrete: {
    code: 2,
    title: DefaultsSegments.Reminder,
    color: '#FFC654',
    colorTranslucent: 'rgba(255, 198, 84, 0.1)'
  }
}

export const DEFAULT_FORMAT_DATE = 'yyyy-MM-dd HH:mm:ss'
export const DEFAULT_SHORT_FORMAT_DATE = 'yyyy-MM-dd'
export const DEFAULT_BR_FORMAT_DATE = 'dd/MM/yyyy'

export const BIG_BALL_SIZE = 32
export const MEDIUM_BALL_SIZE = 22
export const SMALL_BALL_SIZE = 16

export const DEFAULT_PAGESIZE = 10
export const DEFAULT_OVER_PAGESIZE = 10000

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
  }
]

export default DEFAULT_PAGESIZE
