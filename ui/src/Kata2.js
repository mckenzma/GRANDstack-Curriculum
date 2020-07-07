import React, { useState, useRef } from 'react';
import { useQuery, useMutation } from "@apollo/react-hooks";
import gql from "graphql-tag";
import { makeStyles } from "@material-ui/core/styles";
import MaterialTable from 'material-table';
import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";

import TextField from "@material-ui/core/TextField";

import RankListFilter from './RankListFilter';

import KataDialog from './KataDialog';

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

const GET_KATAS = gql`
  {
    Kata {
      id
      name
      ranks {
        id
        rankOrder
        name
      }
    }
  }
`;

const CREATE_KATA = gql`
  mutation CreateKata($name: String!) 
  {
    CreateKata(name: $name) {
      id
      name
      ranks {
        id
        rankOrder
        name
      }
    }
  }
`;

const UPDATE_KATA = gql`
  mutation UpdateKata($id: ID!, $name: String!) 
  {
    UpdateKata(id: $id, name: $name) {
      id
      name
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

const MERGE_KATA_RANK_REL = gql`
  mutation MergeKataRank($kataID: ID!, $rankID: ID!)
  {
    MergeKataRank(fromKataID: $kataID, toRankID: $rankID) {
      id
    }
  }
`;

const MERGE_KATA_RANKS_RELS = gql`
  mutation MergeKataRanks($kataID: ID!, $rankIDs:[ID!])
  {
    MergeKataRanks(fromKataID:$kataID, toRankIDs: $rankIDs){
      id
    }
  }
`;

export default function Kata({headerHeight}) {
  const classes = useStyles();

  // const [name, setName] = useState("");
  const [ranks, setRanks] = useState("");

  const [order, setOrder] = useState("asc");
  const [orderBy, setOrderBy] = useState("name");

  const [selectedRanks, setSelectedRanks] = useState([]);

  const [ranksToSelect, setRanksToSelect] = useState({ 0: 'rank1', 1: 'rank2' });

  const [state, setState] = React.useState({
    columns: [
      { title: 'Name', field: 'name' },
      { title: 'Ranks', field: 'ranksString',
        editComponent: props => (
         <RankListFilter selectedRanks={selectedRanks} setSelectedRanks={setSelectedRanks} /> 
        )
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

  const [open, setOpen] = useState(false);
  const [selectedKata, setSelectedKata] = useState("");

  const handleClickOpen = (event,rowData) => {
    setOpen(true);
    // console.log(rowData);
    setSelectedKata(rowData.id);
    console.log(rowData.id);
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
  const [MergeKataRanks] = useMutation(MERGE_KATA_RANKS_RELS);

  const [UpdateKata] = useMutation(UPDATE_KATA);

  const [DeleteKata] = useMutation(DELETE_KATA);

  const { loading, error, data } = useQuery(GET_KATAS);

  if (loading) return "Loading...";
  if (error) return `Error ${error.message}`;

  console.log(data);

  return (
    <div>
    <KataDialog open={open} setOpen={setOpen} selectedKata={selectedKata} setSelectedKata={setSelectedKata}/>
    <Paper className={classes.root} elevation={3} style={style2}>
      <Grid container>
    {/*<RankListFilter selectedRanks={selectedRanks} setSelectedRanks={setSelectedRanks} /> */}
        <Grid item xs={12}>
          <MaterialTable
            title="Kata"
            columns={state.columns}
            data={
              data.Kata.sort(getSorting(order,orderBy)).map(s => {
                return {
                  ...s,
                  ranksString: s.ranks.sort(getSorting("asc","rankOrder")).map(r => { return r.name }).flat(2).join(', ')
                }
              })
            }
            onRowClick={handleClickOpen}
            editable={{
              onRowAdd: newData =>
                new Promise(resolve => {
                  setTimeout(() => {
                    resolve();
                    CreateKata({
                      variables: {
                        name: newData.name
                      },
                      update: (cache, { data: { CreateKata } }) => {
                        const { Kata } = cache.readQuery({ query: GET_KATAS });
                        cache.writeQuery({
                          query: GET_KATAS,
                          data: { Kata: Kata.concat([CreateKata]) },
                        })
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
                        // id: oldData.id,
                        id: newData.id,
                        // name: name, 
                        name: newData.name,
                      },
                      update: (cache) => {
                        const existingKatas = cache.readQuery({ query: GET_KATAS });
                        const newKatas = existingKatas.Kata.map(r => {
                          if (r.id === oldData.id) {
                            return {
                              ...r, 
                              name: newData.name
                            };
                          } else {
                            return r;
                          }
                        });
                        cache.writeQuery({
                          query: GET_KATAS,
                          data: { Kata: newKatas }
                        })
                      }
                    });
                  }, 600);
                }),
              onRowDelete: oldData =>
                new Promise(resolve => {
                  setTimeout(() => {
                    resolve();
                    DeleteKata({
                      variables: { id: oldData.id },
                      update: (cache) => {
                        const existingKatas = cache.readQuery({ query: GET_KATAS });
                        const newKatas = existingKatas.Kata.filter(r => (r.id !== oldData.id));
                        cache.writeQuery({
                          query: GET_KATAS,
                          data: { Kata: newKatas }
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
    </div>
  );
}
