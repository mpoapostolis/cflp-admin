export type LineChartPoint = {
  x: number
  y: number
}

export type LineInfo = {
  label: string
  color?: string
  points: LineChartPoint[]
}

export type LineChartData = LineInfo[]
