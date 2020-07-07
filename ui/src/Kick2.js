import React, { useState, useRef } from 'react';
import { useQuery, useMutation } from "@apollo/react-hooks";
import gql from "graphql-tag";
import { makeStyles } from "@material-ui/core/styles";
import MaterialTable from 'material-table';
import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";

import TextField from "@material-ui/core/TextField";

import RankListFilter from './RankListFilter';

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

const MERGE_KICK_RANK_REL = gql`
  mutation MergeKickRank($kickID: ID!, $rankID: ID!)
  {
    MergeKickRank(fromKickID: $kickID, toRankID: $rankID) {
      id
    }
  }
`;

const MERGE_KICK_RANKS_RELS = gql`
  mutation MergeKickRanks($kickID: ID!, $rankIDs:[ID!])
  {
    MergeKickRanks(fromKickID:$kickID, toRankIDs: $rankIDs){
      id
    }
  }
`;

export default function Kick({headerHeight}) {
  const classes = useStyles();

  // const [name, setName] = useState("");
  const [description, setDescription] = useState("0");
  const [ranks, setRanks] = useState("");

  const [order, setOrder] = useState("asc");
  const [orderBy, setOrderBy] = useState("name");

  const [selectedRanks, setSelectedRanks] = useState([]);

  const [ranksToSelect, setRanksToSelect] = useState({ 0: 'rank1', 1: 'rank2' });

  const [state, setState] = React.useState({
    columns: [
      { title: 'Name', field: 'name' },
      { title: 'Description', field: 'description' },
      { title: 'Ranks', field: 'ranksString',
        editComponent: props => (
         <RankListFilter selectedRanks={selectedRanks} setSelectedRanks={setSelectedRanks} /> 
        )
      // },
      // {
      //   title: 'Birth Place',
      //   field: 'birthCity',
      //   // lookup: { 34: 'İstanbul', 63: 'Şanlıurfa' },
      //   lookup: ranksToSelect,
      },
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

  const [CreateKick] = useMutation(CREATE_KICK);
  const [MergeKickRanks] = useMutation(MERGE_KICK_RANKS_RELS);

  const [UpdateKick] = useMutation(UPDATE_KICK);

  const [DeleteKick] = useMutation(DELETE_KICK);

  const { loading, error, data } = useQuery(GET_KICKS);

  if (loading) return "Loading...";
  if (error) return `Error ${error.message}`;

  return (
    <Paper className={classes.root} elevation={3} style={style2}>
      <Grid container>
    {/*<RankListFilter selectedRanks={selectedRanks} setSelectedRanks={setSelectedRanks} /> */}
        <Grid item xs={12}>
          <MaterialTable
            title="Kick"
            columns={state.columns}
            data={
              data.Kick.sort(getSorting(order,orderBy)).map(s => {
                return {
                  ...s,
                  ranksString: s.ranks.sort(getSorting("asc","rankOrder")).map(r => { return r.name }).flat(2).join(', ')
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
                        description: newData.description
                      },
                      update: (cache, { data: { CreateKick } }) => {
                        const { Kick } = cache.readQuery({ query: GET_KICKS });
                        cache.writeQuery({
                          query: GET_KICKS,
                          data: { Kick: Kick.concat([CreateKick]) },
                        })
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
                        // id: oldData.id,
                        id: newData.id,
                        // name: name, 
                        name: newData.name,
                        // description: description
                        description: newData.description
                      },
                      update: (cache) => {
                        const existingKicks = cache.readQuery({ query: GET_KICKS });
                        const newKicks = existingKicks.Kick.map(r => {
                          if (r.id === oldData.id) {
                            return {
                              ...r, 
                              name: newData.name, 
                              description: newData.description
                            };
                          } else {
                            return r;
                          }
                        });
                        cache.writeQuery({
                          query: GET_KICKS,
                          data: { Kick: newKicks }
                        })
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