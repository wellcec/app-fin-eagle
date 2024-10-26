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
  label: string
  color: string
}

const Chip = ({ label, color }: IProps) => {
  const styles = useStyles()

  return (
    <ChipCustom
      className={styles.root}
      label={label}
      variant="filled"
      style={{
        color: 'white',
        backgroundColor: color
      }}
    />
  )
}

export default Chip