import React from 'react'
import {
  Box, Button, Divider, IconButton, List, ListItem, ListItemButton,
  ListItemIcon, ListItemText, Drawer as MuiDrawer, Typography,
  useTheme, type Theme
} from '@mui/material'
import { Player } from '@lottiefiles/react-lottie-player'
import { useLocation, useNavigate } from 'react-router-dom'
import { type CSSObject } from '@mui/material/styles'
import { IconMenuHamburguer } from '~/constants/icons'
import { MenuItems } from '~/constants/menus'
import Version from './Version'
import colors from './theme/colors'
import useStyles from './styles'

import animation from '~/assets/animations/Rupee Investment.json'
import { useLoginContext } from '~/routes/context'

const drawerWidth = 272
const paperWidth = 240

const openedMixin = (theme: Theme): CSSObject => ({
  width: paperWidth,
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

interface DrawerProps {
  openDrawer: boolean
  setOpenDrawer: (open: boolean) => void
  downSM: boolean
}

const Drawer = ({ openDrawer, setOpenDrawer, downSM }: DrawerProps) => {
  const styles = useStyles()
  const navigate = useNavigate()
  const location = useLocation()
  const theme = useTheme()
  const { username, setLogged, setUserId, setUsername } = useLoginContext()

  const switchRoute = (path: string): void => {
    if (downSM) {
      setOpenDrawer(false)
    }

    navigate(path)
  }

  const handleSignOut = () => {
    setLogged(false)
    setUserId('')
    setUsername('')
  }

  const isCurrentPath = (paths: string[]): boolean => paths.includes(location.pathname)

  return (
    <MuiDrawer
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
            pt={4}
            display="flex"
            alignItems="center"
            flexDirection="column"
            style={{ cursor: 'pointer' }}
            onClick={() => { setOpenDrawer(!openDrawer) }}
          >
            <Box width={210} height={200} mb={2}>
              <Player
                src={animation}
                className="player"
                loop
                autoplay
              />
            </Box>

            <Box mb={1}>
              <Typography variant="subtitle1" color="primary">
                Olá, {username}
              </Typography>
            </Box>

            <Box width={1}>
              <Button variant="text" color="error" fullWidth onClick={handleSignOut}>
                Sair
              </Button>
            </Box>
          </Box>
        )}


        {!openDrawer && (
          <IconButton onClick={() => { setOpenDrawer(!openDrawer) }}>
            <IconMenuHamburguer color={colors.text.secondary} />
          </IconButton>
        )}
      </Box>

      <Box className={styles.borderAnimation} />

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

      <Box className={styles.borderAnimation} />

      <Box textAlign="center" pt={0.5} mb={2}>
        <Version />
      </Box>
    </MuiDrawer>
  )
}

export default Drawer