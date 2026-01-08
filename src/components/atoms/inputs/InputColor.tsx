import React, { useState } from 'react'
import makeStyles from '@mui/styles/makeStyles'
import { Box } from '@mui/material'
import { SwatchesPicker } from 'react-color'

type ColorType = {
  hex: string
}

const useStyles = makeStyles(() => ({
  input: {
    '& > span': {
      width: 36,
      height: 36,
      border: 'none',
      padding: 0,
      borderRadius: 50,
      overflow: 'hidden'
    }
  }
}))

const InputColor = ({ ...rest }): React.JSX.Element => {
  const styles = useStyles()
  const [current, setCurrent] = useState<string>()

  const change = (color: ColorType): void => {
    setCurrent(color.hex)
    rest.onChange(color.hex)
  }

  return (
    <Box className={styles.input}>
      <SwatchesPicker height={300} onChange={change} hex={current} color={current} />
    </Box>
  )
}

export default InputColor
