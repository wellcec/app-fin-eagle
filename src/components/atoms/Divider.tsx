import React from 'react'
import { Typography, Divider as ComponentDivider } from '@mui/material'
import makeStyles from '@mui/styles/makeStyles'

const useStyles = makeStyles(() => ({
  divider: {
    '&.MuiDivider-root::before': {
      width: 0
    },
    '& span.MuiDivider-wrapper': {
      paddingLeft: 0
    }
  }
}))

interface IProps {
  title: string
  hasControl?: boolean
}

const Divider = ({ title, hasControl }: IProps): React.JSX.Element => {
  const styles = useStyles()

  return (
    <ComponentDivider
      flexItem
      textAlign="left"
      orientation="horizontal"
      className={styles.divider}
      sx={{
        '&.MuiDivider-root::after': {
          width: '98%'
        }
      }}
      style={{ width: hasControl ? '92%' : '98%' }}
    >
      <Typography variant="body1" fontWeight={600}>
        {title}
      </Typography>
    </ComponentDivider>
  )
}

export default Divider
