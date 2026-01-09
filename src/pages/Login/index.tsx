import React, { useCallback, useEffect, useState } from 'react'
import { Box, Button, IconButton, InputAdornment, OutlinedInput, Typography } from '@mui/material'

import makeStyles from '@mui/styles/makeStyles'
import Paper from '~/components/layout/Paper'
import bgRaw from '../../assets/images/bg-login.svg?raw'
import logo from '../../assets/images/logogranna.png'
import { IconEyeClosed, IconEyeOpened, IconLock, IconUser } from '~/constants/icons'
import usersRepository from '~/client/repository/usersRepository'
import { useLoginContext } from '~/routes/context'
import { useNavigate } from 'react-router'
import useAlerts from '~/shared/alerts/useAlerts'
import { UsersType } from '~/client/models/users'

const bg = `data:image/svg+xml,${encodeURIComponent(bgRaw)}`

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
  },
  login: {
    backgroundImage: `url("${bg}")`,
    backgroundRepeat: 'no-repeat',
    backgroundSize: 'cover',
    backgroundPosition: 'center'
  }
}))

const LoginScreen = () => {
  const [pass, setPass] = useState<string>('')
  const [secpass, setSecpass] = useState<string>('')
  const [name, setName] = useState<string>('')
  const [isFirstAccess, setIsFirstAccess] = useState<boolean>(false)
  const [viewpass, setViewpass] = useState<boolean>(false);

  const styles = useStyles()
  const { createUser, getUser, getCountUsers } = usersRepository()
  const { setLogged, setUserId, setUsername } = useLoginContext()
  const { notifyWarning, notifyError } = useAlerts()
  const navigate = useNavigate()

  const _getCountUsers = useCallback(() => {
    getCountUsers().then(
      (response) => {
        setIsFirstAccess(response === 0)
      }
    )
  }, [getCountUsers]);

  const handleLogin = async () => {
    if (isFirstAccess) {
      if (!name.trim() || !pass.trim() || !secpass.trim()) {
        notifyWarning('Preencha todos os campos.')
        return
      }

      if (pass !== secpass) {
        notifyWarning('As senhas devem ser iguais.')
        return
      }

      const newUser: UsersType = {
        id: '',
        password: pass,
        name: name.trim()
      }

      const response = await createUser(newUser)

      if (response === null) {
        notifyError('Erro ao criar usuário. Tente novamente.')
        setLogged(false)
        return
      }

      setLogged(true)
      setUserId(response.id)
      setUsername(response.name)
      navigate('/home')

    } else {
      if (!pass.trim()) {
        notifyWarning('Digite sua senha.')
        return
      }

      const user = await getUser(pass)

      if (!user?.id) {
        notifyWarning('Senha incorreta. Tente novamente.')
        setLogged(false)
        return
      }

      setLogged(true)
      setUserId(user.id)
      setUsername(user.name)
      navigate('/home')
    }
  }

  const handleKeydown = (event: React.KeyboardEvent<HTMLDivElement>): void => {
    if (event.key === 'Enter') {
      event.preventDefault()
      handleLogin()
    }
  }

  useEffect(() => {
    _getCountUsers()
  }, [])

  return (
    <Box
      height={1}
      width={1}
      display="flex"
      justifyContent="center"
      alignItems="center"
      className={styles.login}
    >
      <Paper className={styles.paper}>
        <Box maxWidth={500} p={3} onKeyDown={handleKeydown}>
          <Box textAlign="center">
            <img src={logo} alt="Logo" style={{ width: isFirstAccess ? 50 : 120 }} />
          </Box>

          {!isFirstAccess && (
            <>
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
            </>
          )}

          {isFirstAccess && (
            <Box mb={2}>
              <Box mb={2}>
                <Typography variant="h6" mb={1}>
                  Bem-vindo(a) ao Granna!
                </Typography>

                <Typography variant="body1" mb={1}>
                  O seu app de controle financeiro pessoal que <b> não foi gerado por IA, não possui integração com nenhuma delas e sem modais te oferecendo upgrade de plano, pacote premium ou recarga de tokens para a IA</b> 😁
                </Typography>

                <Typography variant="body1" mb={1}>
                  Esse app é <b>gratuito</b>. Caso veja alguém vendendo cópias denuncie!
                </Typography>


                <Typography variant="body1" mb={1}>
                  Como é seu primeiro acesso, preciso que informe o seu nome que aparecerá no app e uma senha para acesso.
                </Typography>

                <Typography variant="body1">
                  <b>Muita calma!</b> Essa senha não poderá ser alterada pois o dev está com preguiça de desenvolver a feature de reset de senha.
                </Typography>
              </Box>

              <Box mb={1}>
                <OutlinedInput
                  autoFocus
                  className={styles.inputPassword}
                  fullWidth
                  placeholder="Seu nome"
                  color="primary"
                  size="medium"
                  onChange={(e) => setName(e.target.value)}
                  startAdornment={(
                    <InputAdornment position="start">
                      <IconButton edge="start">
                        <IconUser />
                      </IconButton>
                    </InputAdornment>
                  )}
                />
              </Box>

              <Box mb={1}>
                <OutlinedInput
                  type={viewpass ? 'text' : 'password'}
                  className={styles.inputPassword}
                  fullWidth
                  placeholder="Password"
                  color="primary"
                  size="medium"
                  onChange={(e) => setPass(e.target.value)}
                  startAdornment={(
                    <InputAdornment position="start">
                      <IconButton edge="start" onClick={() => { setViewpass(!viewpass) }}>
                        {viewpass ? <IconEyeOpened /> : <IconEyeClosed />}
                      </IconButton>
                    </InputAdornment>
                  )}
                />
              </Box>

              <Box>
                <OutlinedInput
                  type="password"
                  className={styles.inputPassword}
                  fullWidth
                  placeholder="Password novamente"
                  color="primary"
                  size="medium"
                  onChange={(e) => setSecpass(e.target.value)}
                  startAdornment={(
                    <InputAdornment position="start">
                      <IconButton edge="start">
                        <IconLock />
                      </IconButton>
                    </InputAdornment>
                  )}
                />
              </Box>
            </Box>
          )}

          <Button
            fullWidth
            variant="outlined"
            className={styles.button}
            onClick={handleLogin}
          >
            {isFirstAccess ? 'CREATE ACCOUNT' : 'LOG IN'}
          </Button>
        </Box>
      </Paper>
    </Box>
  )
}

export default LoginScreen

