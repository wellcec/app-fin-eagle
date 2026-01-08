import React, { useState } from 'react'
import { Router, Route } from 'electron-router-dom'

import Dashboard from '../pages/Dashboard'
import WithLayoutRoute from './WithLayoutRoute'
import BaseLayout from '../layout/BaseLayout'
import Users from '../pages/Users'
import Categories from '../pages/Categories'
import Transactions from '~/pages/Transactions'
import Stats from '~/pages/Stats'
import Schedules from '~/pages/Schedules'
import Limits from '~/pages/Limits'
import { Provider } from './context'
import LoginScreen from '~/pages/Login'

const SwitchRoutes = (): React.JSX.Element => {
  const [logged, setLogged] = useState<boolean>(false);

  return (
    <Provider value={{ logged, setLogged }}>
      <Router
        main={
          <>
            <Route path="/" element={<LoginScreen />} />
            <Route path="/login" element={<LoginScreen />} />

            <Route path="/home" element={<WithLayoutRoute layout={BaseLayout} component={Dashboard} />} />
            <Route path="/users" element={<WithLayoutRoute layout={BaseLayout} component={Users} />} />
            <Route path="/categories" element={<WithLayoutRoute layout={BaseLayout} component={Categories} />} />
            <Route path="/transactions" element={<WithLayoutRoute layout={BaseLayout} component={Transactions} />} />
            <Route path="/stats" element={<WithLayoutRoute layout={BaseLayout} component={Stats} />} />
            <Route path="/calendar" element={<WithLayoutRoute layout={BaseLayout} component={Schedules} />} />
            <Route path="/limits" element={<WithLayoutRoute layout={BaseLayout} component={Limits} />} />
          </>
        }
      />
    </Provider>
  )
}

export default SwitchRoutes
