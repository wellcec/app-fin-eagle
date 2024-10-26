import React, { useMemo, useEffect } from 'react'
import { ThemeProvider, StyledEngineProvider } from '@mui/material/styles'

import { createTheme } from '../layout/theme'

const Theme = ({ children }: { children: React.ReactNode }) => {
  const theme = useMemo(() => createTheme(), [])

  useEffect(() => {
    const appTheme = (event: any) => {
      const { resolve } = event.detail
      resolve(theme)
    }

    window.addEventListener('app.theme', appTheme)

    return () => {
      window.removeEventListener('app.theme', appTheme)
    }
  }, [theme])

  return (
    <StyledEngineProvider injectFirst>
      <ThemeProvider theme={theme}>
        {children}
      </ThemeProvider>
    </StyledEngineProvider>
  )
}

export default Theme
