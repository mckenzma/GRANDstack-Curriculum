import React, { useState } from "react";
import { useQuery, useMutation } from "@apollo/react-hooks";
import gql from "graphql-tag";
import { makeStyles } from "@material-ui/core/styles";
import MaterialTable from "material-table";
import Dialog from "@material-ui/core/Dialog";

import StepList from './StepList';

const GET_KATA_MOVES = gql`
  query kataMovesQuery(
    $selectedKata: ID!
  ) {
    Kata(
      filter: {
        id: $selectedKata
      }
    ) {
      id
      name
      numMoves
      orderedMoves {
        id
        name
        #__typename
        orderedSteps {
          id
          name
          #__typename
          technique {
            id
            name
            #__typename
          }
          #block {
          #  id
          #  name
          #}
          #strike {
          #  id
          #  name
          #}
          #kick {
          #  id
          #  name
          #}
          #movement {
          #  id
          #  name
          #}
          #turn {
          #  id
          #  name
          #}
          #stance {
          #  id
          #  name
          #}
        }
      }
    }
  }
`;

const CREATE_MOVE = gql`
  mutation CreateMove($name: String!) {
    CreateMove(name: $name)
    {
      id
      name
    }
  }
`;

const CONNECT_MOVE_TO_KATA = gql`
  mutation ConnectMoveToKata($fromKataID: ID!, $toMoveID: ID!)
  {
    id
    name
  }
`;

const INSERT_MOVE_BETWEEN = gql`
  mutation InsertMoveBetween($prevMoveID: ID!, $newMoveID: ID!, $nextMoveID: ID!)
  {
    InsertMoveBetween(prevMoveID: $prevMoveID, newMoveID: $newMoveID, nextMoveID: $nextMoveID)
    {
      id
      name
    }
  }
`;

const INSERT_MOVE_NEXT_TO = gql`
  mutation InsertMoveNextTo($prevMoveID: ID!, $nextMoveID: ID!)
  {
    InsertMoveNextTo(prevMoveID: $prevMoveID, nextMoveID: $nextMoveID)
    {
      id
      Name
    }
  }
`;

const DELETE_MOVE = gql`
  mutation DeleteMove($id: ID!)
  {
    DeleteMove(id: $id)
    {
      id
    }
  }
`;

// const DELETE_MOVE_STEPS = gql``;

const CONNECT_ADJACENT_MOVE = gql`
  mutation ConnectAdjacentMoves($prevMoveID: ID!, $nextMoveID: ID!)
  {
    ConnectAdjacentMoves(prevMoveID: $prevMoveID, nextMoveID: $nextMoveID)
    {
      id
    }
  }
`;


