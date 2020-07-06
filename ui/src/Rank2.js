import React, { useState, useRef } from 'react';
import { useQuery, useMutation } from "@apollo/react-hooks";
import gql from "graphql-tag";
import { makeStyles } from "@material-ui/core/styles";
import MaterialTable from 'material-table';
import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";

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
      id
      name
      abbreviation
      rankOrder
    }
  }
`;

const CREATE_RANK = gql`
  mutation CreateRank($name: String!, $rankOrder: Int!, $abbreviation: String!) 
  {
    CreateRank(name: $name, rankOrder: $rankOrder, abbreviation: $abbreviation) {
      id
      name
      abbreviation
      rankOrder
    }
  }
`;

const UPDATE_RANK = gql`
  mutation UpdateRank($id: ID!, $name: String!, $rankOrder: Int!,$abbreviation: String!) 
  {
    UpdateRank(id: $id, name: $name, rankOrder: $rankOrder, abbreviation: $abbreviation) {
      id
      name
      abbreviation
      rankOrder
    }
  }
`;

const DELETE_RANK = gql`
  mutation DeleteRank($id: ID!) 
  {
    DeleteRank(id: $id) {
      id
    }
  }
`;

export default function Rank({headerHeight}) {
  const classes = useStyles();

  // const [name, setName] = useState("");
  const [rankOrder, setRankOrder] = useState(0);

  const [order, setOrder] = useState("asc");
  const [orderBy, setOrderBy] = useState("rankOrder");

  const [state, setState] = React.useState({
    columns: [
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
      },
      { title: 'Name', field: 'name'//,
        // editComponent: props => (
        //   <TextField
        //     type="text"
        //     // value={name} // TODO value needs to equal "" when creating, and the current item when updating
        //     onChange={e => setName(e.target.value)}
        //     // id="outlined-rank"
        //     // label="Rank"
        //     // className={classes.textField}
        //     // onChange={e => setName(e.target.value)}
        //     // margin="normal"
        //     // variant="outlined"
        //     // helperText="Enter rank name"
        //   />
        // )
      },
      { title: 'Abbreviation', field: 'abbreviation'},
      // { title: 'Birth Year', field: 'birthYear', type: 'numeric' },
      // {
      //   title: 'Birth Place',
      //   field: 'birthCity',
      //   lookup: { 34: 'İstanbul', 63: 'Şanlıurfa' },
      // },
    ],
  });

  const handleSortRequest = property => {
    const newOrderBy = property;
    let newOrder = "desc";

    if (orderBy === property && order === "desc") {
      newOrder = "asc";
    }

    setOrder(newOrder);
    setOrderBy(newOrderBy);
  };

  const getSorting = (order, orderBy) => {
  return order === "desc"
    ? (a, b) => (b[orderBy] < a[orderBy] ? -1 : 1)
    : (a, b) => (a[orderBy] < b[orderBy] ? -1 : 1);
  };

  const [CreateRank] = useMutation(CREATE_RANK);

  const [UpdateRank] = useMutation(UPDATE_RANK);

  const [DeleteRank] = useMutation(DELETE_RANK);

  const tabHeaderRef = useRef(null);
  const style = { top: headerHeight };
  const style2 = {
    marginTop:
      headerHeight// +
      //(tabHeaderRef.current ? tabHeaderRef.current.offsetHeight : 0)
  };

  const { loading, error, data } = useQuery(GET_RANKS);

  if (loading) return "Loading...";
  if (error) return `Error ${error.message}`;

  return (
    <Paper style={style2} className={classes.root} elevation={3}>
      <Grid container /*style={style2}*/>
        <Grid item xs={12}>
          <MaterialTable
            title="Rank"
            columns={state.columns}
            data={data.Rank.sort(getSorting(order,orderBy))}
            editable={{
              onRowAdd: newData =>
                new Promise(resolve => {
                  setTimeout(() => { 
                    resolve();
                    CreateRank({
                      variables: {
                        // name: name, 
                        name: newData.name,
                        abbreviation: newData.abbreviation,
                        rankOrder: rankOrder 
                        // rankOrder: newData.rankOrder
                      },
                      update: (cache, { data: { CreateRank } }) => {
                        const { Rank } = cache.readQuery({ query: GET_RANKS });
                        cache.writeQuery({
                          query: GET_RANKS,
                          data: { Rank: Rank.concat([CreateRank]) },
                        })
                      }
                    });
                  }, 600);
                }),
              onRowUpdate: (newData, oldData) => 
                new Promise(resolve => {
                  setTimeout(() => {
                    resolve();
                    UpdateRank({
                      variables: { 
                        // id: oldData.id,
                        id: newData.id,
                        // name: name, 
                        name: newData.name, 
                        abbreviation: newData.abbreviation, 
                        rankOrder: rankOrder
                        // rankOrder: newData.rankOrder
                      },
                      update: (cache) => {
                        const existingRanks = cache.readQuery({ query: GET_RANKS });
                        const newRanks = existingRanks.Rank.map(r => {
                          if (r.id === oldData.id) {
                            return {
                              ...r, 
                              // name: name, 
                              name: newData.name, 
                              abbreviation: newData.abbreviation, 
                              rankOrder: rankOrder
                            };
                          } else {
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
                    DeleteRank({
                      variables: { id: oldData.id },
                      update: (cache) => {
                        const existingRanks = cache.readQuery({ query: GET_RANKS });
                        const newRanks = existingRanks.Rank.filter(r => (r.id !== oldData.id));
                        cache.writeQuery({
                          query: GET_RANKS,
                          data: { Rank: newRanks }
                        });
                      }
                    });
                  }, 600);
                }),
            }}
          />
        </Grid>
      </Grid>
    </Paper>
  );
}
