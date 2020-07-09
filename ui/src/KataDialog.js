import React, { useState } from "react";
import { withStyles } from "@material-ui/core/styles";

import { useQuery, useMutation } from "@apollo/react-hooks";

import gql from "graphql-tag";

// Material UI components
import Dialog from "@material-ui/core/Dialog";
import MuiDialogTitle from "@material-ui/core/DialogTitle";
import MuiDialogContent from "@material-ui/core/DialogContent";
import IconButton from "@material-ui/core/IconButton";
import CloseIcon from "@material-ui/icons/Close";
import Typography from "@material-ui/core/Typography";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";

import MaterialTable from 'material-table';

import SingleLineGridList from './StepList';

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
      orderedMoves {
        id
        name
        orderedSteps {
          id
          name
        }
      }
    }
  }
`;

// const CREATE_MOVE = gql``;

// const CREATE_KATA = gql``;

// const UPDATE_KATA = gql``;

// const DELETE_KATA = gql``;

// const MERGE_KATA_RANK_REL = gql``;

// const MERGE_KATA_RANKS_RELS = gql``;



const DialogTitle = withStyles(theme => ({
  root: {
    borderBottom: `1px solid ${theme.palette.divider}`,
    margin: 0,
    padding: theme.spacing(2)
  },
  closeButton: {
    position: "absolute",
    right: theme.spacing(1),
    top: theme.spacing(1),
    color: theme.palette.grey[500]
  }
}))(props => {
  const { children, classes, onClose } = props;
  return (
    <MuiDialogTitle disableTypography className={classes.root}>
      <Typography>{children}</Typography>
      {onClose ? (
        <IconButton
          aria-label="Close"
          className={classes.closeButton}
          onClick={onClose}
        >
          <CloseIcon />
        </IconButton>
      ) : null}
    </MuiDialogTitle>
  );
});

const DialogContent = withStyles(theme => ({
  root: {
    margin: 0,
    padding: theme.spacing(2)
  }
}))(MuiDialogContent);

export default function KataDialog({open, setOpen, selectedKata, setSelectedKata}) {
  // const [open, setOpen] = useState(false);

  // const handleClickOpen = event => {
  //   setOpen(true);
  // };

  // console.log(selectedKata);

  const handleClose = event => {
    setOpen(false);
    setSelectedKata("");
  };

  const [state, setState] = React.useState({
    columns: [
      { title: 'Name', field: 'name' },
      { title: 'Steps', field: 'stepsString'}
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

  // console.log("kata data: ", data.Kata);

  return (
    <div>
    {data.Kata.map(kata => {
      return (
      <Dialog
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
                kata.orderedMoves.map(m => {
                return {
                  
                    // console.log(m);
                    // return {
                      // ...m
                      name: m.name,
                      steps: m.orderedSteps,
                      stepsString: m.orderedSteps/*.sort(getSorting("asc","rankOrder"))*/.map(r => { return r.name }).flat(2).join(', ')

                    // }
                  
                }

              })
            }
            detailPanel={rowData => {
              console.log(rowData);
              return (
                // <div>
                //   row data
                // </div>
                <SingleLineGridList move={rowData}/>
              )
            }}
          // }
            onRowClick={(event, rowData, togglePanel) => togglePanel()}
            
            // editable={{
            //   onRowAdd: newData =>
            //     new Promise(resolve => {
            //       setTimeout(() => {
            //         resolve();
            //         CreateKata({
            //           variables: {
            //             name: newData.name
            //           },
            //           update: (cache, { data: { CreateKata } }) => {
            //             const { Kata } = cache.readQuery({ query: GET_KATA_MOVES });
            //             cache.writeQuery({
            //               query: GET_KATA_MOVES,
            //               data: { Kata: Kata.concat([CreateKata]) },
            //             })
            //           }
            //         });
            //       }, 600);
            //     }),
            //   onRowUpdate: (newData, oldData) => 
            //     new Promise(resolve => {
            //       setTimeout(() => {
            //         resolve();
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
            //       }, 600);
            //     }),
            //   onRowDelete: oldData =>
            //     new Promise(resolve => {
            //       setTimeout(() => {
            //         resolve();
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
            //       }, 600);
            //     }),
            // }}

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
