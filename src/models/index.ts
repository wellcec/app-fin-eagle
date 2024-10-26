export type DefaultThemeType = {
  id: string
  primary: string
}

type MsgAlertType = 'success' | 'error' | 'warning' | 'info'

export interface AlertType {
  type: MsgAlertType
  message: string
}

export const ALERT_TYPES = {
  success: 'success' as MsgAlertType,
  error: 'error' as MsgAlertType,
  warning: 'warning' as MsgAlertType,
  info: 'info' as MsgAlertType
}

export interface IAlerts {
  alert: AlertType
  setAlert: (alert: AlertType) => void
}

export interface IMenuItem {
  title: string
  path: string
  icon: any
  paths: string[]
}

export type Mode = 'create' | 'update' | 'list'

export const MODES = {
  create: 'create' as Mode,
  update: 'update' as Mode,
  list: 'list' as Mode
}

export type SampleFilterType = {
  term: string
  page: number
  pageSize: number
}

export type ActionsType = 'create' | 'update'

export const ACTIONS = {
  create: 'create' as ActionsType,
  update: 'update' as ActionsType
}
