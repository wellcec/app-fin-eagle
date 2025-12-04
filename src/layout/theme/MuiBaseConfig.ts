import MuiPaper from './MuiPaper'
import MuiTypography from './MuiTypography'
import { buttonStyle, buttonPrimaryStyle } from './MuiButton'
import { Direction } from '@mui/material'

type VariantType = 'standard' | 'outlined' | 'filled' | undefined

const muiBaseConfig = {
  props: {
    MuiModal: {
      disablePortal: true,
      disableEnforceFocus: true
    },
    MuiPopper: {
      disablePortal: true,
      disableEnforceFocus: true
    },
    MuiAutocomplete: {
      disablePortal: false
    }
  },
  direction: 'ltr' as Direction | undefined,
  sizes: {
    header: 270,
    nav: window.innerWidth < 960 ? '100%' : 300
  },
  typography: { ...MuiTypography },
  components: {
    MuiPickersToolbar: {
      styleOverrides: {
        root: {
          color: '#bbdefb',
          borderRadius: '2px',
          borderWidth: '1px',
          borderColor: '#2196f3',
          border: '1px solid',
          backgroundColor: '#0d47a1'
        }
      }
    },
    MuiButton: {
      styleOverrides: {
        text: {
          ...buttonStyle,
          padding: 5,
          minWidth: 0
        },
        outlined: buttonStyle,
        containedPrimary: buttonPrimaryStyle,
        containedWarning: buttonPrimaryStyle,
        containedError: buttonPrimaryStyle,
        containedInfo: buttonPrimaryStyle,
        containedSuccess: {
          ...buttonPrimaryStyle,
          color: '#fff'
        },
        containedSecondary: buttonStyle
      }
    },
    MuiInput: {
      styleOverrides: {
        underline: {
          '&:hover:not($disabled):not($focused):not($error):before': {
            borderBottomColor: '#949494'
          }
        },
        colorSecondary: {
          '&$focused::after': {
            borderBottomColor: '#595959'
          },
          '&.MuiInput-underline::after': {
            borderBottomColor: '#595959'
          }
        }
      }
    },
    MuiInputBase: {
      styleOverrides: {
        root: {
          // '& fieldset.MuiOutlinedInput-notchedOutline': {
          //   borderColor: '#949494',
          // },
          // '&$disabled': {
          //   background: '#F4F4F4',
          // },
          '& .MuiAutocomplete-input': {
            height: '1.46rem'
          }
        }
      }
    },
    // MuiOutlinedInput: {
    //   styleOverrides: {
    //     root: {
    //       borderRadius: 25,
    //     },
    //   },
    // },
    MuiSelect: {
      defaultProps: {
        variant: 'standard' as VariantType
      }
    },
    MuiTextField: {
      defaultProps: {
        variant: 'standard' as VariantType
      }
    },
    MuiFormLabel: {
      styleOverrides: {
        root: {
          fontSize: 14
        },
        colorSecondary: {
          '&.Mui-focused': {
            color: '#595959'
          }
        }
      }
    },
    MuiFormHelperText: {
      styleOverrides: {
        root: {
          marginLeft: 0
        }
      }
    },
    MuiPaper: {
      styleOverrides: { ...MuiPaper }
    }
  },
  breakpoints: {
    values: {
      xs: 0,
      sm: 600,
      md: 960,
      lg: 1280,
      xl: 1440
    }
  }
}

export default muiBaseConfig
