import React from 'react'
import { Router, Route } from 'electron-router-dom'

import Dashboard from '../pages/Dashboard'
import WithLayoutRoute from './WithLayoutRoute'
import BaseLayout from '../layout/BaseLayout'
import Users from '../pages/Users'
import Categories from '../pages/Categories'
import Transactions from '~/pages/Transactions'
import Stats from '~/pages/Stats'
import Schedules from '~/pages/Schedules'

const SwitchRoutes = (): React.JSX.Element => (
  <>
    <Router
      main={
        <>
          <Route path="/" element={<WithLayoutRoute layout={BaseLayout} component={Dashboard} />} />
          <Route path="/dashboard" element={<WithLayoutRoute layout={BaseLayout} component={Dashboard} />} />
          <Route path="/users" element={<WithLayoutRoute layout={BaseLayout} component={Users} />} />
          <Route path="/categories" element={<WithLayoutRoute layout={BaseLayout} component={Categories} />} />
          <Route path="/transactions" element={<WithLayoutRoute layout={BaseLayout} component={Transactions} />} />
          <Route path="/stats" element={<WithLayoutRoute layout={BaseLayout} component={Stats} />} />
          <Route path="/schedules" element={<WithLayoutRoute layout={BaseLayout} component={Schedules} />} />
        </>
      }
    />
  </>
)

export default SwitchRoutes
