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
      color
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

  const colors = data.techniqueByRankByType.map(n => {
        return n.color !== null ? n.color : "#008FFB"
      }).filter((v, i, a) => a.indexOf(v) === i);
  console.log("colors: ", colors);

  console.log("ranks: ", ranks);

  const options = {
    chart: {
        type: 'heatmap',
      },
      plotOptions: {
        heatmap: {
          enableShades: true,
          shadeIntensity: 0.5,
          distributed: true,
        }
      },
      dataLabels: {
        enabled: true
      },
      // colors: ["#008FFB"],
      colors: colors,
      title: {
        text: "Num Techniques by Rank"
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
