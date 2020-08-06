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
  setNextStep 
}) {

  const [step, setStep] = useState("");

  // console.log("step to delete: ", step);

  const handleCloseDelete = event => {
    new Promise(resolve => {
      setTimeout(() => {
        resolve();

        DeleteStep({
          variables: {
            id: selectedStep.id
          },
          // update: (cache) => {

          //   // Connect Adjacenet Steps
          // }
        });

        if (prevStep !== "" && nextStep !== "") {
          ConnectAdjacentSteps({
            variables: {
              prevStepID: prevStep,
              nextStepID: nextStep
            },
            // update: (cache) => {

            // }
          });
        }
      }, 600);
    });

    setOpenDelete(false);
  };

  const [DeleteStep] = useMutation(DELETE_STEP);
  const [ConnectAdjacentSteps] = useMutation(CONNECT_ADJACENT_STEPS);

  return (
    <div>
      <Dialog open={openDelete} onClose={handleCloseDelete} aria-labelledby="form-dialog-title">
        <DialogTitle id="form-dialog-title">Delete Step</DialogTitle>
        <DialogContent>
          <DialogContentText>
            {selectedStep.name}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDelete} color="primary">
            Cancel
          </Button>
          <Button onClick={handleCloseDelete} color="primary">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
