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

const GET_BLOCKS = gql`
  {
    Block {
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

const CREATE_BLOCK = gql`
  mutation CreateBlock($name: String!, $description: String) 
  {
    CreateBlock(name: $name, description: $description) {
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

const UPDATE_BLOCK = gql`
  mutation UpdateBlock($id: ID!, $name: String!, $description: String) 
  {
    UpdateBlock(id: $id, name: $name, description: $description) {
      id
      name
      description
    }
  }
`;

const DELETE_BLOCK = gql`
  mutation DeleteBlock($id: ID!) 
  {
    DeleteBlock(id: $id) {
      id
    }
  }
`;

const MERGE_BLOCK_RANKS_RELS = gql`
  mutation MergeBlockRanks($fromBlockID: ID!, $toRankIDs: [ID!])
  {
    MergeBlockRanks(fromBlockID: $fromBlockID, toRankIDs: $toRankIDs) {
      id
      name
      rankOrder
      abbreviation
    }
  }
`;

const DELETE_BLOCK_RANKS_RELS = gql`
  mutation DeleteBlockRanks($fromBlockID: ID!, $toRankIDs: [ID!])
  {
    DeleteBlockRanks(fromBlockID: $fromBlockID, toRankIDs: $toRankIDs) {
      id
      name
      rankOrder
      abbreviation
    }
  }
`;

export default function Block({headerHeight}) {
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
    ? (a, b) => (b[orderBy]/*.TolowErcase()*/ < a[orderBy]/*.TolowErcase()*/ ? -1 : 1)
    : (a, b) => (a[orderBy]/*.TolowErcase()*/ < b[orderBy]/*.TolowErcase()*/ ? -1 : 1);
  };

  const [CreateBlock] = useMutation(CREATE_BLOCK);
  const [UpdateBlock] = useMutation(UPDATE_BLOCK);
  const [DeleteBlock] = useMutation(DELETE_BLOCK);
  const [MergeBlockRanks] = useMutation(MERGE_BLOCK_RANKS_RELS);
  const [DeleteBlockRanks] = useMutation(DELETE_BLOCK_RANKS_RELS);

  const { loading, error, data } = useQuery(GET_BLOCKS);

  if (loading) return "Loading...";
  if (error) return `Error ${error.message}`;

  return (
    <Paper className={classes.root} elevation={3} style={style2}>
      <Grid container>
        <Grid item xs={12}>
          <MaterialTable
            title="Block"
            columns={state.columns}
            options={{
              pageSize: 10,
              // pageSizeOptions: [5, 10, 20, 30 ,50, 75, 100 ],
            }}
            data={
              data.Block.sort(getSorting(order,orderBy)).map(s => {
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
                    CreateBlock({
                      variables: {
                        name: newData.name,
                        description: (newData.description !== undefined ? newData.description : ""),
                      },
                      update: (cache, { data: { CreateBlock } }) => {
                        const { Block } = cache.readQuery({ query: GET_BLOCKS });

                        if (newData.ranks.length !== 0) {
                          MergeBlockRanks({ 
                            variables: {
                              fromBlockID: CreateBlock.id,
                              toRankIDs: newData.ranks.map(r => r.id)
                            },
                            update: (cache, { data: { MergeBlockRanks } }) => {
                              CreateBlock.ranks = CreateBlock.ranks.concat(MergeBlockRanks)
                              cache.writeQuery({
                                query: GET_BLOCKS,
                                data: { Block: Block.concat([CreateBlock]) },
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
                    UpdateBlock({
                      variables: { 
                        id: newData.id,
                        name: newData.name,
                        description: newData.description,
                      },
                      update: (cache, { data: { UpdateBlock } }) => {
                        let relsToAdd = [];
                        let relsToDelete = [];

                        if (newData.ranks !== oldData.ranks) {
                          relsToAdd = relsToAdd.concat(newData.ranks.filter(r => !oldData.ranks.some(r2 => r2.id === r.id)));
                          relsToDelete = relsToDelete.concat(oldData.ranks.filter(r => !newData.ranks.some(r2 => r2.id === r.id)));
                        };
                        
                        if (relsToAdd.length !== 0){
                          MergeBlockRanks({
                            variables: {
                              fromBlockID: newData.id,
                              toRankIDs: relsToAdd.map(rel => rel.id)
                            },
                            update: (cache, { data: { MergeBlockRanks } }) => {
                              const existingBlocks = cache.readQuery({ query: GET_BLOCKS });
                              const newBlocks = existingBlocks.Block.filter(r => (r.id !== oldData.id));
                              cache.writeQuery({
                                query: GET_BLOCKS,
                                data: { Block: newBlocks.concat(newData) }
                              });
                            }
                          });
                        }

                        if (relsToDelete.length !== 0){
                          DeleteBlockRanks({
                            variables: {
                              fromBlockID: newData.id,
                              toRankIDs: relsToDelete.map(rel => rel.id)
                            },
                            update: (cache, {data: { DeleteBlockRanks } }) => {
                              const existingBlocks = cache.readQuery({ query: GET_BLOCKS });
                              const newBlocks = existingBlocks.Block.filter(r => (r.id !== oldData.id));
                              cache.writeQuery({
                                query: GET_BLOCKS,
                                data: { Block: newBlocks.concat(newData) }
                              });
                            }
                          })
                        }

                        // is this needed? here -->
                        const existingBlocks = cache.readQuery({ query: GET_BLOCKS });
                        const newBlocks = existingBlocks.Block.map(r => {
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
                        //   query: GET_BLOCKS,
                        //   data: { Block: newBlocks }
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
                    DeleteBlock({
                      variables: { id: oldData.id },
                      update: (cache) => {
                        const existingBlocks = cache.readQuery({ query: GET_BLOCKS });
                        const newBlocks = existingBlocks.Block.filter(r => (r.id !== oldData.id));
                        cache.writeQuery({
                          query: GET_BLOCKS,
                          data: { Block: newBlocks }
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
