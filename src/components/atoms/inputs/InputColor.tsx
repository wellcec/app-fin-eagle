import React from 'react'
import makeStyles from '@mui/styles/makeStyles'
import { Box } from '@mui/material'
import InputColors from 'react-input-color'

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

  const change = (color: ColorType): void => {
    rest.onChange(color.hex)
  }

  return (
    <Box className={styles.input}>
      <InputColors
        initialValue="#5e72e4"
        onChange={change}
        placement="right"
      />
    </Box>
  )
}

export default InputColor
