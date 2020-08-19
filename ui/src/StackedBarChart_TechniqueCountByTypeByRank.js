import React from "react";
import Chart from "react-apexcharts";

// import { Query } from "react-apollo";
import { useQuery } from "@apollo/react-hooks";
import gql from "graphql-tag";

// import Loading from "./../Loading";

const TECHNIQUE_COUNT_BY_TYPE_BY_RANK = gql`
  {
    techniqueCountByTypeByRank {
      rankOrder
      rank
      type
      count
    }
  }
`;


export default function StackedBarChart_TechniqueCountByTypeByRank() {

  const state = {
    options: {
      chart: {
        height: "auto",
        type: "bar",
        stacked: true
      },
      //setting colors for series
      colors: [
        "#2E93fA",
        "#66DA26",
        "#546E7A",
        "#E91E63",
        "#FF9800",
        "#bbb",
        "#aaa",
        "#123456"
      ],
      plotOptions: {
        bar: {
          horizontal: true
        }
      },
      stroke: {
        width: 1,
        colors: ["#fff"]
      },
      title: {
        text: "Techniques By Type By Rank"
      },
      xaxis: {
        labels: {
          formatter: function(val) {
            return val /*+ "K"*/;
          }
        }
      },
      yaxis: {
        title: {
          text: undefined
        }
      },
      tooltip: {
        y: {
          formatter: function(val) {
            return val /*+ "K"*/;
          }
        }
      },
      fill: {
        opacity: 1
      },

      legend: {
        position: "top",
        horizontalAlign: "left",
        offsetX: 40
      }
    }
  };

  const { loading, error, data } = useQuery(TECHNIQUE_COUNT_BY_TYPE_BY_RANK);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error</p>;

  console.log(data);

  const ranks = data.techniqueCountByTypeByRank.map(n => {
        return n.rank
      }).filter((v, i, a) => a.indexOf(v) === i);

  const types = data.techniqueCountByTypeByRank.map(m => {
        return m.type
      }).filter((v, i,a) => a.indexOf(v) === i);

  console.log(ranks);
  console.log(types);

  const options = {
    chart: {
        height: "auto",
        type: "bar",
        stacked: true
      },
      //setting colors for series
      colors: [
        "#2E93fA",
        "#66DA26",
        "#546E7A",
        "#E91E63",
        "#FF9800",
        "#bbb",
        "#aaa",
        "#123456"
      ],
      plotOptions: {
        bar: {
          horizontal: true
        }
      },
      stroke: {
        width: 1,
        colors: ["#fff"]
      },
      title: {
        text: "Techniques By Type By Rank"
      },
      xaxis: {
        labels: {
          formatter: function(val) {
            return val /*+ "K"*/;
          }
        }
      },
      yaxis: {
        title: {
          text: undefined
        }
      },
      tooltip: {
        y: {
          formatter: function(val) {
            return val /*+ "K"*/;
          }
        }
      },
      fill: {
        opacity: 1
      },

      legend: {
        position: "top",
        horizontalAlign: "left",
        offsetX: 40
      },
    xaxis: {
      categories: ranks
    }
  };

  const series = types
    .map(t => {
      let dataPoints = [];
      for (var i=0;i<ranks.length;i++){
        console.log(data.techniqueCountByTypeByRank.filter(item => (item.type === t && item.rank === ranks[i])));

        let value = data.techniqueCountByTypeByRank.filter(item => (item.type === t && item.rank === ranks[i]));
        if (value.length === 1){
          dataPoints.push(value[0].count);
        } else {
          dataPoints.push(0);
        }
      }
      console.log(dataPoints);
      return {
        name: t !== null ? t : 'undefined',
        data: dataPoints
      }
    });

    console.log(series);

  return (
    <div className="bar">
      <Chart options={options} series={series} type="bar" />
    </div>
  );

}
