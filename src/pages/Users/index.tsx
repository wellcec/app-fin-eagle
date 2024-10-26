import React, { useState } from 'react'

import { Provider } from './fragments/context'
import { MODES, Mode } from '~/models'
import List from './fragments/list'
import { UsersType } from '~/client/models/users'

const Users = () => {
  const { create, update, list } = MODES

  const [user, setUser] = useState<UsersType | undefined>()
  const [mode, setMode] = useState<Mode>(list)

  return (
    <>
      <Provider value={{
        user,
        setUser,
        mode,
        setMode
      }}
      >
        <>
          {/* {(mode === create || mode === update) && (<New />)} */}
          {(mode === list) && (<List />)}
        </>
      </Provider>
    </>
  )
}

export default Users
