import React, { useEffect, useState } from 'react'
import { Box } from '@mui/material'

import categoriesRepository, { GoalWithProgressType } from '~/client/repository/categoriesRepository'
import GoalProgressItem from './fragments/GoalProgressItem'
import { CategoryTypeEnum } from '~/constants/categories'

const GoalProgress = (): React.JSX.Element => {
  const [goals, setGoals] = useState<GoalWithProgressType[]>([])

  const { getGoalsWithProgress } = categoriesRepository()

  useEffect(() => {
    getGoalsWithProgress().then(
      (response) => {
        setGoals(response.filter((x) => !x.isAchieved))
      }
    )
  }, [])

  if (goals.length === 0) {
    return <></>
  }

  return (
    <Box flex="auto">
      <GoalProgressItem items={goals} title="Progresso das Metas" type={CategoryTypeEnum.Goal} />
    </Box>
  )
}

export default GoalProgress
