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
      }
    }
  }
`;

const CREATE_TURN = gql`
  mutation CreateTurn($name: String!, $description: String!) 
  {
    CreateTurn(name: $name, description: $description) {
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

const UPDATE_TURN = gql`
  mutation UpdateTurn($id: ID!, $name: String!, $description: String!) 
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

const MERGE_TURN_RANK_REL = gql`
  mutation MergeTurnRank($turnID: ID!, $rankID: ID!)
  {
    MergeTurnRank(fromTurnID: $turnID, toRankID: $rankID) {
      id
    }
  }
`;

const MERGE_TURN_RANKS_RELS = gql`
  mutation MergeTurnRanks($turnID: ID!, $rankIDs:[ID!])
  {
    MergeTurnRanks(fromTurnID:$turnID, toRankIDs: $rankIDs){
      id
    }
  }
`;

export default function Turn({headerHeight}) {
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

  const [CreateTurn] = useMutation(CREATE_TURN);
  const [MergeTurnRanks] = useMutation(MERGE_TURN_RANKS_RELS);

  const [UpdateTurn] = useMutation(UPDATE_TURN);

  const [DeleteTurn] = useMutation(DELETE_TURN);

  const { loading, error, data } = useQuery(GET_TURNS);

  if (loading) return "Loading...";
  if (error) return `Error ${error.message}`;

  return (
    <Paper className={classes.root} elevation={3} style={style2}>
      <Grid container>
    {/*<RankListFilter selectedRanks={selectedRanks} setSelectedRanks={setSelectedRanks} /> */}
        <Grid item xs={12}>
          <MaterialTable
            title="Turn"
            columns={state.columns}
            data={
              data.Turn.sort(getSorting(order,orderBy)).map(s => {
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
                    CreateTurn({
                      variables: {
                        name: newData.name,
                        description: newData.description
                      },
                      update: (cache, { data: { CreateTurn } }) => {
                        const { Turn } = cache.readQuery({ query: GET_TURNS });
                        cache.writeQuery({
                          query: GET_TURNS,
                          data: { Turn: Turn.concat([CreateTurn]) },
                        })
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
                        // id: oldData.id,
                        id: newData.id,
                        // name: name, 
                        name: newData.name,
                        // description: description
                        description: newData.description
                      },
                      update: (cache) => {
                        const existingTurns = cache.readQuery({ query: GET_TURNS });
                        const newTurns = existingTurns.Turn.map(r => {
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
                          query: GET_TURNS,
                          data: { Turn: newTurns }
                        })
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
