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


export default function HeatChart_TechniqueByRankByType(obj) {
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

  // console.log("data: ", data);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error</p>;

  const ranks = data.techniqueByRankByType.map(n => {
        return n.rank
      }).filter((v, i, a) => a.indexOf(v) === i);

  // console.log("ranks: ", ranks);

  const names = data.techniqueByRankByType.map(m => {
      if (m.type === obj.label)
        return m.name
      }).filter((v, i,a) => a.indexOf(v) === i);
  // console.log("names: ", names);

  const colors = data.techniqueByRankByType.map(n => {
        return n.color !== null ? n.color : "#008FFB"
      }).filter((v, i, a) => a.indexOf(v) === i);
  // console.log("colors: ", colors);

  // console.log("ranks: ", ranks);

  const options = {
    chart: {
        type: 'heatmap',
        height: 300
      },
      plotOptions: {
        heatmap: {
          enableShades: true,
          shadeIntensity: 0.5,
          distributed: true,
          colorScale: {
              inverse: true
            }
        }
      },
      dataLabels: {
        enabled: false
      },
      tooltip: {
        enabled: false,
      },
      // colors: ["#008FFB"],
      colors: colors,
      title: {
        text: obj.label + " by Rank"
      },
  };

  const series = names
    .map(n => {
      let dataPoints = [];
      for (var i=0;i<ranks.length;i++){
        let value = data.techniqueByRankByType.filter(item => (item.rank === ranks[i] && item.name === n && item.type === obj.label));
        // console.log(value);
        if (value.length === 1){
          dataPoints.push({ x: ranks[i] !== null ? ranks[i] : 'Unassigned', y: 1});
        } else {
          dataPoints.push({ x: ranks[i] !== null ? ranks[i] : 'Unassigned', y: 0});
        }
      }
      return {
        name: n,// !== null ? n : 'Unassigned',
        data: dataPoints
      }
    });

    // console.log("series: ", series);

  return (
    <div className="heatmap">
      <Chart 
        options={options} 
        series={series} 
        type="heatmap" 
      />
    </div>
  );

}
