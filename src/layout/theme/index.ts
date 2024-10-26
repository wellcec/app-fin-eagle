import { createTheme as createMuiTheme, responsiveFontSizes, Theme } from '@mui/material/styles'
import { merge } from 'lodash'
import MuiBaseConfig from './MuiBaseConfig'
import colors from './colors'
import { DEFAULT_THEME } from '../../constants'

export const createTheme = (color = DEFAULT_THEME): Theme => {
  const configs = {
    name: color.id,
    palette: colors
  }

  const options = merge({}, MuiBaseConfig, configs)
  // @ts-expect-error
  const theme = createMuiTheme(options, [{ size: 10 }])
  return responsiveFontSizes(theme)
}

export default createTheme
