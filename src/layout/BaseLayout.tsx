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
import iconLogo from '../assets/images/logogranna.png'
import colors from '../layout/theme/colors'

import { IconMenuHamburguer } from '../constants/icons'
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
  padding: theme.spacing(4),
  transition: theme.transitions.create('margin', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen
  }),
  ...(open && {
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen
    }),
    marginLeft: 8
  }),
  ...(mobile && {
    marginTop: 75,
    padding: theme.spacing(2)
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
    border: colors.secondary.main,
    background: colors.secondary.main,
    borderWidth: 10,
    width: 6,
    height: 20,
    borderRadius: 10
  },
  menuItemLi: {
    marginLeft: 8,
    marginRight: 8,
    width: 'auto'
  },
  selected: {
    backgroundColor: 'rgba(224, 170, 255, 0.15)',
    borderRadius: '12px',
    '& svg': {
      fill: colors.secondary.main
    },
    '& .MuiListItemText-root': {
      '& .MuiTypography-root': {
        fontWeight: 400,
        color: colors.background.main
      }
    }
  },
  notSelected: {
    borderRadius: '12px',
    '& svg': {
      fill: colors.text.secondary
    },
    '& .MuiListItemText-root': {
      '& .MuiTypography-root': {
        color: colors.text.secondary
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
    <Box display="flex" height={1} overflow="auto" style={{ overflowX: 'hidden', backgroundColor: colors.background.container }}>
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
              border: 'none !important',
              margin: downSM ? 0 : 2,
              height: downSM ? '100%' : 'calc(100% - 32px)',
              borderRadius: downSM ? 0 : '20px',
              background: `linear-gradient(180deg, #3a3a95 0%, #617caf 100%)`,
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.12)'
            }
          }),
          ...(!openDrawer && {
            ...closedMixin(theme),
            '& .MuiDrawer-paper': {
              ...closedMixin(theme),
              border: 'none !important',
              margin: downSM ? 0 : 2,
              height: downSM ? '100%' : 'calc(100% - 32px)',
              borderRadius: downSM ? 0 : '20px',
              background: `linear-gradient(180deg, #3a3a95 0%, #617caf 100%)`,
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.12)'
            }
          })
        }}
        className={styles.drawer}
        variant={downSM ? 'temporary' : 'persistent'}
        anchor="left"
        open={downSM ? openDrawer : true}
      >
        <Box
          display="flex"
          minHeight={100}
          alignItems="center"
          justifyContent="center"
        >
          {openDrawer && (
            <Box
              display="flex"
              alignItems="center"
              style={{ cursor: 'pointer' }}
              onClick={() => { setOpenDrawer(!openDrawer) }}
            >
              <Box width={210} height={200}>
                <Player
                  src={animation}
                  className="player"
                  loop
                  autoplay
                />
              </Box>
            </Box>
          )}

          {!openDrawer && (
            <IconButton onClick={() => { setOpenDrawer(!openDrawer) }}>
              <IconMenuHamburguer color={colors.text.secondary} />
            </IconButton>
          )}

        </Box>

        <List sx={{ flex: 1 }}>
          {MenuItems.map((menuItem, index) => (
            <ListItem
              disablePadding
              key={`${menuItem.title}-${index}`}
              className={`${isCurrentPath(menuItem.paths) ? styles.selected : styles.notSelected} ${openDrawer && styles.menuItemLi}`}
              onClick={() => { switchRoute(menuItem.path) }}
            >
              <ListItemButton className={styles.buttonList}>
                <ListItemIcon style={{ minWidth: openDrawer ? 56 : 35 }}>
                  {menuItem.icon()}
                </ListItemIcon>

                {openDrawer && (
                  <ListItemText className={styles.menuItemOpened} primary={<Typography variant="body2" fontWeight={400}>{menuItem.title}</Typography>} />
                )}

                {isCurrentPath(menuItem.paths) && (
                  <Divider orientation="vertical" className={styles.divider} />
                )}
              </ListItemButton>
            </ListItem>
          ))}
        </List>

        <Box textAlign="center" pt={1} mb={2} sx={{ borderTop: `1px solid ${colors.text.light}` }}>
          <Typography variant="body2" color={colors.text.light}>
            Granna v1.1.0
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
