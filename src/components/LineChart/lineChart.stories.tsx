import React from "react"
import Chart from "."
import { addDays } from "date-fns"

export default { title: "LineChart" }

const dates = Array(20)
  .fill("")
  .map((_, idx) => ({ x: addDays(Date.now(), idx).getTime() }))

const randomY = () => Math.sin(Math.random())
const randomPoints = () =>
  dates.map(o => {
    return {
      ...o,
      y: randomY(),
    }
  })

const data = [
  {
    label: "line1",
    points: randomPoints(),
  },

  {
    label: "line2",
    points: randomPoints(),
  },

  {
    label: "line3",
    points: randomPoints(),
  },
]

export const LineChart = () => (
  <div
    style={{
      width: "90vw",
      height: "65vh",
    }}
  >
    <Chart data={data} />
  </div>
)
