import React, { useContext } from 'react'

type Context = {
  logged: boolean
  setLogged: (value: React.SetStateAction<boolean>) => void
  userId: string
  setUserId: (value: React.SetStateAction<string>) => void
  username: string
  setUsername: (value: React.SetStateAction<string>) => void
}

const loginContext = React.createContext<Context>({
  logged: false,
  setLogged: () => { },
  userId: '',
  setUserId: () => { },
  username: '',
  setUsername: () => { }
})

export const useLoginContext = (): Context => {
  const {
    logged,
    setLogged,
    userId,
    setUserId,
    username,
    setUsername
  } = useContext(loginContext)

  return {
    logged,
    setLogged,
    userId,
    setUserId,
    username,
    setUsername
  }
}

export const { Provider } = loginContext
export default loginContext
