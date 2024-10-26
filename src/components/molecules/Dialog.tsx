import React, { type PropsWithChildren } from 'react'
import {
  Box,
  Button,
  Dialog as ComponentDialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography
} from '@mui/material'

interface IProps {
  open: boolean
  title: string
  handleCloseConfirm: () => void
  handleDelete: () => void
}

const Dialog = ({
  open, title, handleCloseConfirm, handleDelete, children
}: PropsWithChildren<IProps>): React.JSX.Element => (
  <ComponentDialog
    keepMounted
    open={open}
    onClose={handleCloseConfirm}
  >
    <DialogTitle>
      <Typography variant="subtitle1" color="text.main" component="span">
        {title}
      </Typography>
    </DialogTitle>
    <DialogContent>
      <Box pt={2.4}>
        {children}
      </Box>
    </DialogContent>

    <DialogActions>
      <Box display="flex" gap={2} m={2}>
        <Button variant="outlined" onClick={handleCloseConfirm}>Cancelar</Button>
        <Button variant="contained" onClick={handleDelete}>Confirmar</Button>
      </Box>
    </DialogActions>
  </ComponentDialog>
)

export default Dialog
