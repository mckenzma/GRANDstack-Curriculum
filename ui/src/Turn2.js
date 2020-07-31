import React, { useState, useRef } from 'react';
import { useQuery, useMutation } from "@apollo/react-hooks";
import gql from "graphql-tag";
import { makeStyles } from "@material-ui/core/styles";
import MaterialTable from 'material-table';
import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";

import TextField from "@material-ui/core/TextField";

import RankListFilter from './RankListFilter';

import Chip from "@material-ui/core/Chip";

const useStyles = makeStyles(theme => ({
  root: {
    maxWidth: "auto",
    marginTop: theme.spacing(3),
    overflowX: "auto",
    margin: "auto"
  },
  chips: {
    display: "flex",
    flexWrap: "wrap"
  },
  chip: {
    margin: theme.spacing(0.25)
  },
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

const GET_TURNS = gql`
  {
    Turn {
      id
      name
      description
      ranks {
        id
        rankOrder
        name
        abbreviation
      }
    }
  }
`;

const CREATE_TURN = gql`
  mutation CreateTurn($name: String!, $description: String) 
  {
    CreateTurn(name: $name, description: $description) {
      id
      name
      description
      ranks {
        id
        rankOrder
        name
        abbreviation
      }
    }
  }
`;

const UPDATE_TURN = gql`
  mutation UpdateTurn($id: ID!, $name: String!, $description: String) 
  {
    UpdateTurn(id: $id, name: $name, description: $description) {
      id
      name
      description
    }
  }
`;

const DELETE_TURN = gql`
  mutation DeleteTurn($id: ID!) 
  {
    DeleteTurn(id: $id) {
      id
    }
  }
`;

const MERGE_TURN_RANKS_RELS = gql`
  mutation MergeTurnRanks($fromTurnID: ID!, $toRankIDs: [ID!])
  {
    MergeTurnRanks(fromTurnID: $fromTurnID, toRankIDs: $toRankIDs) {
      id
      name
      rankOrder
      abbreviation
    }
  }
`;

const DELETE_TURN_RANKS_RELS = gql`
  mutation DeleteTurnRanks($fromTurnID: ID!, $toRankIDs: [ID!])
  {
    DeleteTurnRanks(fromTurnID: $fromTurnID, toRankIDs: $toRankIDs) {
      id
      name
      rankOrder
      abbreviation
    }
  }
`;

export default function Turn({headerHeight}) {
  const classes = useStyles();

  const [description, setDescription] = useState("0");
  const [ranks, setRanks] = useState("");

  const [order, setOrder] = useState("asc");
  const [orderBy, setOrderBy] = useState("name");

  const [state, setState] = React.useState({
    columns: [
      { title: 'Name', field: 'name' },
      { title: 'Description', field: 'description' },
      { title: 'Ranks', field: 'ranks', render: rowData => (
          <div className={classes.chips}>
            {rowData.ranks.sort(getSorting("asc","rankOrder")).map(rank => (
              <Chip
                key={rank.id}
                label={rank.abbreviation} // abbreviation vs name
              />
            ))}
            </div>),
        editComponent: props => {
          if (props.value !== undefined) {
            return(
              <RankListFilter value={props.value} onChange={props.onChange}  /> 
            )
          } else {
            return(
              <RankListFilter value={[]} onChange={props.onChange} /> 
            )
          }
        }
      }
    ],
  });

  const tabHeaderRef = useRef(null);
  const style = { top: headerHeight };
  const style2 = {
    marginTop:
      headerHeight// +
      //(tabHeaderRef.current ? tabHeaderRef.current.offsetHeight : 0)
  };

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

  const [CreateTurn] = useMutation(CREATE_TURN);
  const [UpdateTurn] = useMutation(UPDATE_TURN);
  const [DeleteTurn] = useMutation(DELETE_TURN);
  const [MergeTurnRanks] = useMutation(MERGE_TURN_RANKS_RELS);
  const [DeleteTurnRanks] = useMutation(DELETE_TURN_RANKS_RELS);

  const { loading, error, data } = useQuery(GET_TURNS);

  if (loading) return "Loading...";
  if (error) return `Error ${error.message}`;

  return (
    <Paper className={classes.root} elevation={3} style={style2}>
      <Grid container>
        <Grid item xs={12}>
          <MaterialTable
            title="Turn"
            columns={state.columns}
            data={
              data.Turn.sort(getSorting(order,orderBy)).map(s => {
                return {
                  ...s,
                }
              })
            }
            editable={{
              onRowAdd: newData =>
                new Promise(resolve => {
                  setTimeout(() => {
                    resolve();
                    CreateTurn({
                      variables: {
                        name: newData.name,
                        description: (newData.description !== undefined ? newData.description : ""),
                      },
                      update: (cache, { data: { CreateTurn } }) => {
                        const { Turn } = cache.readQuery({ query: GET_TURNS });

                        if (newData.ranks.length !== 0) {
                          MergeTurnRanks({ 
                            variables: {
                              fromTurnID: CreateTurn.id,
                              toRankIDs: newData.ranks.map(r => r.id)
                            },
                            update: (cache, { data: { MergeTurnRanks } }) => {
                              CreateTurn.ranks = CreateTurn.ranks.concat(MergeTurnRanks)
                              cache.writeQuery({
                                query: GET_TURNS,
                                data: { Turn: Turn.concat([CreateTurn]) },
                              })
                            }
                          });
                        }
                      }
                    });
                  }, 600);
                }),
              onRowUpdate: (newData, oldData) => 
                new Promise(resolve => {
                  setTimeout(() => {
                    resolve();
                    UpdateTurn({
                      variables: { 
                        id: newData.id,
                        name: newData.name,
                        description: newData.description,
                      },
                      update: (cache, { data: { UpdateTurn } }) => {
                        let relsToAdd = [];
                        let relsToDelete = [];

                        if (newData.ranks !== oldData.ranks) {
                          relsToAdd = relsToAdd.concat(newData.ranks.filter(r => !oldData.ranks.some(r2 => r2.id === r.id)));
                          relsToDelete = relsToDelete.concat(oldData.ranks.filter(r => !newData.ranks.some(r2 => r2.id === r.id)));
                        };
                        
                        if (relsToAdd.length !== 0){
                          MergeTurnRanks({
                            variables: {
                              fromTurnID: newData.id,
                              toRankIDs: relsToAdd.map(rel => rel.id)
                            },
                            update: (cache, { data: { MergeTurnRanks } }) => {
                              const existingTurns = cache.readQuery({ query: GET_TURNS });
                              const newTurns = existingTurns.Turn.filter(r => (r.id !== oldData.id));
                              cache.writeQuery({
                                query: GET_TURNS,
                                data: { Turn: newTurns.concat(newData) }
                              });
                            }
                          });
                        }

                        if (relsToDelete.length !== 0){
                          DeleteTurnRanks({
                            variables: {
                              fromTurnID: newData.id,
                              toRankIDs: relsToDelete.map(rel => rel.id)
                            },
                            update: (cache, {data: { DeleteTurnRanks } }) => {
                              const existingTurns = cache.readQuery({ query: GET_TURNS });
                              const newTurns = existingTurns.Turn.filter(r => (r.id !== oldData.id));
                              cache.writeQuery({
                                query: GET_TURNS,
                                data: { Turn: newTurns.concat(newData) }
                              });
                            }
                          })
                        }

                        // is this needed? here -->
                        const existingTurns = cache.readQuery({ query: GET_TURNS });
                        const newTurns = existingTurns.Turn.map(r => {
                          if (r.id === oldData.id) {
                            return {
                              ...r, 
                              name: newData.name, 
                              description: newData.description,
                            };
                          } else {
                            return r;
                          }
                        });
                        // cache.writeQuery({
                        //   query: GET_TURNS,
                        //   data: { Turn: newTurns }
                        // })
                        // <-- to here?

                      }
                    });
                  }, 600);
                }),
              onRowDelete: oldData =>
                new Promise(resolve => {
                  setTimeout(() => {
                    resolve();
                    DeleteTurn({
                      variables: { id: oldData.id },
                      update: (cache) => {
                        const existingTurns = cache.readQuery({ query: GET_TURNS });
                        const newTurns = existingTurns.Turn.filter(r => (r.id !== oldData.id));
                        cache.writeQuery({
                          query: GET_TURNS,
                          data: { Turn: newTurns }
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
