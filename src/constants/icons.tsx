import React from 'react'
import SVG from 'react-inlinesvg'

import iconEdit from '../assets/icons/icon-edit.svg'
import iconDelete from '../assets/icons/icon-delete.svg'
import iconSearch from '../assets/icons/icon-search.svg'
import iconDoubleArrowDown from '../assets/icons/icon-double-arrow-down.svg'
import iconSingleArrowDownCircule from '../assets/icons/icon-single-arrow-circule.svg'
import iconSingleArrowUpCircule from '../assets/icons/icon-single-arrow-up-circule.svg'
import iconSingleArrowLeftCircule from '../assets/icons/icon-single-arrow-left-circule.svg'
import iconSingleArrowRightCircule from '../assets/icons/icon-single-arrow-right-circule.svg'
import iconCheckCircule from '../assets/icons/icon-check-circule.svg'
import iconMenuHamburguer from '../assets/icons/icon-menu-hambuguer.svg'
import iconUpload from '../assets/icons/icon-upload.svg'
import iconFilter from '../assets/icons/icon-filter.svg'
import iconCalendar from '../assets/icons/icon-calendar.svg'
import iconChartSimpleBar from '../assets/icons/icon-chart-simple-bar.svg'
import iconChartSimpleLine from '../assets/icons/icon-chart-simple-line.svg'
import iconChartSimplePizza from '../assets/icons/icon-chart-simple-pizza.svg'
import iconRevenue from '../assets/icons/icon-revenue.svg'
import iconBalance from '../assets/icons/icon-balance.svg'
import iconRevenueDashboard from '../assets/icons/icon-receives.svg'
import iconDowns from '../assets/icons/icon-downs.svg'

import colors from '../layout/theme/colors'

const SIZE_ICONS = 20

interface IColor {
  color?: string
  size?: number
}

export const IconEdit = ({ color = colors.primary.main, size = SIZE_ICONS }: IColor): React.JSX.Element => (
  <SVG src={iconEdit} width={size} height={size} fill={color} />
)

export const IconDelete = ({ color = colors.error.main, size = SIZE_ICONS }: IColor): React.JSX.Element => (
  <SVG src={iconDelete} width={size} height={size} fill={color} />
)

export const IconSearch = ({ color = colors.text.quaternary, size = SIZE_ICONS }: IColor): React.JSX.Element => (
  <SVG src={iconSearch} width={size} height={size} fill={color} />
)

export const IconDoubleArrowDown = ({ color = colors.text.quaternary, size = SIZE_ICONS }: IColor): React.JSX.Element => (
  <SVG src={iconDoubleArrowDown} width={size} height={size} fill={color} />
)

export const IconSingleArrowDownCircule = ({ color = colors.text.quaternary, size = SIZE_ICONS }: IColor): React.JSX.Element => (
  <SVG src={iconSingleArrowDownCircule} width={size} height={size} fill={color} />
)

export const IconSingleArrowUpCircule = ({ color = colors.text.quaternary, size = SIZE_ICONS }: IColor): React.JSX.Element => (
  <SVG src={iconSingleArrowUpCircule} width={size} height={size} fill={color} />
)

export const IconSingleArrowLeftCircule = ({ color = colors.text.quaternary, size = SIZE_ICONS }: IColor): React.JSX.Element => (
  <SVG src={iconSingleArrowLeftCircule} width={size} height={size} fill={color} />
)

export const IconSingleArrowRightCircule = ({ color = colors.text.quaternary, size = SIZE_ICONS }: IColor): React.JSX.Element => (
  <SVG src={iconSingleArrowRightCircule} width={size} height={size} fill={color} />
)

export const IconCheckCircule = ({ color = colors.text.quaternary, size = SIZE_ICONS }: IColor): React.JSX.Element => (
  <SVG src={iconCheckCircule} width={size} height={size} fill={color} />
)

export const IconUpload = ({ color = colors.text.quaternary, size = SIZE_ICONS }: IColor): React.JSX.Element => (
  <SVG src={iconUpload} width={size} height={size} fill={color} />
)

export const IconMenuHamburguer = ({ color = colors.text.quaternary, size = SIZE_ICONS }: IColor): React.JSX.Element => (
  <SVG src={iconMenuHamburguer} width={size} height={size} fill={color} />
)

export const IconFilter = ({ color = colors.text.quaternary, size = SIZE_ICONS }: IColor): React.JSX.Element => (
  <SVG src={iconFilter} width={size} height={size} fill={color} />
)

export const IconCalendar = ({ color = colors.text.quaternary, size = SIZE_ICONS }: IColor): React.JSX.Element => (
  <SVG src={iconCalendar} width={size} height={size} fill={color} />
)

export const IconChartSimpleBar = ({ color = colors.text.quaternary, size = SIZE_ICONS }: IColor): React.JSX.Element => (
  <SVG src={iconChartSimpleBar} width={size} height={size} fill={color} />
)

export const IconChartSimpleLine = ({ color = colors.text.quaternary, size = SIZE_ICONS }: IColor): React.JSX.Element => (
  <SVG src={iconChartSimpleLine} width={size} height={size} fill={color} />
)

export const IconChartSimplePizza = ({ color = colors.text.quaternary, size = SIZE_ICONS }: IColor): React.JSX.Element => (
  <SVG src={iconChartSimplePizza} width={size} height={size} fill={color} />
)

export const IconRevenue = ({ color = colors.text.quaternary, size = SIZE_ICONS }: IColor): React.JSX.Element => (
  <SVG src={iconRevenue} width={size} height={size} fill={color} />
)

export const IconBalance = ({ color = colors.text.quaternary, size = SIZE_ICONS }: IColor): React.JSX.Element => (
  <SVG src={iconBalance} width={size} height={size} fill={color} />
)

export const IconRevenues = ({ color = colors.text.quaternary, size = SIZE_ICONS }: IColor): React.JSX.Element => (
  <SVG src={iconRevenueDashboard} width={size} height={size} fill={color} />
)

export const IconDowns = ({ color = colors.text.quaternary, size = SIZE_ICONS }: IColor): React.JSX.Element => (
  <SVG src={iconDowns} width={size} height={size} fill={color} />
)
