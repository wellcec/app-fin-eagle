import React from 'react'
import { Box, IconButton } from '@mui/material'
import CircleRoundedIcon from '@mui/icons-material/CircleRounded'
const { ipcRenderer } = window.require('electron')

const Controls = () => {
  const handleMinimize = () => {
    ipcRenderer.send('window-minimize')
  }

  const handleMaximize = () => {
    ipcRenderer.send('window-maximize')
  }

  const handleClose = () => {
    ipcRenderer.send('window-close')
  }

  return (
    <Box
      position="absolute"
      top={0}
      right={0}
      width={1}
      display="flex"
    >
      <Box className='controls-web-kit' />

      <Box>
        <IconButton color="info" onClick={handleMinimize}>
          <CircleRoundedIcon />
        </IconButton>

        <IconButton color="warning" onClick={handleMaximize}>
          <CircleRoundedIcon />
        </IconButton>

        <IconButton color="error" onClick={handleClose}>
          <CircleRoundedIcon />
        </IconButton>
      </Box>
    </Box>
  )
}

export default Controls