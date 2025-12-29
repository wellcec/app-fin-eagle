import React from 'react'
import AddIcon from '@mui/icons-material/Add'
import { Box, Button } from '@mui/material'

interface IProps {
  label: string
  handleClick: () => void
}

const AddButton = ({ label, handleClick }: IProps) => {
  return (
    <Button variant="contained" color="success" onClick={handleClick}>
      <Box display="flex" alignItems="center" gap={1}>
        <Box display="flex">
          <AddIcon />
        </Box>

        <Box>
          {label}
        </Box>
      </Box>
    </Button>
  )
}

export default AddButton
