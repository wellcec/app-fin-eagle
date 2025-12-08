import React from 'react'
import { Box, Checkbox, FormControlLabel, FormGroup } from '@mui/material'
import StarIcon from '@mui/icons-material/Star'
import StarBorderIcon from '@mui/icons-material/StarBorder'
import colors from '~/layout/theme/colors'

interface IProps {
  checked?: boolean
  onChange: (event: React.ChangeEvent<HTMLInputElement>, checked: boolean) => void
  rest?: any
}

const CheckBoxGoal = ({ onChange, checked, ...rest }: IProps): React.JSX.Element => {
  const onChangeComponent = (event: React.ChangeEvent<HTMLInputElement>, checked: boolean) => {
    onChange(event, checked)
  }

  return (
    <FormGroup>
      <FormControlLabel
        style={{ display: 'flex', justifyContent: 'center' }}
        control={
          <Checkbox
            checked={checked}
            onChange={onChangeComponent}
            icon={<StarBorderIcon htmlColor={colors.danger.main} />} checkedIcon={<StarIcon htmlColor={colors.danger.main} />}
            {...rest}
          />
        }
        label={
          <Box lineHeight={0}>
            Definir como meta?
          </Box>
        }
      />
    </FormGroup>
  )
}

export default CheckBoxGoal
