import React, { useCallback, useEffect, useState } from 'react'
import { Box, Grid, IconButton, Typography } from '@mui/material'
import makeStyles from '@mui/styles/makeStyles'
import MoreVertIcon from '@mui/icons-material/MoreVert'

import usersRepository from '~/client/repository/usersRepository'
import colors from '~/layout/theme/colors'
import useAlerts from '~/shared/alerts/useAlerts'
import ContainerMain from '~/components/layout/ContainerMain'
import Paper from '~/components/layout/Paper'
import { UsersType } from '~/client/models/users'

const useStyles = makeStyles(() => ({
  item: {
    borderBottom: `1px solid ${colors.text.light}`
  },
  paperList: {
    width: '100%',
    overflow: 'auto'
  }
}))

const List = (): React.JSX.Element => {
  const styles = useStyles()

  const [users, setUsers] = useState<UsersType[]>([])

  const { getUsers } = usersRepository()
  const { notifySuccess } = useAlerts()

  const getAllUsers = useCallback(() => {
    getUsers().then((items) => {
      setUsers(items)
      notifySuccess('Successfully')
    })
  }, [])

  useEffect(() => {
    getAllUsers()
  }, [])

  return (
    <ContainerMain title="Usuários" fullCard={false}>
      <Box mb={2} flexGrow={0}>
        <Paper>
          <Grid container display="flex" alignItems="center">
            <Grid item xs={12} md={4}>
              <Typography variant="body1" fontWeight={600}>Nome</Typography>
            </Grid>

            <Grid item xs={12} md={8}>
              <Typography variant="body1" fontWeight={600}>Documento</Typography>
            </Grid>
          </Grid>
        </Paper>
      </Box>

      <Box display="flex" height={1} overflow="auto" flexGrow={1}>
        <Paper className={styles.paperList}>
          {users.map((item, index) => (
            <Box key={index} className={styles.item} pb={1} mb={2}>
              <Grid container display="flex" alignItems="center">
                <Grid item xs={12} md={4}>
                  <Typography variant="body2">{item.name}</Typography>
                </Grid>

                <Grid item xs={12} md={4}>
                  <Typography variant="body2">{item.idSerie}</Typography>
                </Grid>

                <Grid item xs={12} md={4} display="flex" alignItems="flex-end" justifyContent="flex-end">
                  <IconButton>
                    <MoreVertIcon />
                  </IconButton>
                </Grid>
              </Grid>
            </Box>
          ))}
        </Paper>
      </Box>
    </ContainerMain>
  )
}

export default List
