import React, { useState } from 'react';
import { useQuery, useMutation } from "@apollo/react-hooks";
import gql from "graphql-tag";
import { makeStyles } from "@material-ui/core/styles";
import MaterialTable from 'material-table';
import Grid from "@material-ui/core/Grid";

import TextField from "@material-ui/core/TextField";

const useStyles = makeStyles(theme => ({
  root: {
    maxWidth: "auto",
    marginTop: theme.spacing(3),
    overflowX: "auto",
    margin: "auto"
  }
}));

const GET_RANKS = gql`
  {
    Rank {
      _id
      name
      rankOrder
    }
  }
`;

const CREATE_RANK = gql`
  mutation CreateRank($name: String!, $rankOrder: Int!) 
  {
    CreateRank(name: $name, rankOrder: $rankOrder) {
      name
      rankOrder
    }
  }
`;

const UPDATE_RANK = gql`
  mutation UpdateRank($name: String!, $rankOrder: Int!) 
  {
    UpdateRank(name: $name, rankOrder: $rankOrder) {
      name
      rankOrder
    }
  }
`;

const DELETE_RANK = gql`
  mutation CreateRank($name: String!) 
  {
    DeleteRank(name: $name) {
      name
    }
  }
`;

export default function MaterialTableDemo() {
  const classes = useStyles();

  const [name, setName] = useState("");
  const [rankOrder, setRankOrder] = useState(0);

  const [state, setState] = React.useState({
    columns: [
      // { title: 'Internal ID', field: '_id' },
      { title: 'Name', field: 'name',
        editComponent: props => (
          <TextField
            type="text"
            // value={name} // TODO value needs to equal "" when creating, and the current item when updating
            onChange={e => setName(e.target.value)}
            // id="outlined-rank"
            // label="Rank"
            // className={classes.textField}
            // onChange={e => setName(e.target.value)}
            // margin="normal"
            // variant="outlined"
            // helperText="Enter rank name"
          />
        )
      },
      { title: 'Order', field: 'rankOrder', 
        editComponent: props => (
          <TextField
            id="outlined-number"
            label="Number"
            type="number"
            InputLabelProps={{
              shrink: true,
            }}
            onChange={e => setRankOrder(parseInt(e.target.value))}
            // variant="outlined"
            helperText="Enter order of rank"
          />
        )
      }
      // { title: 'Surname', field: 'surname' },
      // { title: 'Birth Year', field: 'birthYear', type: 'numeric' },
      // {
      //   title: 'Birth Place',
      //   field: 'birthCity',
      //   lookup: { 34: 'İstanbul', 63: 'Şanlıurfa' },
      // },
    ],
  });

  const [CreateRank] = useMutation(
    CREATE_RANK,
    {
      update(cache, { data: { CreateRank } }) {
        const { Rank } = cache.readQuery({ query: GET_RANKS });
        cache.writeQuery({
          query: GET_RANKS,
          data: { Rank: Rank.concat([CreateRank]) },
        })
      }
    }
  );

  const [DeleteRank] = useMutation(DELETE_RANK);

  const [UpdateRank] = useMutation(UPDATE_RANK);

  const { loading, error, data } = useQuery(GET_RANKS);

  if (loading) return "Loading...";
  if (error) return `Error ${error.message}`;

  return (
    <div className={classes.root}>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <MaterialTable
            title="Rank"
            columns={state.columns}
            data={data.Rank}
            editable={{
              onRowAdd: newData =>
                new Promise(resolve => {
                  setTimeout(() => {
                    resolve();
                    // setState(prevState => {
                    //   const data = [...prevState.data];
                    //   data.push(newData);
                    //   return { ...prevState, data };
                    // });
                    CreateRank({
                      variables: { name: name, rankOrder: rankOrder }
                    });
                  }, 600);
                }),
              onRowUpdate: (newData, oldData) => 
                new Promise(resolve => {
                  console.log("update");
                  setTimeout(() => {
                    resolve();
                    console.log("oldData.name: " + oldData.name);
                    console.log("newData.name: " + newData.name);
                    // if (oldData) {
                    //   console.log(oldData);
                    //   console.log(newData);
                    //   // setState(prevState => {
                    //   //   const data = [...prevState.data];
                    //   //   data[data.indexOf(oldData)] = newData;
                    //   //   return { ...prevState, data };
                    //   // });
                    // }
                      UpdateRank({
                        variables: { 
                          from: {name: oldData.name, rankOrder: oldData.rankOrder },
                          to: {name: newData.name, rankOrder: newData.rankOrder}
                        },
                        update: (cache) => {
                          console.log("Update");
                          console.log(oldData);
                          console.log(newData);
                          const existingRanks = cache.readQuery({ query: GET_RANKS });
                          const newRanks = existingRanks.Rank.map(r => {
                            if (r.name === oldData.name) {
                              console.log("if");
                              console.log(r);
                              return {...r, name: newData.name, rankOrder: newData.rankOrder};
                            } else {
                              console.log("else");
                              console.log(r);
                              return r;
                            }
                          });
                          cache.writeQuery({
                            query: GET_RANKS,
                            data: { Rank: newRanks }
                          })
                        }
                      });
                  }, 600);
                }),
              onRowDelete: oldData =>
                new Promise(resolve => {
                  setTimeout(() => {
                    resolve();
                    // setState(prevState => {
                    //   const data = [...prevState.data];
                    //   data.splice(data.indexOf(oldData), 1);
                    //   return { ...prevState, data };
                    // });
                    DeleteRank({
                      // TODO - update this to be like CreateRank. i.e. move this to function like CreateRank
                      variables: { name: oldData.name },
                      update: (cache) => {
                        const existingRanks = cache.readQuery({ query: GET_RANKS });
                        const newRanks = existingRanks.Rank.filter(r => (r.name !== oldData.name));
                        cache.writeQuery({
                          query: GET_RANKS,
                          data: { Rank: newRanks }
                        });
                      }
                    });
                  }, 600);
                }),
            }}
            // actions={[
            //   {

            //   }
            // ]}
          />
        </Grid>
      </Grid>
    </div>
  );
}
