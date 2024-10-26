import React from "react"

export type TypesChartsType = 'SimpleMonth' | 'SimpleCategories' | 'SimpleLineMonth'

export type ChartsType = {
  id: number
  key: TypesChartsType
  title: string
  icon: (color: string | undefined) => React.JSX.Element
}

export type FilterChartType = {
  startDate: string
  endDate: string
}

export type ChartSimpleType = {
  label: string
  data: number[]
}

export type BuildChartSimpleType = {
  month: number
  Receive: number
  Expense: number
}

export type BuildChartSimplePieType = {
  id: number
  label: string
  color: string
  value: number
}

export type SimpleBarChartResponseType = {
  monthsInChart: BuildChartSimpleType[]
  builtInChart: ChartSimpleType[]
}

export type SimplePieChartResponseType = {
  expense: BuildChartSimplePieType[],
  receive: BuildChartSimplePieType[]
}