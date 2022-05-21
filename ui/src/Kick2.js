import React, { useState, useRef, useEffect } from 'react';
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

const GET_KICKS = gql`
  {
    Kick {
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

const CREATE_KICK = gql`
  mutation CreateKick($name: String!, $description: String) 
  {
    CreateKick(name: $name, description: $description) {
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

const UPDATE_KICK = gql`
  mutation UpdateKick($id: ID!, $name: String!, $description: String) 
  {
    UpdateKick(id: $id, name: $name, description: $description) {
      id
      name
      description
    }
  }
`;

const DELETE_KICK = gql`
  mutation DeleteKick($id: ID!) 
  {
    DeleteKick(id: $id) {
      id
    }
  }
`;

const MERGE_KICK_RANKS_RELS = gql`
  mutation MergeKickRanks($fromKickID: ID!, $toRankIDs: [ID!])
  {
    MergeKickRanks(fromKickID: $fromKickID, toRankIDs: $toRankIDs) {
      id
      name
      rankOrder
      abbreviation
    }
  }
`;

const DELETE_KICK_RANKS_RELS = gql`
  mutation DeleteKickRanks($fromKickID: ID!, $toRankIDs: [ID!])
  {
    DeleteKickRanks(fromKickID: $fromKickID, toRankIDs: $toRankIDs) {
      id
      name
      rankOrder
      abbreviation
    }
  }
`;

export default function Kick({headerHeight}) {
  const classes = useStyles();

  const [description, setDescription] = useState("0");
  const [ranks, setRanks] = useState("");

  const [order, setOrder] = useState("asc");
  const [orderBy, setOrderBy] = useState("name");

  const [state, setState] = React.useState({
    columns: [
      { title: 'Name', field: 'name' },
      { title: 'Description', field: 'description' },
      { title: 'Testing Ranks', field: 'ranks', render: rowData => (
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
    ? (a, b) => (b[orderBy].toLowerCase() < a[orderBy].toLowerCase() ? -1 : 1)
    : (a, b) => (a[orderBy].toLowerCase() < b[orderBy].toLowerCase() ? -1 : 1);
  };

  const [CreateKick] = useMutation(CREATE_KICK);
  const [UpdateKick] = useMutation(UPDATE_KICK);
  const [DeleteKick] = useMutation(DELETE_KICK);
  const [MergeKickRanks] = useMutation(MERGE_KICK_RANKS_RELS);
  const [DeleteKickRanks] = useMutation(DELETE_KICK_RANKS_RELS);

  const { loading, error, data } = useQuery(GET_KICKS);

  if (loading) return "Loading...";
  if (error) return `Error ${error.message}`;

  return (
    <Paper className={classes.root} elevation={3} style={style2}>
      <Grid container>
        <Grid item xs={12}>
          <MaterialTable
            title="Kick"
            columns={state.columns}
            options={{
              pageSize: 10,
              // pageSizeOptions: [5, 10, 20, 30 ,50, 75, 100 ],
            }}
            data={
              data.Kick.sort(getSorting(order,orderBy)).map(s => {
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
                    CreateKick({
                      variables: {
                        name: newData.name,
                        description: (newData.description !== undefined ? newData.description : ""),
                      },
                      update: (cache, { data: { CreateKick } }) => {
                        const { Kick } = cache.readQuery({ query: GET_KICKS });

                        if (newData.ranks.length !== 0) {
                          MergeKickRanks({
                            variables: {
                              fromKickID: CreateKick.id,
                              toRankIDs: newData.ranks.map(r => r.id)
                            },
                            update: (cache, { data: { MergeKickRanks } }) => {
                              CreateKick.ranks = CreateKick.ranks.concat(MergeKickRanks)
                              cache.writeQuery({
                                query: GET_KICKS,
                                data: { Kick: Kick.concat([CreateKick]) },
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
                    UpdateKick({
                      variables: { 
                        id: newData.id,
                        name: newData.name,
                        description: newData.description,
                      },
                      update: (cache, { data: { UpdateKick } }) => {
                        let relsToAdd = [];
                        let relsToDelete = [];

                        if (newData.ranks !== oldData.ranks) {
                          relsToAdd = relsToAdd.concat(newData.ranks.filter(r => !oldData.ranks.some(r2 => r2.id === r.id)));
                          relsToDelete = relsToDelete.concat(oldData.ranks.filter(r => !newData.ranks.some(r2 => r2.id === r.id)));
                        };
                        
                        if (relsToAdd.length !== 0){
                          MergeKickRanks({
                            variables: {
                              fromKickID: newData.id,
                              toRankIDs: relsToAdd.map(rel => rel.id)
                            },
                            update: (cache, { data: { MergeKickRanks } }) => {
                              const existingKicks = cache.readQuery({ query: GET_KICKS });
                              const newKicks = existingKicks.Kick.filter(r => (r.id !== oldData.id));
                              cache.writeQuery({
                                query: GET_KICKS,
                                data: { Kick: newKicks.concat(newData) }
                              });
                            }
                          });
                        }

                        if (relsToDelete.length !== 0){
                          DeleteKickRanks({
                            variables: {
                              fromKickID: newData.id,
                              toRankIDs: relsToDelete.map(rel => rel.id)
                            },
                            update: (cache, {data: { DeleteKickRanks } }) => {
                              const existingKicks = cache.readQuery({ query: GET_KICKS });
                              const newKicks = existingKicks.Kick.filter(r => (r.id !== oldData.id));
                              cache.writeQuery({
                                query: GET_KICKS,
                                data: { Kick: newKicks.concat(newData) }
                              });
                            }
                          })
                        }

                        // is this needed? here -->
                        const existingKicks = cache.readQuery({ query: GET_KICKS });
                        const newKicks = existingKicks.Kick.map(r => {
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
                        //   query: GET_KICKS,
                        //   data: { Kick: newKicks }
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
                    DeleteKick({
                      variables: { id: oldData.id },
                      update: (cache) => {
                        const existingKicks = cache.readQuery({ query: GET_KICKS });
                        const newKicks = existingKicks.Kick.filter(r => (r.id !== oldData.id));
                        cache.writeQuery({
                          query: GET_KICKS,
                          data: { Kick: newKicks }
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
