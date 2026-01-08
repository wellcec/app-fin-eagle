import React, { useContext } from 'react'

type Context = {
  logged: boolean
  setLogged: (value: React.SetStateAction<boolean>) => void
}

const loginContext = React.createContext<Context>({
  logged: false,
  setLogged: () => { }
})

export const useLoginContext = (): Context => {
  const {
    logged,
    setLogged
  } = useContext(loginContext)

  return {
    logged,
    setLogged
  }
}

export const { Provider } = loginContext
export default loginContext
