import React, { type PropsWithChildren, useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'

import {
  Box,
  Divider,
  Drawer,
  IconButton,
  List, ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  type Theme,
  Typography,
  useTheme,
  useMediaQuery,
  AppBar,
  Toolbar
} from '@mui/material'
import { styled, type CSSObject } from '@mui/material/styles'
import makeStyles from '@mui/styles/makeStyles'

import animation from '~/assets/animations/money-animation.json'
import iconLogo from '../assets/images/logo64.png'
import colors from '../layout/theme/colors'

import { IconMenuHamburguer, IconSingleArrowLeftCircule } from '../constants/icons'
import { DEFAULT_THEME } from '../constants'
import { MenuItems } from '../constants/menus'
import { Player } from '@lottiefiles/react-lottie-player'

const drawerWidth = 240

const openedMixin = (theme: Theme): CSSObject => ({
  width: drawerWidth,
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen
  }),
  overflowX: 'hidden'
})

const closedMixin = (theme: Theme): CSSObject => ({
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen
  }),
  overflowX: 'hidden',
  width: `calc(${theme.spacing(7)} + 1px)`,
  [theme.breakpoints.up('sm')]: {
    width: `calc(${theme.spacing(8)} + 1px)`
  }
})

const Main = styled('main', { shouldForwardProp: (prop) => prop !== 'open' && prop !== 'mobile' })<{
  open?: boolean
  mobile?: boolean
}>(({ theme, open, mobile }) => ({
  backgroundColor: colors.background.container,
  display: 'flex',
  flexDirection: 'column',
  flexGrow: 1,
  padding: theme.spacing(3),
  transition: theme.transitions.create('margin', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen
  }),
  ...(open && {
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen
    }),
    marginLeft: 0
  }),
  ...(mobile && {
    marginTop: 75
  })
}))

const useStyles = makeStyles(() => ({
  buttonList: {
    paddingTop: 15,
    paddingBottom: 15
  },
  menuItemOpened: {
    marginTop: 0,
    marginBottom: 0
  },
  drawer: {
    '& .MuiPaper-root': {
      border: 'none'
    }
  },
  divider: {
    border: colors.primary.main,
    background: colors.primary.main,
    borderWidth: 10,
    width: 6,
    height: 20,
    borderRadius: 10
  },
  selected: {
    '& svg': {
      fill: DEFAULT_THEME.primary
    },
    '& .MuiListItemText-root': {
      '& .MuiTypography-root': {
        fontWeight: 500
      }
    }
  },
  notSelected: {
    '& svg': {
      fill: colors.text.tertiary
    },
    '& .MuiListItemText-root': {
      '& .MuiTypography-root': {
        color: colors.text.tertiary
      }
    }
  }
}))

const BaseLayout = ({ children }: PropsWithChildren): React.JSX.Element => {
  const styles = useStyles()
  const navigate = useNavigate()
  const location = useLocation()
  const theme = useTheme()

  const [openDrawer, setOpenDrawer] = useState<boolean>(true)

  const switchRoute = (path: string): void => {
    if (downSM) {
      setOpenDrawer(false)
    }

    navigate(path)
  }

  const isCurrentPath = (paths: string[]): boolean => paths.includes(location.pathname)

  const downSM = useMediaQuery((theme: Theme) => theme.breakpoints.down('sm'))

  return (
    <Box display="flex" height={1} overflow="auto" style={{ overflowX: 'hidden' }}>
      {downSM && (
        <AppBar position="fixed" color="default">
          <Toolbar>
            <Box display="flex" justifyContent="space-between" width={1}>
              <Box p={2.1} >
                <IconButton onClick={() => { setOpenDrawer(!openDrawer) }}>
                  <IconMenuHamburguer color={colors.primary.main} />
                </IconButton>
              </Box>

              <Box display="flex" alignItems="center" maxWidth={50}>
                <img src={iconLogo} alt="Logo" />
              </Box>
            </Box>
          </Toolbar>
        </AppBar>
      )}

      <Drawer
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          boxSizing: 'border-box',
          ...(openDrawer && {
            ...openedMixin(theme),
            '& .MuiDrawer-paper': {
              ...openedMixin(theme),
              border: 'none !important'
            }
          }),
          ...(!openDrawer && {
            ...closedMixin(theme),
            '& .MuiDrawer-paper': {
              ...closedMixin(theme),
              border: 'none !important'
            }
          })
        }}
        className={styles.drawer}
        variant={downSM ? 'temporary' : 'persistent'}
        anchor="left"
        open={downSM ? openDrawer : true}
      >
        <Box
          p={2.1}
          display="flex"
          minHeight={100}
          alignItems="center"
          justifyContent={openDrawer ? 'space-between' : 'center'}
        >
          {openDrawer && (
            <Box display="flex" gap="10px" alignItems="center" ml={6}>
              <Box width={120} height={100}>
                <Player
                  src={animation}
                  className="player"
                  loop
                  autoplay
                />
              </Box>
            </Box>
          )}

          <IconButton onClick={() => { setOpenDrawer(!openDrawer) }}>
            {openDrawer && (
              <IconSingleArrowLeftCircule />
            )}

            {!openDrawer && (
              <IconMenuHamburguer />
            )}
          </IconButton>
        </Box>

        <List sx={{ flex: 1 }}>
          {MenuItems.map((menuItem, index) => (
            <ListItem
              disablePadding
              key={`${menuItem.title}-${index}`}
              className={`${isCurrentPath(menuItem.paths) ? styles.selected : styles.notSelected}`}
              onClick={() => { switchRoute(menuItem.path) }}
            >
              <ListItemButton className={styles.buttonList} style={{ paddingLeft: openDrawer ? 40 : 16 }}>
                <ListItemIcon style={{ minWidth: openDrawer ? 56 : 35 }}>
                  {menuItem.icon()}
                </ListItemIcon>

                {openDrawer && (
                  <ListItemText className={styles.menuItemOpened} primary={<Typography variant="body2" color="primary" fontWeight={400}>{menuItem.title}</Typography>} />
                )}

                {isCurrentPath(menuItem.paths) && (
                  <Divider orientation="vertical" className={styles.divider} />
                )}
              </ListItemButton>
            </ListItem>
          ))}
        </List>

        <Box textAlign="center" mb={2}>
          <Typography variant="body2" color="primary">
            FinEagle v1.0.1
          </Typography>
        </Box>
      </Drawer>

      <Main open={openDrawer} mobile={downSM}>
        {children}
      </Main>
    </Box>
  )
}

export default BaseLayout
