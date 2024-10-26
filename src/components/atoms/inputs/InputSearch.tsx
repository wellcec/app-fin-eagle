import React from 'react'
import {
  FormControl, IconButton, InputAdornment, OutlinedInput
} from '@mui/material'
import makeStyles from '@mui/styles/makeStyles'

import { IconSearch } from '~/constants/icons'

const useStyles = makeStyles(() => ({
  inputSearch: {
    borderRadius: 30,
    paddingLeft: 23,
    '& .MuiOutlinedInput-notchedOutline': {
      borderColor: '#e7e5e5d9'
    }
  }
}))

interface IProps {
  placeholder: string
  onChange: (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void
}

const InputSearch = ({ placeholder, onChange }: IProps): React.JSX.Element => {
  const styles = useStyles()

  return (
    <FormControl variant="outlined" fullWidth>
      <OutlinedInput
        className={styles.inputSearch}
        fullWidth
        placeholder={placeholder}
        color="secondary"
        onChange={onChange}
        size="small"
        startAdornment={(
          <InputAdornment position="start">
            <IconButton edge="start">
              <IconSearch />
            </IconButton>
          </InputAdornment>
        )}
      />
    </FormControl>
  )
}

export default InputSearch
