import * as React from "react";
import { Chart } from "react-charts";
import { AxisOptions } from "react-charts";


type DailyStars = {
  date: Date,
  stars: number,
}

type Series = {
  label: string,
  data: DailyStars[]
}

const Area = () => {
  const primaryAxis = React.useMemo(
    (): AxisOptions<DailyStars> => ({
      getValue: datum => datum.date,

    }),
    []
  )

  const secondaryAxes = React.useMemo(
    (): AxisOptions<DailyStars>[] => [
      {
        getValue: datum => datum.stars,
        // elementType: 'area',
        stacked: true,
        position:'right'
      },
    ],
    []
  )

  const data = React.useMemo(()=>{
    return(
      [
        {
          label: 'React Charts',
          data: [
            {
              date: new Date(2021, 3),
              stars: 202123,
            },
            {
              date: new Date(2021, 4),
              stars: 134030,
            },
            {
              date: new Date(2021, 5),
              stars: 333230,
            },
            {
              date: new Date(2021, 6),
              stars: 424530,
            },
            {
              date: new Date(2021, 7),
              stars: 846530,
            },
            {
              date: new Date(2021, 8),
              stars: 624950,
            },
            {
              date: new Date(2021, 9),
              stars: 528830,
            },
            // ...
          ]
        },
      ]
    )
  }, [])


  return (
    <div style={{width:'100%', minHeight:'400px'}}>
    <Chart
    options={{
      data,
      primaryAxis,
      secondaryAxes,

    }}
  />
  </div>
  )
}

export default Area
