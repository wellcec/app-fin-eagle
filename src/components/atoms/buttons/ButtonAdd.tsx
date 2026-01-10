import React from 'react'
import { Box, Fab } from '@mui/material'
import AddIcon from '@mui/icons-material/Add'
import makeStyles from '@mui/styles/makeStyles'

const useStyles = makeStyles(() => ({
  buttonAdd: {
    maxHeight: 46,
    maxWidth: 46,
    zIndex: 'auto',

    '& svg': {
      color: '#fff',
      fill: '#fff'
    }
  }
}))

interface IProps {
  title: string
  onClick: () => void
}

const ButtonAdd = ({ title, onClick }: IProps): React.JSX.Element => {
  const styles = useStyles()

  return (
    <Fab color="success" title={title} className={styles.buttonAdd} onClick={onClick}>
      <Box display="flex" alignItems="center">
        <AddIcon />
      </Box>
    </Fab>
  )
}

export default ButtonAdd
