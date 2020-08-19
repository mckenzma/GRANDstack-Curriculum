import React from "react";
import Chart from "react-apexcharts";

// import { Query } from "react-apollo";
import { useQuery } from "@apollo/react-hooks";
import gql from "graphql-tag";

// import Loading from "./../Loading";

const TECHNIQUE_COUNT_BY_TYPE_BY_RANK = gql`
  {
    techniqueByRankByType {
      rank
      type
      name
    }
  }
`;


export default function HeatChart_TechniqueCountByRankByType() {

  const state = {
    options: {
      chart: {
        type: 'heatmap'
      },
      plotOptions: {
        heatmap: {

        }
      },
      title: {
        text: "Techniques By Type By Rank"
      },
    }
  };

  const { loading, error, data } = useQuery(TECHNIQUE_COUNT_BY_TYPE_BY_RANK);

  console.log("data: ", data);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error</p>;

  const ranks = data.techniqueByRankByType.map(n => {
        return n.rank
      }).filter((v, i, a) => a.indexOf(v) === i);

  console.log("ranks: ", ranks)

  const types = data.techniqueByRankByType.map(m => {
        return m.type
      }).filter((v, i,a) => a.indexOf(v) === i);
  console.log("types: ", types);

  const options = {
    chart: {
        type: 'heatmap',
      },
      plotOptions: {
        heatmap: {
          enableShades: true,
          shadeIntensity: 0.5,
          distributed: true,
          // colorScale: {
          //   ranges: [{
          //       from: 0,
          //       to: 0,
          //       color: '#FFFFFF',
          //       name: 'Not Assigned',
          //     },
          //     {
          //       from: 1,
          //       to: 1000,
          //       color: '#008FFB',
          //       name: 'Assigned',
          //     },
          //   ]
          // }
        }
      },
      dataLabels: {
        enabled: true
      },
      colors: ["#008FFB"],
      title: {
        text: "Num of Testing Requirements By Rank per Rank"
      },
  };

  const series = ranks
    .map(r => {
      let dataPoints = [];
      for (var i=0;i<types.length;i++){
        let value = data.techniqueByRankByType.filter(item => (item.type === types[i] && item.rank === r));
        if (value.length > 0){
          dataPoints.push({ x: types[i], y: value.length});
        } else {
          dataPoints.push({ x: types[i], y: 0});
        }
      }
      return {
        name: r !== null ? r : 'Unassigned',
        data: dataPoints
      }
    });

    console.log("series: ", series);

  return (
    <div className="heatmap">
      <Chart options={options} series={series} type="heatmap" />
    </div>
  );

}
