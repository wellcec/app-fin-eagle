import React from 'react'
import { Chip as ChipCustom } from '@mui/material'

import makeStyles from '@mui/styles/makeStyles'

const useStyles = makeStyles(() => ({
  root: {
    height: 'unset',
    paddingBottom: 4,
    paddingTop: 4
  }
}))

interface IProps {
  label?: string
  fullWidth?: boolean
  color: string
}

const Chip = ({ label, color, fullWidth = false }: IProps) => {
  const styles = useStyles()

  return (
    <ChipCustom
      className={styles.root}
      label={label ?? null}
      variant="filled"
      style={{
        color: 'white',
        backgroundColor: color,
        ...(fullWidth && ({
          width: '100%'
        }))
      }}
    />
  )
}

export default Chip