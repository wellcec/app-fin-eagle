import React, { type PropsWithChildren } from 'react'
import PropTypes from 'prop-types'
import {
  Paper as PaperCustom
} from '@mui/material'
import makeStyles from '@mui/styles/makeStyles'

const useStyles = makeStyles(() => ({
  paper: {
    padding: 24
  },
  paperGrid: {
    paddingLeft: 24,
    paddingRight: 24,
    paddingTop: 10,
    paddingBottom: 10
  },
  fullWidth: {
    width: '100%'
  }
}))

interface IProps {
  className?: string
  fullWidth?: boolean
  grid?: boolean
  color?: string
}

const Paper = ({ children, className = '', fullWidth = false, grid = false, color }: PropsWithChildren<IProps>): React.JSX.Element => {
  const styles = useStyles()

  const fullWidthClass = fullWidth ? styles.fullWidth : ''

  return (
    <PaperCustom
      className={`${grid ? styles.paperGrid : styles.paper} ${className} ${fullWidthClass}`}
      style={{
        ...(color && {
          border: `1px solid ${color}`,
          // borderLeft: `6px solid ${color}`,
          // borderLeftStyle: 'solid',
          // borderEndStartRadius: 12,
          // borderStartStartRadius: 12,
        })
      }}
    >
      {children}
    </PaperCustom>
  )
}

Paper.propTypes = {
  className: PropTypes.string,
  fullWidth: PropTypes.bool
}

export default Paper
