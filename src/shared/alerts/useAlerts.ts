import { ALERT_TYPES } from '../../models'
import { useAlertsContext } from './AlertContext'
import { useCallback } from 'react'

interface IUseAlerts {
  notifySuccess: (message: string) => void
  notifyInfo: (message: string) => void
  notifyWarning: (message: string) => void
  notifyError: (message: string) => void
}

const useAlerts = (): IUseAlerts => {
  const { setAlert } = useAlertsContext()
  const { error, info, success, warning } = ALERT_TYPES

  const notifySuccess = useCallback((message: string): void => { setAlert({ type: success, message }) }, [setAlert, success])

  const notifyInfo = useCallback((message: string): void => { setAlert({ type: info, message }) }, [setAlert, info])

  const notifyWarning = useCallback((message: string): void => { setAlert({ type: warning, message }) }, [setAlert, warning])

  const notifyError = useCallback((message: string): void => { setAlert({ type: error, message }) }, [setAlert, error])

  return {
    notifySuccess,
    notifyInfo,
    notifyWarning,
    notifyError
  }
}

export default useAlerts
