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
      }
    }
  }
`;

const ADD_STRIKE_RANKS = gql`
  mutation AddStrikeRanks(
    $from: _StrikeInput!,
    $to: _RankInput!
  ) {
    AddStrikeRanks(from: $from, to: $to) {
      from {
        id
#        name
      }
      to {
        id
        name
        rankOrder
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

// const MERGE_STRIKE_RANK_REL = gql`
//   mutation MergeStrikeRank($strikeID: ID!, $rankID: ID!)
//   {
//     MergeStrikeRank(fromStrikeID: $strikeID, toRankID: $rankID) {
//       id
//     }
//   }
// `;

const MERGE_STRIKE_RANKS_RELS = gql`
  mutation MergeStrikeRanks($fromStrikeName: String!, $toRankNames:[String!])
  {
    MergeStrikeRanks(fromStrikeName:$fromStrikeName, toRankNames: $toRankNames){
      id
      name
      rankOrder
    }
  }
`;


export default function Strike({headerHeight}) {
  const classes = useStyles();

  // const [name, setName] = useState("");
  const [description, setDescription] = useState("0");
  const [ranks, setRanks] = useState("");

  const [order, setOrder] = useState("asc");
  const [orderBy, setOrderBy] = useState("name");

  const [selectedRanks, setSelectedRanks] = useState([]);

  const updateRanks = (ranks) => {
    // console.log(selectedRanks);
    setSelectedRanks(ranks);
  }

  // function handleRowClick (event, rowData) {
  //   console.log(rowData);
  //   setSelectedRanks(rowData.ranks);
  // };

  // const [ranksToSelect, setRanksToSelect] = useState({ 0: 'rank1', 1: 'rank2' });

  const [state, setState] = React.useState({
    columns: [
      { title: 'Name', field: 'name' },
      { title: 'Description', field: 'description' },
      // { title: 'Ranks', field: 'ranksString',
      //   editComponent: props => {
      //     // console.log(props);
      //     // if (props.rowData.ranks !== undefined) {
      //     //   if (props.rowData.ranks.length !== 0 ) {
      //     //     console.log(props.rowData.ranks.map(r => r.name));
      //     //     // console.log(props.rowData.ranks);
      //     //     // updateRanks(props.rowData.ranks.map(r => r.name));
      //     //     // setSelectedRanks(props.rowData.ranks.map(r => r.name));
      //     //   }
      //     // }
      //   return(
      //    // <RankListFilter _selectedRanks={_selectedRanks} _setSelectedRanks={_setSelectedRanks} /> 
      //    <RankListFilter onRanksUpdate={updateRanks} selectedRanks={selectedRanks}/> 
      //   )}
      // // },
      { title: 'Ranks', field: 'ranks', render: rowData => (
          <div className={classes.chips}>
            {rowData.ranks.map(rank => (
              <Chip
                key={rank.name}
                label={rank.name}
              />
            ))}
            </div>),
        editComponent: props => {
          console.log(props);
          console.log(props.value);
          console.log(selectedRanks);
          if (props.value !== undefined) {
            // setSelectedRanks(props.value.map(value => value.name));
            console.log("here");
            console.log(props.value.map(value => value.name));
            return(
              // <RankListFilter onRanksUpdate={updateRanks} selectedRanks={selectedRanks} /> 
              <RankListFilter onRanksUpdate={updateRanks} setSelectedRanks={setSelectedRanks} selectedRanks={props.value.map(value => value.name)}/> 
              // <RankListFilter onRanksUpdate={updateRanks} selectedRanks={props.value.map(value => value.name)} onChange={e => props.onChange(e.target.map(value => value.name))}/> 
            )
          } else {
            return(
              // <RankListFilter onRanksUpdate={updateRanks} selectedRanks={selectedRanks}/> 
              <RankListFilter onRanksUpdate={updateRanks} setSelectedRanks={setSelectedRanks} selectedRanks={[]}/> 
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

  // const [newStikeId, setNewStrikeId] = useState("");

  const [CreateStrike] = useMutation(CREATE_STRIKE);
  const [AddStrikeRanks] = useMutation(ADD_STRIKE_RANKS);
  const [MergeStrikeRanks] = useMutation(MERGE_STRIKE_RANKS_RELS);
  // const [MergeStrikeRanks] = useMutation(MERGE_STRIKE_RANKS_RELS);

  const [UpdateStrike] = useMutation(UPDATE_STRIKE);

  const [DeleteStrike] = useMutation(DELETE_STRIKE);

  const { loading, error, data } = useQuery(GET_STRIKES);

  if (loading) return "Loading...";
  if (error) return `Error ${error.message}`;

  return (
    <Paper className={classes.root} elevation={3} style={style2}>
      <Grid container>
    {/*<RankListFilter selectedRanks={selectedRanks} setSelectedRanks={setSelectedRanks} /> */}
        <Grid item xs={12}>
          <MaterialTable
            title="Strike"
            columns={state.columns}
            // onRowClick={(event,rowData) => handleRowClick(event, rowData)}
            onRowClick={rowData => setSelectedRanks(rowData.ranks)}
            data={
              data.Strike.sort(getSorting(order,orderBy)).map(s => {
                return {
                  ...s,
                  // ranksString: s.ranks.sort(getSorting("asc","rankOrder")).map(r => { return r.name }).flat(2).join(', ')
                }
              })
            }
            editable={{
              onRowAdd: newData =>
                new Promise(resolve => {
                  setTimeout(() => {
                    console.log(newData);
                    resolve();
                    CreateStrike({
                      variables: {
                        name: newData.name,
                        // description: (newData.description !== null ? newData.description : ""),
                        description: (newData.description !== undefined ? newData.description : ""),
                      },
                      update: (cache, { data: { CreateStrike } }) => {
                        const { Strike } = cache.readQuery({ query: GET_STRIKES });

                        MergeStrikeRanks({
                          variables: {
                            // fromStrikeID: CreateStrike.id,
                            fromStrikeName: CreateStrike.name,
                            // toRankIDs: selectedRanks
                            toRankNames: selectedRanks
                          },
                          update: (cache, { data: { MergeStrikeRanks } }) => {
                            console.log(MergeStrikeRanks);
                            CreateStrike.ranks = CreateStrike.ranks.concat(MergeStrikeRanks)
                            cache.writeQuery({
                              query: GET_STRIKES,
                              data: { Strike: Strike.concat([CreateStrike]) },
                            })
                          }
                        });

                        // AddStrikeRanks({
                        //   variables: {
                        //     from: {id: CreateStrike.id},
                        //     to: {id: "cd4abd01-03ab-4204-b706-87390a509c3d"}
                        //   },
                        //   update: (cache, { data: { AddStrikeRanks } }) => {
                        //     CreateStrike.ranks = CreateStrike.ranks.concat([AddStrikeRanks.to])
                        //     cache.writeQuery({
                        //       query: GET_STRIKES,
                        //       data: { Strike: Strike.concat([CreateStrike]) },
                        //     })
                        //   }
                        // });


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
                        // id: oldData.id,
                        id: newData.id,
                        // name: name, 
                        name: newData.name,
                        // description: description
                        description: newData.description,
                        // ranks: newData.ranks
                      },
                      update: (cache) => {
                        const existingStrikes = cache.readQuery({ query: GET_STRIKES });
                        const newStrikes = existingStrikes.Strike.map(r => {
                          if (r.id === oldData.id) {
                            // console.log(r);
                            return {
                              ...r, 
                              name: newData.name, 
                              description: newData.description,
                              // ranks: newData.ranks
                            };
                          } else {
                            return r;
                          }
                        });
                        cache.writeQuery({
                          query: GET_STRIKES,
                          data: { Strike: newStrikes }
                        })
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
