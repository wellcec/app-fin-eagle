import React, { useEffect, useState } from 'react'
import { Box } from '@mui/material'

import categoriesRepository, { GoalWithProgressType } from '~/client/repository/categoriesRepository'
import GoalProgressItem from './fragments/GoalProgressItem'
import { CategoryTypeEnum } from '~/constants/categories'

const DebitsProgress = (): React.JSX.Element => {
  const [debits, setDebits] = useState<GoalWithProgressType[]>([])
  const { getDebitsWithProgress } = categoriesRepository()

  useEffect(() => {
    getDebitsWithProgress().then(
      (response) => {
        setDebits(response.filter((x) => !x.isAchieved))
      }
    )
  }, [])

  if (debits.length === 0) {
    return <></>
  }

  return (
    <Box flex="auto">
      <GoalProgressItem items={debits} title="Progresso das Dívidas" type={CategoryTypeEnum.Debit} />
    </Box>
  )
}

export default DebitsProgress
