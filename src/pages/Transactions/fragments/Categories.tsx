import React from 'react'
import { Box, MenuItem, Select, Typography } from '@mui/material'
import StarIcon from '@mui/icons-material/Star'
import ReceiptLongOutlinedIcon from '@mui/icons-material/ReceiptLongOutlined'
import BallColor from '~/components/atoms/BallColor'
import InputForm from '~/components/atoms/inputs/InputForm'
import { DEFAULT_GAP_SIZE } from '~/constants'
import { CategoryTypeEnum } from '~/constants/categories'
import colors from '~/layout/theme/colors'
import { Icon } from '~/components/atoms/icons'
import { CategoryType } from '~/client/models/categories'

const IconArrowSelect = (): React.JSX.Element => {
  return <Box mr={1} mt={0.5}><Icon name="doubleArrowDown" /></Box>
}

interface CategoriesProps {
  formik?: any
  categories: CategoryType[]
}

const Categories = ({ categories, formik }: CategoriesProps) => {
  return (
    <>
      <Box display="grid" gap={DEFAULT_GAP_SIZE} mb={2}>
        <Box flex={1}>
          <InputForm fullWidth title="Com o que" helperText formik={formik} propField="category">
            {categories.length > 0 && (
              <Select
                variant="outlined"
                size="small"
                {...formik.getFieldProps('category')}
                IconComponent={IconArrowSelect}
              >
                {categories.map((item, index) => (
                  <MenuItem key={`cat-add-transaction-${index}`} value={item.id}>
                    <Box display="flex" alignItems="center" gap={DEFAULT_GAP_SIZE}>
                      <BallColor color={item.color} size={22} />

                      <Box>
                        {item.name}
                      </Box>

                      {item.isGoal === CategoryTypeEnum.Goal && (
                        <StarIcon htmlColor={colors.danger.main} />
                      )}

                      {item.isGoal === CategoryTypeEnum.Debit && (
                        <ReceiptLongOutlinedIcon htmlColor={colors.error.light} />
                      )}
                    </Box>
                  </MenuItem>
                ))}
              </Select>
            )}
          </InputForm>

          {(categories && categories.length === 0) && (
            <Box
              p={2}
              display="flex"
              justifyContent="center"
              alignItems="center"
              border="1px dashed gray"
            >
              <Typography variant="body1">
                Nenhum categoria foi adicionada
              </Typography>
            </Box>
          )}
        </Box>
      </Box>
    </>
  )
}

export default Categories