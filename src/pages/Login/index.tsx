import React, { useState } from 'react'
import { Box, Button, IconButton, InputAdornment, OutlinedInput, Typography } from '@mui/material'

import makeStyles from '@mui/styles/makeStyles'
import Paper from '~/components/layout/Paper'
import bg from '../../assets/images/bg-login.svg'
import logo from '../../assets/images/logogranna.png'
import { IconLock } from '~/constants/icons'
import usersRepository from '~/client/repository/usersRepository'
import { useLoginContext } from '~/routes/context'
import { useNavigate } from 'react-router'
import useAlerts from '~/shared/alerts/useAlerts'

const useStyles = makeStyles(() => ({
  paper: {
    border: '1px solid #ccc',
    borderRadius: 70
  },
  inputPassword: {
    fontSize: 14,
    height: 50,
    borderRadius: 30,
    paddingLeft: 23,
    '& .MuiOutlinedInput-notchedOutline': {
      borderColor: '#e7e5e5d9'
    }
  },
  button: {
    height: 50,
  }
}))

const LoginScreen = () => {
  const [pass, setPass] = useState<string>('');

  const styles = useStyles()
  const { getUser } = usersRepository()
  const { setLogged } = useLoginContext()
  const { notifyWarning, notifyError } = useAlerts()
  const navigate = useNavigate()

  const handleLogin = () => {
    getUser(pass).then(
      (user) => {
        const authenticated = user?.id !== null && user?.id !== undefined && user?.id !== ''
        setLogged(authenticated)

        if (authenticated) {
          navigate('/')
          return
        }

        notifyWarning('Senha incorreta. Tente novamente.')
      },
      () => {
        setLogged(false)
        notifyError('Erro ao autenticar. Tente novamente mais tarde.')
      }
    )
  }

  const handleKeydown = (event: React.KeyboardEvent<HTMLDivElement>): void => {
    if (event.key === 'Enter') {
      event.preventDefault()
      handleLogin()
    }
  }

  return (
    <Box
      height={1}
      width={1}
      display="flex"
      justifyContent="center"
      alignItems="center"
      sx={{
        backgroundImage: `url(${bg})`,
        backgroundRepeat: 'no-repeat',
        backgroundSize: 'cover',
        backgroundPosition: 'center'
      }}
    >
      <Paper className={styles.paper}>
        <Box width={300} height={300} p={3} onKeyDown={handleKeydown}>
          <Box textAlign="center">
            <img src={logo} alt="Logo" style={{ width: 120 }} />
          </Box>

          <Box my={2}>
            <Typography variant="h5" align="center">
              Sign In
            </Typography>
          </Box>

          <Box mb={2}>
            <OutlinedInput
              autoFocus
              type="password"
              className={styles.inputPassword}
              fullWidth
              placeholder="Password"
              color="primary"
              size="medium"
              onChange={(e) => setPass(e.target.value)}
              startAdornment={(
                <InputAdornment position="start">
                  <IconButton edge="start">
                    <IconLock />
                  </IconButton>
                </InputAdornment>
              )}
            />
          </Box>

          <Button
            fullWidth
            variant="outlined"
            className={styles.button}
            onClick={handleLogin}
          >
            LOG IN
          </Button>
        </Box>
      </Paper>
    </Box>
  )
}

export default LoginScreen

