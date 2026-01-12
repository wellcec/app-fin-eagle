import React, { useEffect, useState } from 'react'
import { Box } from '@mui/material'
import ContainerMain from '~/components/layout/ContainerMain'
import { Titles } from '~/constants/menus'
import categoriesRepository, { GoalWithProgressType } from '~/client/repository/categoriesRepository'
import GoalProgressItem from '../Dashboard/fragments/GoalProgressItem'
import { CategoryTypeEnum } from '~/constants/categories'

const Archieveds = () => {
  const [goals, setGoals] = useState<GoalWithProgressType[]>([])
  const [debits, setDebits] = useState<GoalWithProgressType[]>([])

  const { getGoalsWithProgress, getDebitsWithProgress } = categoriesRepository()

  useEffect(() => {
    getGoalsWithProgress().then(
      (response) => {
        setGoals(response.filter((x) => x.isAchieved))
      }
    )

    getDebitsWithProgress().then(
      (response) => {
        setDebits(response.filter((x) => x.isAchieved))
      }
    )
  }, [])

  return (
    <ContainerMain title={Titles.ARCHIEVED} fullCard={false}>
      <Box overflow="auto" flexGrow={1} pr={1}>
        <Box mb={2}>
          <GoalProgressItem items={debits} title="Dívidas concluídas" type={CategoryTypeEnum.Debit} />
        </Box>

        <Box mb={2}>
          <GoalProgressItem items={goals} title="Metas concluídas" type={CategoryTypeEnum.Goal} />
        </Box>
      </Box>
    </ContainerMain>
  )
}

export default Archieveds