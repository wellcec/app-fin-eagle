import React, { useState, useEffect } from 'react'
import Stack from '@mui/material/Stack'
import Snackbar from '@mui/material/Snackbar'
import Alert from '@mui/material/Alert'
import Typography from '@mui/material/Typography'
import { isEmpty } from 'lodash'
import { useAlertsContext } from '../../shared/alerts/AlertContext'
import { ALERT_TYPES } from '../../models'

const Alerts = (): React.JSX.Element => {
  const [open, setOpen] = useState<boolean>(false)
  const { alert, setAlert } = useAlertsContext()

  const handleClose = (_?: React.SyntheticEvent | Event, reason?: string): void => {
    if (reason === 'clickaway') {
      return
    }

    setOpen(false)
    setAlert({ type: ALERT_TYPES.info, message: '' })
  }

  useEffect(() => {
    if (!isEmpty(alert.message)) {
      setOpen(true)
    }
  }, [alert])

  return (
    <>
      {open && (
        <Stack spacing={2} sx={{ width: '100%' }}>
          <Snackbar
            open={open}
            onClose={handleClose}
            autoHideDuration={4000}
            anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
          >
            <Alert onClose={handleClose} severity={alert.type} sx={{ width: '100%' }} variant="filled">
              <Typography variant="body1">
                {alert.message}
              </Typography>
            </Alert>
          </Snackbar>
        </Stack>
      )}
    </>

  )
}

export default Alerts
