import React, { type PropsWithChildren } from 'react'
import {
  Typography, Box
} from '@mui/material'
import makeStyles from '@mui/styles/makeStyles'
import Paper from './Paper'

const useStyles = makeStyles(() => ({
  paper: {
    overflowY: 'scroll',
    boxSizing: 'border-box',
    maxHeight: '100%',
    height: '100%',
    position: 'relative'
  }
}))

interface IProps {
  title: string
  isPaper?: boolean
  fullCard?: boolean
}

const ContainerMain = ({ title, fullCard = true, isPaper = true, children }: PropsWithChildren<IProps>): React.JSX.Element => {
  const styles = useStyles()

  return (
    <>
      <Box mb={2} flexGrow={0}>
        <Typography variant="h6" color="text.main">
          {title}
        </Typography>
      </Box>

      {fullCard && (
        <Box overflow="auto" height={1}>
          {isPaper && (
            <Paper className={styles.paper}>
              {children}
            </Paper>
          )}

          {!isPaper && (
            <Box className={styles.paper}>
              {children}
            </Box>
          )}
        </Box>
      )}

      {!fullCard && children}
    </>
  )
}

export default ContainerMain
