import React from "react";
import Chart from "react-apexcharts";

// import { Query } from "react-apollo";
import { useQuery } from "@apollo/react-hooks";
import gql from "graphql-tag";

// import Loading from "./../Loading";

const KATA_BY_RANK = gql`
  {
    kataByRank {
      rank
      name
      color
    }
  }
`;


export default function HeatChart_KataByRank() {
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
        text: "Kata By Rank"
      },
    }
  };

  const { loading, error, data } = useQuery(KATA_BY_RANK);

  // console.log("data: ", data);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error</p>;

  const ranks = data.kataByRank.map(n => {
        return n.rank
      }).filter((v, i, a) => a.indexOf(v) === i);

  // console.log("ranks: ", ranks);

  const names = data.kataByRank.map(m => {
      // if (m.type === obj.label)
        return m.name
      }).filter((v, i,a) => a.indexOf(v) === i);
  // console.log("names: ", names);

  const colors = data.kataByRank.map(n => {
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
          },
        },
      },
      tooltip: {
        enabled: false,
      },
      dataLabels: {
        enabled: false
      },
      // colors: ["#008FFB"],
      colors: colors,
      title: {
        text: "Kata by Rank"
      },
  };

  const series = names
    .map(n => {
      let dataPoints = [];
      for (var i=0;i<ranks.length;i++){
        let value = data.kataByRank.filter(item => (item.rank === ranks[i] && item.name === n /*&& item.type === obj.label*/));
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
