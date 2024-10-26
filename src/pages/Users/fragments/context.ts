import React, { useContext } from 'react'
import { MODES } from '~/models'
import { IUsersContext } from '~/models/users'

const usersContext = React.createContext<IUsersContext>({
  mode: MODES.create,
  setMode: () => { },
  user: undefined,
  setUser: () => { }
})

export const useUsersContext = (): IUsersContext => {
  const {
    mode,
    setMode,
    user,
    setUser
  } = useContext(usersContext)

  return {
    mode,
    setMode,
    user,
    setUser
  }
}

export const { Provider } = usersContext
export default usersContext
