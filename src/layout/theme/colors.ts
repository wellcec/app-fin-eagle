import { PaletteMode } from '@mui/material'
import { DEFAULT_THEME } from '../../constants'

const mode: PaletteMode = 'light'

const colors = {
  mode,
  primary: {
    main: DEFAULT_THEME.primary,
    footer: '#0B2049',
    dark: '#0b2049d1'
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
    main: '#FFAE1F',
    background: '#fef5e5'
  },
  error: {
    main: '#C3284C',
    light: '#FA896B',
    background: '#fdede8'
  },
  active: {
    main: '#19BDDD'
  },
  success: {
    main: '#34C575',
    light: '#13DEB9',
    background: '#e6fffa'
  }
}

export default colors
