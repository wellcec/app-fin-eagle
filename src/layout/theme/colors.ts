import { PaletteMode } from '@mui/material'
import { DEFAULT_THEME } from '../../constants'

const mode: PaletteMode = 'light'

const colors = {
  mode,
  primary: {
    main: DEFAULT_THEME.primary,
    footer: '#0B2049',
    dark: '#0b2049d1'
    // light: color.primary,
  },
  secondary: {
    main: '#EFEFEF',
    contrastText: '#8B7676',
    button: '#1657d3'
  },
  background: {
    main: '#fff',
    container: '#f0f0f9'
  },
  info: {
    light: '#ECF8FF',
    main: '#A2EAF3',
    secondary: '#6EDFEE'
    // dark: '#1BD4ED',
  },
  text: {
    main: '#0B2049',
    light: '#E5E5E5',
    primary: '#0E347D',
    secondary: '#B1B3C9',
    tertiary: '#6E7191',
    quaternary: '#3F4159',
    quintenary: '#4368AD'
  },
  danger: {
    main: '#FFC654'
  },
  error: {
    main: '#C3284C'
  },
  active: {
    main: '#19BDDD'
  },
  success: {
    main: '#34C575'
  }
}

export default colors
