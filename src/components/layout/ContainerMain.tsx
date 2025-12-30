import React, { useMemo, type PropsWithChildren } from 'react'
import {
  Typography, Box
} from '@mui/material'
import makeStyles from '@mui/styles/makeStyles'
import Paper from './Paper'
import { MenuItems } from '~/constants/menus'
import { getDate, getDay, getMonth, getYear } from 'date-fns'
import { LABEL_DAYS, LABEL_MONTHS } from '~/constants'

const useStyles = makeStyles(() => ({
  paper: {
    overflowY: 'auto',
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

  const item = useMemo(() => MenuItems.find((menu) => menu.title === title), [title])

  const dateText = useMemo(() => {
    const currentDate = new Date()
    const day = getDate(currentDate)
    const month = getMonth(currentDate)
    const year = getYear(currentDate)
    const dayWeek = getDay(currentDate)

    return `${LABEL_DAYS[dayWeek]}, ${day} de ${LABEL_MONTHS[month]} de ${year}`
  }, [title])

  return (
    <>
      <Box mb={2}>
        <Paper>
          <Box
            display="flex"
            alignItems="center"
            justifyContent="space-between"
          >
            <Box display="flex" gap={2} alignItems="center">
              <Box display="flex" alignItems="center">
                {item?.icon(30)}
              </Box>

              <Typography variant="subtitle1" color="text.main">
                {title}
              </Typography>
            </Box>

            <Box>
              <Typography variant="body2" color="text.tertiary">
                {dateText}
              </Typography>
            </Box>
          </Box>
        </Paper>
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
