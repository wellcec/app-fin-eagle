import React, { type PropsWithChildren } from 'react'
import {
  Box, Modal as ComponentModal, Fade, IconButton, Paper, type Theme, Typography
} from '@mui/material'
import CloseIcon from '@mui/icons-material/Close'
import { makeStyles } from '@mui/styles'
import colors from '~/layout/theme/colors'

const useStyles = makeStyles((theme: Theme) => {
  return ({
    modal: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      margin: theme.spacing(1),
      height: `calc(100% - ${theme.spacing(2)})`
    },
    paper: {
      maxWidth: '90%',
      maxHeight: '100%',
      position: 'relative',
      paddingTop: theme.spacing(7),
      padding: theme.spacing(3),
      // overflow: 'hidden',

      '@media (max-height: 950px)': {
        overflowY: 'auto'
        // height: 'calc(100vh - 120px)'
      },

      [theme.breakpoints.down('sm')]: {
        width: '96%'
      },

      '& .MuiPaper-root': {
        maxWidth: '100% !important',
        maxHeight: '100%',
        height: '100%',
        borderRadius: 0
      }
    },
    close: {
      cursor: 'pointer',
      position: 'absolute',
      top: theme.spacing(2),
      right: theme.spacing(2)
    },
    title: {
      position: 'absolute',
      top: theme.spacing(2)
    },
    decorator: {
      width: 70,
      height: 5,
      borderRadius: 30,
      backgroundColor: colors.primary.main,
      opacity: '0.8'
    }
  })
})

interface IProps {
  color?: string
  open: boolean
  title?: string
  handleClose: () => void
}

const Modal = ({
  color, open, title, handleClose, children
}: PropsWithChildren<IProps>): React.JSX.Element => {
  const styles = useStyles()

  return (
    <ComponentModal
      open={open}
      onClose={handleClose}
      closeAfterTransition
    >
      <Fade in={open}>
        <Box className={styles.modal}>
          <Paper className={styles.paper} style={{ border: color ? `2px solid ${color}` : 'none' }}>
            {title && (
              <Box className={styles.title}>
                <Typography variant="h6" color="text.main" fontWeight={400}>
                  {title}
                </Typography>
              </Box>
            )}

            <IconButton title="Fechar" className={styles.close} onClick={handleClose}>
              <CloseIcon />
            </IconButton>

            <Box mt={1}>
              {children}
            </Box>
          </Paper>
        </Box>
      </Fade>
    </ComponentModal>
  )
}

Modal.defaultProps = {
  title: undefined
}

export default Modal
