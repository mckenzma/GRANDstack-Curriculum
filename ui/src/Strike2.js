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

const GET_STRIKES = gql`
  {
    Strike {
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

const CREATE_STRIKE = gql`
  mutation CreateStrike($name: String!, $description: String) 
  {
    CreateStrike(name: $name, description: $description) {
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

const UPDATE_STRIKE = gql`
  mutation UpdateStrike($id: ID!, $name: String!, $description: String) 
  {
    UpdateStrike(id: $id, name: $name, description: $description) {
      id
      name
      description
    }
  }
`;

const DELETE_STRIKE = gql`
  mutation DeleteStrike($id: ID!) 
  {
    DeleteStrike(id: $id) {
      id
    }
  }
`;

const MERGE_STRIKE_RANKS_RELS = gql`
  mutation MergeStrikeRanks($fromStrikeID: ID!, $toRankIDs: [ID!])
  {
    MergeStrikeRanks(fromStrikeID: $fromStrikeID, toRankIDs: $toRankIDs) {
      id
      name
      rankOrder
      abbreviation
    }
  }
`;

const DELETE_STRIKE_RANKS_RELS = gql`
  mutation DeleteStrikeRanks($fromStrikeID: ID!, $toRankIDs: [ID!])
  {
    DeleteStrikeRanks(fromStrikeID: $fromStrikeID, toRankIDs: $toRankIDs) {
      id
      name
      rankOrder
      abbreviation
    }
  }
`;

export default function Strike({headerHeight}) {
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
    ? (a, b) => (b[orderBy]/*.toLowerCase()*/ < a[orderBy]/*.toLowerCase()*/ ? -1 : 1)
    : (a, b) => (a[orderBy]/*.toLowerCase()*/ < b[orderBy]/*.toLowerCase()*/ ? -1 : 1);
  };

  const [CreateStrike] = useMutation(CREATE_STRIKE);
  const [UpdateStrike] = useMutation(UPDATE_STRIKE);
  const [DeleteStrike] = useMutation(DELETE_STRIKE);
  const [MergeStrikeRanks] = useMutation(MERGE_STRIKE_RANKS_RELS);
  const [DeleteStrikeRanks] = useMutation(DELETE_STRIKE_RANKS_RELS);

  const { loading, error, data } = useQuery(GET_STRIKES);

  if (loading) return "Loading...";
  if (error) return `Error ${error.message}`;

  return (
    <Paper className={classes.root} elevation={3} style={style2}>
      <Grid container>
        <Grid item xs={12}>
          <MaterialTable
            title="Strike"
            columns={state.columns}
            options={{
              pageSize: 10,
              // pageSizeOptions: [5, 10, 20, 30 ,50, 75, 100 ],
            }}
            data={
              data.Strike.sort(getSorting(order,orderBy)).map(s => {
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
                    CreateStrike({
                      variables: {
                        name: newData.name,
                        description: (newData.description !== undefined ? newData.description : ""),
                      },
                      update: (cache, { data: { CreateStrike } }) => {
                        const { Strike } = cache.readQuery({ query: GET_STRIKES });

                        // if (newData.ranks.length !== 0) {
                        if (newData.ranks !== undefined) {
                          MergeStrikeRanks({
                            variables: {
                              fromStrikeID: CreateStrike.id,
                              toRankIDs: newData.ranks.map(r => r.id)
                            },
                            update: (cache, { data: { MergeStrikeRanks } }) => {
                              CreateStrike.ranks = CreateStrike.ranks.concat(MergeStrikeRanks)
                              cache.writeQuery({
                                query: GET_STRIKES,
                                data: { Strike: Strike.concat([CreateStrike]) },
                              })
                            }
                          });
                        } else {
                          cache.writeQuery({
                            query: GET_STRIKES,
                            data: { Strike: Strike.concat([CreateStrike]) },
                          })
                        }
                      }
                    });
                  }, 600);
                }),
              onRowUpdate: (newData, oldData) => 
                new Promise(resolve => {
                  setTimeout(() => {
                    resolve();
                    UpdateStrike({
                      variables: { 
                        id: newData.id,
                        name: newData.name,
                        description: newData.description,
                      },
                      update: (cache, { data: { UpdateStrike } }) => {
                        let relsToAdd = [];
                        let relsToDelete = [];

                        if (newData.ranks !== oldData.ranks) {
                          relsToAdd = relsToAdd.concat(newData.ranks.filter(r => !oldData.ranks.some(r2 => r2.id === r.id)));
                          relsToDelete = relsToDelete.concat(oldData.ranks.filter(r => !newData.ranks.some(r2 => r2.id === r.id)));
                        };
                        
                        if (relsToAdd.length !== 0){
                          MergeStrikeRanks({
                            variables: {
                              fromStrikeID: newData.id,
                              toRankIDs: relsToAdd.map(rel => rel.id)
                            },
                            update: (cache, { data: { MergeStrikeRanks } }) => {
                              const existingStrikes = cache.readQuery({ query: GET_STRIKES });
                              const newStrikes = existingStrikes.Strike.filter(r => (r.id !== oldData.id));
                              cache.writeQuery({
                                query: GET_STRIKES,
                                data: { Strike: newStrikes.concat(newData) }
                              });
                            }
                          });
                        }

                        if (relsToDelete.length !== 0){
                          DeleteStrikeRanks({
                            variables: {
                              fromStrikeID: newData.id,
                              toRankIDs: relsToDelete.map(rel => rel.id)
                            },
                            update: (cache, {data: { DeleteStrikeRanks } }) => {
                              const existingStrikes = cache.readQuery({ query: GET_STRIKES });
                              const newStrikes = existingStrikes.Strike.filter(r => (r.id !== oldData.id));
                              cache.writeQuery({
                                query: GET_STRIKES,
                                data: { Strike: newStrikes.concat(newData) }
                              });
                            }
                          })
                        }

                        // is this needed? here -->
                        const existingStrikes = cache.readQuery({ query: GET_STRIKES });
                        const newStrikes = existingStrikes.Strike.map(r => {
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
                        //   query: GET_STRIKES,
                        //   data: { Strike: newStrikes }
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
                    DeleteStrike({
                      variables: { id: oldData.id },
                      update: (cache) => {
                        const existingStrikes = cache.readQuery({ query: GET_STRIKES });
                        const newStrikes = existingStrikes.Strike.filter(r => (r.id !== oldData.id));
                        cache.writeQuery({
                          query: GET_STRIKES,
                          data: { Strike: newStrikes }
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
