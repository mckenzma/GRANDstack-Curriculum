import React, { useState } from 'react';
import { useQuery, useMutation } from "@apollo/react-hooks";

import gql from "graphql-tag";
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

const GET_MOVE_STEPS = gql`
  query moveStepsQuery(
    $selectedMove: ID!
  ) {
    Move(
      filter: {
        id: $selectedMove
      }
    ) {
      id
      name
      orderedSteps {
        id
        name
        technique {
          id
          name
        }
      }
    }
  }
`;

const DELETE_STEP = gql`
  mutation DeleteStep($id: ID!)
  {
    DeleteStep(id: $id) {
      id
    }
  }
`;

const CONNECT_ADJACENT_STEPS = gql`
  mutation ConnectAdjacentSteps($prevStepID: ID!, $nextStepID: ID!)
  {
    ConnectAdjacentSteps(prevStepID: $prevStepID, nextStepID: $nextStepID)
    {
      id
    }
  }
`;

export default function DeleteStepDialog({ 
  openDelete, 
  setOpenDelete, 
  selectedStep, 
  setSelectedStep, 
  prevStep, 
  setPrevStep, 
  nextStep, 
  setNextStep,
  move
}) {

  const [step, setStep] = useState("");

  // console.log(selectedStep.technique);

  // console.log('prevStep: ', prevStep);
  // console.log('nextStep: ', nextStep);

  // console.log("step to delete: ", step);

  const handleCloseCancel = event => {
    setOpenDelete(false);
    setSelectedStep("");
    setPrevStep("");
            setNextStep("");
  };

  const handleCloseDelete = event => {
    new Promise(resolve => {
      setTimeout(() => {
        resolve();

        DeleteStep({
          variables: {
            id: selectedStep.id
          },
          update: (cache) => {
            const { Move } = cache.readQuery({ query: GET_MOVE_STEPS, variables: { selectedMove: move.id} });
            const existingSteps = Move[0].orderedSteps;
            let newSteps = existingSteps;
            console.log("newSteps: ", newSteps);

            if (prevStep !== "" && nextStep !== "") {
              console.log('Delete Between');
              var index = existingSteps.map(function(e) { return e.id; }).indexOf(selectedStep.prevId);
              // newSteps = existingSteps.slice(0,index).concat(existingSteps.slice(index+1));
              console.log(existingSteps.slice(0,index));
              newSteps.splice(index,1);

              ConnectAdjacentSteps({
                variables: {
                  prevStepID: prevStep,
                  nextStepID: nextStep
                },
                // update: (cache) => {

                // }
              });
            } else if (prevStep !== "" && nextStep === "") {
              newSteps.length = newSteps.length - 1;

            } else if (prevStep === "" && nextStep !== "") {
              newSteps.shift();
            } else {
              newSteps.length = newSteps.length - 1;
            }

            console.log("newSteps: ", newSteps);
            setPrevStep("");
            setNextStep("");

            cache.writeQuery({
              query: GET_MOVE_STEPS,
              variable: {
                selectedMove: move.id
              },
              data: { 
                Move: {
                  __typename: "Move",
                  id: move.id,
                  name: move.name,
                  orderedSteps: newSteps.map(step => {
                    // console.log("step: ", step);
                    return {
                      id: step.id,
                      name: step.name,
                      __typename: "Step",
                      technique: {
                        id: step.techniuque !== undefined ? step.technique.id : '',
                        name: step.technique !== undefined ? step.technique.name : '',
                        __typename: step.technique !== undefined ? step.technique.__typename : ''
                      }
                    }
                  })
                }
              }
            });
          }
        });
      }, 600);
    });

    setOpenDelete(false);
  };

  const [DeleteStep] = useMutation(DELETE_STEP);
  const [ConnectAdjacentSteps] = useMutation(CONNECT_ADJACENT_STEPS);

  return (
      <Dialog open={openDelete} onClose={handleCloseDelete} aria-labelledby="form-dialog-title">
        <DialogTitle id="form-dialog-title">Delete Step</DialogTitle>
        <DialogContent>
          <DialogContentText>
            {selectedStep.technique !== undefined ? selectedStep.technique.name : ""}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseCancel} color="primary">
            Cancel
          </Button>
          <Button onClick={handleCloseDelete} color="primary">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
  );
}
