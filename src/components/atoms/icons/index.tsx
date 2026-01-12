import React from 'react'
import SVG from 'react-inlinesvg'
import colors from '~/layout/theme/colors'
import { iconsMap, IconName } from './iconsmap'

const DEFAULT_SIZE = 20

interface IconProps {
  name: IconName
  size?: number
  color?: string
}

export const Icon = ({ name, size = DEFAULT_SIZE, color = colors.text.quaternary }: IconProps): React.JSX.Element => {
  return (
    <SVG src={iconsMap[name]} width={size} height={size} fill={color} />
  )
}