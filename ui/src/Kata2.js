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

import KataDialog from './KataDialog';

const useStyles = makeStyles(theme => ({
  root: {
    maxWidth: "auto",
    marginTop: theme.spacing(3),
    overflowX: "auto",
    margin: "auto"
  },
  chips: {
    display: "flex",
    // flexWrap: "wrap"
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

const GET_KATAS = gql`
  {
    Kata {
      id
      name
      order
      numMoves
      ranks {
        id
        rankOrder
        name
        abbreviation
        colorhex
      }
    }
  }
`;

const CREATE_KATA = gql`
  mutation CreateKata($name: String!, $order: Int!) 
  {
    CreateKata(name: $name, order: $order) {
      id
      name
      order
      numMoves
      ranks {
        id
        rankOrder
        name
        abbreviation
        colorhex
      }
    }
  }
`;

const UPDATE_KATA = gql`
  mutation UpdateKata($id: ID!, $name: String!, $order: Int!) 
  {
    UpdateKata(id: $id, name: $name, order: $order) {
      id
      name
      order
    }
  }
`;

const DELETE_KATA = gql`
  mutation DeleteKata($id: ID!) 
  {
    DeleteKata(id: $id) {
      id
    }
  }
`;

const MERGE_KATA_RANKS_RELS = gql`
  mutation MergeKataRanks($fromKataID: ID!, $toRankIDs:[ID!])
  {
    MergeKataRanks(fromKataID:$fromKataID, toRankIDs: $toRankIDs){
      id
      name
    }
  }
`;

const DELETE_KATA_RANK_RELS = gql`
  mutation DeleteKataRanks($fromKataID: ID!, $toRankIDs: [ID!])
  {
    DeleteStrikeRanks(fromKataID: $fromKataID, toRankIDs: $toRankIDs) {
      id
      name
    }
  }
`;

const CREATE_KATA_MOVES = gql`
  mutation CreateKataMoves($kataID: ID!, $numMoves: Int!)
  {
    CreateKataMoves(kataID: $kataID, numMoves: $numMoves){
      id
      name
    }
  }
`;

export default function Kata({headerHeight}) {
  const classes = useStyles();

  const [ranks, setRanks] = useState("");
  const [kataOrder, setKataOrder] = useState('');

  const [order, setOrder] = useState("asc");
  const [orderBy, setOrderBy] = useState("order");

  const [numMoves, setNumMoves] = useState(0);

  const [state, setState] = React.useState({
    columns: [
      { title: 'Order', field: 'order', type: 'numeric',
        // editComponent: props => {
        //   return (
        //     <TextField
        //       id="outlined-number"
        //       label="Number"
        //       type="number"
        //       InputLabelProps={{
        //         shrink: true,
        //       }}
        //       // value={props.value}
        //       // value={parseInt(props.value)}
        //       value={parseInt(props.value)}
        //       // onChange={e => setKataOrder(parseInt(e.target.value))}
        //       onChange={props.onChange}
        //       // variant="outlined"
        //       helperText="Enter order of kata"
        //     />
        //   )
        // }
      },
      { title: 'Name', field: 'name' },
      { title: 'Number of Moves', field: 'numMoves', type: 'numeric', editable: 'onAdd'},
      { title: 'Testing Ranks', field: 'ranks', render: rowData => (
          <div className={classes.chips}>
            {rowData.ranks.sort(getSorting("asc","rankOrder")).map(rank => (
              <Chip
                key={rank.id}
                label={rank.abbreviation} // abbreviation vs name
                variant="outlined"
                color='primary' 
                // style={{backgroundColor:rank.colorhex}}
                style={{backgroundColor:rank.colorhex, color: (rank.colorhex === "#000000" ? "#ffeb3b" : "#000000")}}
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

  const [open, setOpen] = useState(false);
  const [selectedKata, setSelectedKata] = useState("");

  const handleClickOpen = (event,rowData) => {
    setOpen(true);
    // console.log(rowData);
    setNumMoves(rowData.numMoves);
    // console.log(numMoves);
    setSelectedKata(rowData.id);
    // console.log(rowData.id);
  };

  // const handleClose = event => {
  //   setOpen(false);
  // };

  const getSorting = (order, orderBy) => {
  return order === "desc"
    ? (a, b) => (b[orderBy] < a[orderBy] ? -1 : 1)
    : (a, b) => (a[orderBy] < b[orderBy] ? -1 : 1);
  };

  const [CreateKata] = useMutation(CREATE_KATA);
  const [UpdateKata] = useMutation(UPDATE_KATA);
  const [DeleteKata] = useMutation(DELETE_KATA);
  const [MergeKataRanks] = useMutation(MERGE_KATA_RANKS_RELS);
  const [DeleteKataRanks] = useMutation(DELETE_KATA_RANK_RELS);
  const [CreateKataMoves] = useMutation(CREATE_KATA_MOVES);

  const { loading, error, data } = useQuery(GET_KATAS);

  if (loading) return "Loading...";
  if (error) return `Error ${error.message}`;

  return (
    <div>
    <KataDialog open={open} setOpen={setOpen} selectedKata={selectedKata} setSelectedKata={setSelectedKata} numMoves={numMoves}/>
    <Paper className={classes.root} elevation={3} style={style2}>
      <Grid container>
        <Grid item xs={12}>
          <MaterialTable
            title="Kata"
            columns={state.columns}
            data={
              data.Kata.sort(getSorting(order,orderBy)).map(s => {
                return {
                  ...s,
                }
              })
            }
            options={{
              pageSize: 20,
              // pageSizeOptions: [5, 10, 20, 30 ,50, 75, 100 ],
              sorting: false,
              addRowPosition: 'first'
            }}
            onRowClick={handleClickOpen}
            editable={{
              // TODO - on add set number of moves to auto create
              onRowAdd: newData =>
                new Promise(resolve => {
                  setTimeout(() => {
                    resolve();
                    CreateKata({
                      variables: {
                        name: newData.name,
                        order: parseInt(newData.order)
                      },
                      update: (cache, { data: { CreateKata } }) => {
                        const { Kata } = cache.readQuery({ query: GET_KATAS });

                        if(newData.numMoves > 0){
                          // console.log("add moves here");
                          CreateKataMoves({
                            variables: {
                              kataID: CreateKata.id,
                              numMoves: parseInt(newData.numMoves)
                            },
                            update: (cache, { data: { CreateKataMoves } }) => {
                              cache.writeQuery({
                                query: GET_KATAS,
                                data: { Kata: Kata.concat([CreateKata]) },
                              })
                            }
                          })
                        }

                        // if(newData.ranks.length !== 0) {
                        if(newData.ranks !== undefined) {
                          MergeKataRanks({
                            variables: {
                              fromKataID: CreateKata.id,
                              toRankIDs: newData.ranks.map(r => r.id)
                            },
                            update: (cache, { data: { MergeKataRanks } }) => {
                              cache.writeQuery({
                                query: GET_KATAS,
                                data: { Kata: Kata.concat([CreateKata]) },
                              })
                            }
                          })
                        } else {
                          cache.writeQuery({
                            query: GET_KATAS,
                            data: { Kata: Kata.concat([CreateKata]) },
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
                    UpdateKata({
                      variables: { 
                        id: newData.id,
                        name: newData.name,
                        order: parseInt(newData.order)
                      },
                      update: (cache, { data: { UpdateKata } }) => {
                        let relsToAdd = [];
                        let relsToDelete = [];

                        if (newData.ranks !== oldData.ranks) {
                          relsToAdd = relsToAdd.concat(newData.ranks.filter(r => !oldData.ranks.some(r2 => r2.id === r.id)));
                          relsToDelete = relsToDelete.concat(oldData.ranks.filter(r => !newData.ranks.some(r2 => r2.id === r.id)));
                        };

                        if (relsToAdd.length !== 0) {
                          MergeKataRanks({
                            variables: {
                              fromKataID: newData.id,
                              toRankIDs: relsToAdd.map(rel => rel.id)
                            },
                            update: (cache, { data: { MergeKataRanks } }) => {
                              const existingKatas = cache.readQuery({ query: GET_KATAS });
                              const newKatas = existingKatas.Kata.filter(r => (r.id !== oldData.id));
                              cache.writeQuery({
                                query: GET_KATAS,
                                data: { Kata: newKatas.concat(newData) }
                              });
                            }
                          })
                        }

                        if (relsToDelete.length !== 0) {
                          DeleteKataRanks({
                            variables: {
                              fromKataID: newData.id,
                              toRankIDs: relsToDelete.map(rel => rel.id)
                            },
                            update: (cache, { data: {DeleteKataRanks } }) => {
                              const existingKatas = cache.readQuery({ query: GET_KATAS });
                              const newKatas = existingKatas.Kata.filter(r => (r.id !== oldData.id));
                              cache.writeQuery({
                                query: GET_KATAS,
                                data: { Kata: newKatas.concat(newData) }
                              });
                            }
                          })
                        }

                        // is this needed? here -->
                        const existingKatas = cache.readQuery({ query: GET_KATAS });
                        const newKatas = existingKatas.Kata.map(r => {
                          if (r.id === oldData.id) {
                            return {
                              ...r, 
                              name: newData.name, 
                              order: parseInt(newData.order)
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
                // TODO - update to delete moves & steps
                // onRowDelete: oldData =>
                // new Promise(resolve => {
                //   setTimeout(() => {
                //     resolve();
                //     DeleteKata({
                //       variables: { id: oldData.id },
                //       update: (cache) => {
                //         const existingKatas = cache.readQuery({ query: GET_KATAS });
                //         const newKatas = existingKatas.Kata.filter(r => (r.id !== oldData.id));
                //         cache.writeQuery({
                //           query: GET_KATAS,
                //           data: { Kata: newKatas }
                //         });
                //       }
                //     });
                //   }, 600);
                // }),
            }}
          />
        </Grid>
      </Grid>
    </Paper>
    </div>
  );
}