export default function KataDialog({open, setOpen, selectedKata, setSelectedKata}) {

  const [selectedMove, setSelectedMove] = useState("");
  const [prevMove, setPrevMove] = useState("");
  const [nextMove, setNextMove] = useState('');

  const handleClose = event => {
    setOpen(false);
    setSelectedKata("");
  };



  const [state, setState] = React.useState({
    columns: [
      { title: 'Name', field: 'name' },
      { title: 'Move Number', field: 'index', type: 'numeric' },
      // { title: 'Steps', field: 'stepsString'}
      { title: 'Steps', field: 'stepTechniqueString'}
    ],
  });
  // console.log(selectedKata);

  const { loading, error, data } = useQuery(GET_KATA_MOVES, {
    variables: {
      selectedKata
    }
  });

  // const [CreateKata] = useMutation(CREATE_KATA);
  // const [MergeKataRanks] = useMutation(MERGE_KATA_RANKS_RELS);

  // const [UpdateKata] = useMutation(UPDATE_KATA);

  // const [DeleteKata] = useMutation(DELETE_KATA);

  

  if (loading) return "Loading...";
  if (error) return `Error ${error.message}`;




  return (
    <div>
    {data.Kata.map(kata => {
      return (
      <Dialog
        key={kata.id}
        fullWidth={true}
        maxWidth={'xl'}
        onClose={handleClose}
        aria-labelledby="customized-dialog-title"
        open={open}
      >
        {/*<DialogTitle id="customized-dialog-title" onClose={handleClose}>
          Kata Name
        </DialogTitle>*/}
        {/*<DialogContent>*/}

        <MaterialTable
            title={kata.name}
            columns={state.columns}
            data={
              //data.Kata/*.sort(getSorting(order,orderBy))*/.map(s => {
                // console.log(s);
                // return {
                //   ...s,
                //   movesString: s.moves.sort(getSorting("asc","rankOrder")).map(r => { return r.name }).flat(2).join(', ')
                // }
                kata.orderedMoves.map((m, index) => {
                return {
                  id: m.id,
                  name: m.name,
                  index: index + 1, 
                  steps: m.orderedSteps,
                  stepsString: m.orderedSteps/*.sort(getSorting("asc","rankOrder"))*/.map(r => { return r.name }).flat(2).join(', '),
                  stepTechniqueString: m.orderedSteps.map(r => {
                    return (r.technique !== null ? r.technique.name : '')
                  }).flat(2).join(', ')
                }
              })
            }
            options={{
              pageSize: 20,
              // pageSizeOptions: [5, 10, 20, 30 ,50, 75, 100 ],
              sorting: false,
              addRowPosition: 'first',
            }}
            detailPanel={rowData => {
              // console.log(rowData.tableData.showDetailPanel);
              return (
                <StepList /*kata={kata}*/ move={rowData}/>
              )
            }}
          // }
            // onRowClick={(event, rowData, togglePanel) => togglePanel()}
            
            editable={{
              onRowAdd: newData =>
                new Promise(resolve => {
                  setTimeout(() => {
                    resolve();
                    // console.log("create move");
                    // console.log("add move to array of moves");



                    // CreateKata({
                    //   variables: {
                    //     name: newData.name
                    //   },
                    //   update: (cache, { data: { CreateKata } }) => {
                    //     const { Kata } = cache.readQuery({ query: GET_KATA_MOVES });
                    //     cache.writeQuery({
                    //       query: GET_KATA_MOVES,
                    //       data: { Kata: Kata.concat([CreateKata]) },
                    //     })
                    //   }
                    // });
                  }, 600);
                }),
              onRowUpdate: (newData, oldData) => 
                new Promise(resolve => {
                  setTimeout(() => {
                    resolve();

            //         UpdateKata({
            //           variables: { 
            //             // id: oldData.id,
            //             id: newData.id,
            //             // name: name, 
            //             name: newData.name,
            //           },
            //           update: (cache) => {
            //             const existingKatas = cache.readQuery({ query: GET_KATA_MOVES });
            //             const newKatas = existingKatas.Kata.map(r => {
            //               if (r.id === oldData.id) {
            //                 return {
            //                   ...r, 
            //                   name: newData.name
            //                 };
            //               } else {
            //                 return r;
            //               }
            //             });
            //             cache.writeQuery({
            //               query: GET_KATA_MOVES,
            //               data: { Kata: newKatas }
            //             })
            //           }
            //         });
                  }, 600);
                }),
              onRowDelete: oldData =>
                new Promise(resolve => {
                  setTimeout(() => {
                    resolve();
            //         DeleteKata({
            //           variables: { id: oldData.id },
            //           update: (cache) => {
            //             const existingKatas = cache.readQuery({ query: GET_KATA_MOVES });
            //             const newKatas = existingKatas.Kata.filter(r => (r.id !== oldData.id));
            //             cache.writeQuery({
            //               query: GET_KATA_MOVES,
            //               data: { Kata: newKatas }
            //             });
            //           }
            //         });
                  }, 600);
                }),
            }}

          />


          {/*<Typography gutterBottom>
            This should be a table or list of moves to create steps and connect to techniques
          </Typography>*/}
        {/*</DialogContent>*/}
      </Dialog>
      );
      })}
    </div>
  );
}
