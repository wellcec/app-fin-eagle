import makeStyles from '@mui/styles/makeStyles'

import colors from './theme/colors'

const useStyles = makeStyles(() => ({
  buttonList: {
    paddingTop: 15,
    paddingBottom: 15,
    borderRadius: 10
  },
  menuItemOpened: {
    marginTop: 0,
    marginBottom: 0
  },
  drawer: {
    '& .MuiPaper-root': {
      border: 'none'
    }
  },
  divider: {
    border: colors.primary.main,
    background: colors.primary.main,
    borderWidth: 10,
    width: 6,
    height: 20,
    borderRadius: 10
  },
  menuItemLi: {
    marginLeft: 8,
    marginRight: 8,
    width: 'auto'
  },
  selected: {
    backgroundColor: 'rgba(224, 170, 255, 0.15)',
    borderRadius: '12px',
    '& svg': {
      fill: colors.primary.main
    },
    '& .MuiListItemText-root': {
      '& .MuiTypography-root': {
        fontWeight: 400,
        color: colors.primary.main
      }
    }
  },
  notSelected: {
    borderRadius: '12px',
    '& svg': {
      fill: colors.primary.main
    },
    '& .MuiListItemText-root': {
      '& .MuiTypography-root': {
        color: colors.primary.main
      }
    }
  },
  borderAnimation: {
    borderRadius: 10,
    margin: '24px 16px 10px 16px',
    border: `1px solid ${colors.text.light}`
  }
}))

export default useStyles
