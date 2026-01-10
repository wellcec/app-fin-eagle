import React, { type PropsWithChildren, useState } from 'react'

import {
  Box,
  IconButton,
  type Theme,
  useMediaQuery,
  AppBar,
  Toolbar
} from '@mui/material'
import { styled } from '@mui/material/styles'

import iconLogo from '../assets/images/logogranna.png'
import colors from '../layout/theme/colors'

import Drawer from './Drawer'
import { Icon } from '~/components/atoms/icons'

const Main = styled('main', { shouldForwardProp: (prop) => prop !== 'open' && prop !== 'mobile' })<{
  open?: boolean
  mobile?: boolean
}>(({ theme, open, mobile }) => ({
  backgroundColor: colors.background.container,
  display: 'flex',
  flexDirection: 'column',
  flexGrow: 1,
  padding: theme.spacing(2),
  marginLeft: theme.spacing(2),
  transition: theme.transitions.create('margin', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen
  }),
  ...(open && {
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen
    }),
  }),
  ...(mobile && {
    marginTop: 75,
    padding: theme.spacing(2)
  })
}))

const BaseLayout = ({ children }: PropsWithChildren): React.JSX.Element => {
  const [openDrawer, setOpenDrawer] = useState<boolean>(true)
  const downSM = useMediaQuery((theme: Theme) => theme.breakpoints.down('sm'))

  return (
    <Box display="flex" height={1} overflow="auto" style={{ overflowX: 'hidden', backgroundColor: colors.background.container }}>
      {downSM && (
        <AppBar position="fixed" color="default">
          <Toolbar>
            <Box display="flex" justifyContent="space-between" width={1}>
              <Box p={2.1} >
                <IconButton onClick={() => { setOpenDrawer(!openDrawer) }}>
                  <Icon name="menuHamburguer" color={colors.primary.main} />
                </IconButton>
              </Box>

              <Box display="flex" alignItems="center" maxWidth={50}>
                <img src={iconLogo} alt="Logo" />
              </Box>
            </Box>
          </Toolbar>
        </AppBar>
      )}

      <Drawer openDrawer={openDrawer} setOpenDrawer={setOpenDrawer} downSM={downSM} />

      <Main open={openDrawer} mobile={downSM}>
        {children}
      </Main>
    </Box>
  )
}

export default BaseLayout
