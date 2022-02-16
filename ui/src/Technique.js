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

import SelectType from "./SelectType";


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
      colorhex
    }
  }
`;

const GET_TECHNIQUES = gql`
  {
    Technique {
      id
      name
      description
      __typename
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

const CREATE_TECHNIQUE = gql`
  mutation CreateTechnique($name: String!, $description: String, $type: String) 
  {
    CreateTechnique(name: $name, description: $description, type: $type) {
      id
      name
      description
      __typename
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

const UPDATE_TECHNIQUE = gql`
  mutation UpdateTechnique($id: ID!, $newType: String, $oldType: String, $name: String!, $description: String) 
  {
    UpdateTechnique(id: $id, newType: $newType, oldType: $oldType, name: $name, description: $description) {
      id
      name
      description
      __typename
      #ranks {
      #  id
      #  rankOrder
      #  name
      #  abbreviation
      #}
    }
  }
`;

const UPDATE_TECHNIQUE_PROPS = gql`
  mutation UpdateTechniqueProps($id: ID!, $name: String!, $description: String) 
  {
    UpdateTechniqueProps(id: $id, name: $name, description: $description) {
      id
      name
      description
      __typename
      #ranks {
      #  id
      #  rankOrder
      #  name
      #  abbreviation
      #}
    }
  }
`;

const UPDATE_TECHNIQUE_LABELS = gql`
  mutation UpdateTechniqueLabels($id: ID!, $newType: String, $oldType: String) 
  {
    UpdateTechniqueLabels(id: $id, newType: $newType, oldType: $oldType) {
      id
      name
      description
      __typename
      #ranks {
      #  id
      #  rankOrder
      #  name
      #  abbreviation
      #}
    }
  }
`;

const DELETE_TECHNIQUE = gql`
  mutation DeleteTechnique($id: ID!) 
  {
    DeleteTechnique(id: $id) {
      id
    }
  }
`;

const MERGE_TECHNIQUE_RANKS_RELS = gql`
  mutation MergeTechniqueRanks($fromTechniqueID: ID!, $toRankIDs: [ID!])
  {
    MergeTechniqueRanks(fromTechniqueID: $fromTechniqueID, toRankIDs: $toRankIDs) {
      id
      name
      rankOrder
      abbreviation
      colorhex
    }
  }
`;

const DELETE_TECHNIQUE_RANKS_RELS = gql`
  mutation DeleteTechniqueRanks($fromTechniqueID: ID!, $toRankIDs: [ID!])
  {
    DeleteTechniqueRanks(fromTechniqueID: $fromTechniqueID, toRankIDs: $toRankIDs) {
      id
      name
      rankOrder
      abbreviation
    }
  }
`;


export default function Technique({headerHeight}) {
  const classes = useStyles();

  const [description, setDescription] = useState("0");
  const [ranks, setRanks] = useState("");
  const [type, setType] = useState("");

  const [order, setOrder] = useState("asc");
  const [orderBy, setOrderBy] = useState("name");

  const [state, setState] = React.useState({
    columns: [
      { title: 'Type', field: '__typename',  
        editComponent: props => {
          // console.log("props: ", props);
          if (props.value !== undefined) {
            return (
              <SelectType value={props.value} onChange={props.onChange} />
            )
          } else {
            return (
              <SelectType value={''} onChange={props.onChange} />
            )
          }
        }
      },
      { title: 'Name', field: 'name' },
      { title: 'Description', field: 'description',
        editComponent: props => {
          if (props.value !== undefined) {
            return (
              <TextField
                multiline
                value={props.value}
                onChange={props.onChange}
              />
            )
          } else {
            return (
              <TextField
                multiline
                value={""}
                onChange={props.onChange}
              />
            )
          }
        }
      },
      { title: 'Variation', field: 'variation' },
      { title: 'Ranks', field: 'ranks', render: rowData => (
          <div className={classes.chips}>
            {rowData.ranks.sort(getSorting("asc","rankOrder")).map(rank => (
              <Chip
                key={rank.id}
                label={rank.abbreviation} // abbreviation vs name
                variant="outlined"
                color='primary' 
                style={{backgroundColor:rank.colorhex}}
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

  // const handleSortRequest = property => {
  //   const newOrderBy = property;
  //   let newOrder = "desc";

  //   if (orderBy === property && order === "desc") {
  //     newOrder = "asc";
  //   }

  //   setOrder(newOrder);
  //   setOrderBy(newOrderBy);
  // };

  const getSorting = (order, orderBy) => {
  return order === "desc"
    ? (a, b) => (b[orderBy]/*.toLowerCase()*/ < a[orderBy]/*.toLowerCase()*/ ? -1 : 1)
    : (a, b) => (a[orderBy]/*.toLowerCase()*/ < b[orderBy]/*.toLowerCase()*/ ? -1 : 1);
  };

  let key = [];

  // TODO - update to include 'toLowerCase()'
  function sortByMultipleKey(keys) {
    return function(a, b) {
      if (keys.length == 0) return 0; // force to equal if keys run out
      key = keys[0]; // take out the first key
      if (a[key].toLowerCase() < b[key].toLowerCase()) return -1; // will be 1 if DESC
      else if (a[key].toLowerCase() > b[key].toLowerCase()) return 1; // will be -1 if DESC
      else return sortByMultipleKey(keys.slice(1))(a, b);
    }
  }

  const [CreateTechnique] = useMutation(CREATE_TECHNIQUE);
  const [UpdateTechnique] = useMutation(UPDATE_TECHNIQUE);
  const [UpdateTechniqueProps] = useMutation(UPDATE_TECHNIQUE_PROPS);
  const [UpdateTechniqueLabels] = useMutation(UPDATE_TECHNIQUE_LABELS);
  const [DeleteTechnique] = useMutation(DELETE_TECHNIQUE);
  const [MergeTechniqueRanks] = useMutation(MERGE_TECHNIQUE_RANKS_RELS);
  const [DeleteTechniqueRanks] = useMutation(DELETE_TECHNIQUE_RANKS_RELS);

  const { loading, error, data } = useQuery(GET_TECHNIQUES);

  // console.log("data: ", data);

  if (loading) return "Loading...";
  if (error) return `Error ${error.message}`;

  return (
    <Paper className={classes.root} elevation={3} style={style2}>
      <Grid container>
        <Grid item xs={12}>
          <MaterialTable
            title="Techniques"
            columns={state.columns}
            options={{
              pageSize: 10,
              // pageSizeOptions: [5, 10, 20, 30 ,50, 75, 100 ],
              sorting: false,
              addRowPosition: 'first',
            }}
            data={
              // data.Technique.sort(getSorting(order,orderBy)).map(t => {
              data.Technique.sort(sortByMultipleKey(['__typename', 'name'])).map(t => {
                return {
                  ...t,
                }
              })
            }
            editable={{
              onRowAdd: newData =>
                new Promise(resolve => {
                  setTimeout(() => {
                    resolve();
                    // console.log("newData: ", newData);
                    CreateTechnique({
                      variables: {
                        name: newData.name,
                        description: (newData.description !== undefined ? newData.description : ""),
                        // TODO - address line below
                        type: (newData.type !== undefined ? newData.type : "Block")
                      },
                      update: (cache, { data: { CreateTechnique } }) => {
                        const { Technique } = cache.readQuery({ query: GET_TECHNIQUES });

                        // if (newData.ranks.length !== 0) {
                        if (newData.ranks !== undefined) {
                          MergeTechniqueRanks({
                            variables: {
                              fromTechniqueID: CreateTechnique.id,
                              toRankIDs: newData.ranks.map(r => r.id)
                            },
                            update: (cache, { data: { MergeTechniqueRanks } }) => {
                              CreateTechnique.ranks = CreateTechnique.ranks.concat(MergeTechniqueRanks)
                              cache.writeQuery({
                                query: GET_TECHNIQUES,
                                data: { Technique: Technique.concat([CreateTechnique]) },
                              })
                            }
                          });
                        } else {
                          cache.writeQuery({
                            query: GET_TECHNIQUES,
                            data: { Technique: Technique.concat([CreateTechnique]) },
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
                    // console.log("newData: ", newData);
                    // console.log("oldData: ", oldData);
                    // UpdateTechnique({
                    UpdateTechniqueProps({
                      variables: { 
                        id: newData.id,
                        name: newData.name,
                        description: newData.description,
                        // TODO - address 2 line below. here -->
                        // newType: (newData.type !== undefined ? newData.type : "Block"),
                        // oldType: (newData.type !== undefined ? newData.type : "Block")
                        // <-- to here
                      },
                      // update: (cache, { data: { UpdateTechnique } }) => {
                      update: (cache, { data: { UpdateTechniqueProps } }) => {
                        // console.log(UpdateTechniqueProps);

                        if (newData.__typename !== oldData.__typename) {
                          // console.log("update label");
                          UpdateTechniqueLabels({
                            variables: {
                              id: UpdateTechniqueProps.id,
                              oldType: oldData.__typename,
                              newType: newData.__typename
                            },
                            update: (cache, { data: { UpdateTechniqueLabels } }) => {
                              // console.log(UpdateTechniqueLabels);
                              const existingTechniques = cache.readQuery({ query: GET_TECHNIQUES });
                              const newTechniques = existingTechniques.Technique.filter(r => (r.id !== oldData.id));
                              cache.writeQuery({
                                query: GET_TECHNIQUES,
                                data: { Technique: newTechniques.concat(newData) }
                              });
                            }
                          });
                        }

                        let relsToAdd = [];
                        let relsToDelete = [];

                        if (newData.ranks !== oldData.ranks) {
                          relsToAdd = relsToAdd.concat(newData.ranks.filter(r => !oldData.ranks.some(r2 => r2.id === r.id)));
                          relsToDelete = relsToDelete.concat(oldData.ranks.filter(r => !newData.ranks.some(r2 => r2.id === r.id)));
                        };
                        
                        if (relsToAdd.length !== 0){
                          MergeTechniqueRanks({
                            variables: {
                              fromTechniqueID: newData.id,
                              toRankIDs: relsToAdd.map(rel => rel.id)
                            },
                            update: (cache, { data: { MergeTechniqueRanks } }) => {
                              const existingTechniques = cache.readQuery({ query: GET_TECHNIQUES });
                              const newTechniques = existingTechniques.Technique.filter(r => (r.id !== oldData.id));
                              cache.writeQuery({
                                query: GET_TECHNIQUES,
                                data: { Technique: newTechniques.concat(newData) }
                              });
                            }
                          });
                        }

                        if (relsToDelete.length !== 0){
                          DeleteTechniqueRanks({
                            variables: {
                              fromTechniqueID: newData.id,
                              toRankIDs: relsToDelete.map(rel => rel.id)
                            },
                            update: (cache, {data: { DeleteTechniqueRanks } }) => {
                              const existingTechniques = cache.readQuery({ query: GET_TECHNIQUES });
                              const newTechniques = existingTechniques.Technique.filter(r => (r.id !== oldData.id));
                              cache.writeQuery({
                                query: GET_TECHNIQUES,
                                data: { Technique: newTechniques.concat(newData) }
                              });
                            }
                          })
                        }

                        // is this needed? here -->
                        const existingTechniques = cache.readQuery({ query: GET_TECHNIQUES });
                        const newTechniques = existingTechniques.Technique.map(r => {
                          if (r.id === oldData.id) {
                            // console.log("r: ", r);
                            return {
                              ...r, 
                              name: newData.name, 
                              description: newData.description,
                              // _typename: newData._typename
                            };
                          } else {
                            return r;
                          }
                        });
                        // cache.writeQuery({
                        //   query: GET_TECHNIQUES,
                        //   data: { Technique: newTechniques }
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
                    // console.log("oldData: ",oldData);
                    DeleteTechnique({
                      variables: { id: oldData.id },
                      update: (cache) => {
                        const existingTechniques = cache.readQuery({ query: GET_TECHNIQUES });
                        const newTechniques = existingTechniques.Technique.filter(r => (r.id !== oldData.id));
                        cache.writeQuery({
                          query: GET_TECHNIQUES,
                          data: { Technique: newTechniques }
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
