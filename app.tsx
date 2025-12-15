import React, { useEffect, useState } from 'react'
import { Provider } from 'react-redux'
import { PersistGate } from 'redux-persist/integration/react'
import startup from '~/client/repository/startup'
import Alerts from '~/components/layout/Alerts'
import Theme from '~/layout'
import { AlertType } from '~/models'
import SwitchRoutes from '~/routes/SwitchRoutes'
import AlertsContext from '~/shared/alerts/AlertContext'
import { persist, store } from '~/shared/store'

const App = (): React.JSX.Element => {
  const [alert, setAlert] = useState<AlertType>({ type: 'info', message: '' })
  const { Provider: ProviderAlerts } = AlertsContext

  useEffect(() => {
    startup().startDatabase()
  }, []);

  return (
    <>
      <Provider store={store}>
        <PersistGate persistor={persist}>
          <Theme>
            <ProviderAlerts value={{ alert, setAlert }}>
              <Alerts />
              <SwitchRoutes />
            </ProviderAlerts>
          </Theme>
        </PersistGate>
      </Provider>
    </>
  )
}

export default App
