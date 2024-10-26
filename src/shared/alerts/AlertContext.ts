import React, { useContext } from 'react'
import { ALERT_TYPES, IAlerts } from '../../models'

const defaultAlert: IAlerts = {
  alert: { type: ALERT_TYPES.info, message: '' },
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  setAlert: () => { }
}

const AlertsContext = React.createContext(defaultAlert)

export const useAlertsContext = (): IAlerts => {
  const {
    alert,
    setAlert
  } = useContext(AlertsContext)

  return {
    alert,
    setAlert
  }
}

export default AlertsContext
