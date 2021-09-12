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

import SelectType from './SelectType';
import SelectTechnique from './SelectTechnique';

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

const UPDATE_STEP_TECHNIQUE = gql`
  mutation UpdateStepTechnique($stepID: ID!, $techID: ID!)
  {
    UpdateStepTechnique(stepID: $stepID, techID: $techID)
    {
      id
      name
    }
  }
`;



export default function UpdateStepDialog({
  openUpdate,
  setOpenUpdate,
  selectedStep,
  setSelectedStep,
  move,
  _type,
  _setType,
  _technique,
  _setTechnique
}) {

  // TODO only update if selected a new technique

  // console.log(selectedStep);
  // console.log(_type);
  // console.log(_technique);
  
  // const [_type, _setType] = useState(selectedStep.technique !== undefined ? selectedStep.technique.__typename : '');
  // const [_technique, _setTechnique] = useState();

  const handleCancelUpdate = event => {
    setOpenUpdate(false);
    setSelectedStep("");
    _setType("");
    _setTechnique("");
  };

  const handleCloseUpdate = event => {
    // console.log("update step");

    new Promise(resolve => {
      setTimeout(() => {
        resolve();

        // console.log(selectedStep.id, _technique);

        UpdateStepTechnique({
          variables: {
            stepID: selectedStep.id,
            techID: _technique
          },
          update: (cache, { data: { UpdateStepTechnique } }) => {
            // console.log(cache);
            // console.log(UpdateStepTechnique);
            const { Move } = cache.readQuery({ query: GET_MOVE_STEPS, variables: { selectedMove: move.id} });
            // console.log(Move);

            cache.writeQuery({
              query: GET_MOVE_STEPS,
              variables: {
                selectedMove: move.id
              },
              data: {
                Move: {
                  __typename: "Move",
                  id: move.id,
                  name: move.name,
                  orderedSteps: Move[0].orderedSteps.map(step => {
                    // console.log(step, selectedStep);
                    return {
                      id: step.id,
                      name: step.name,
                      __typename: "Step",
                      technique: {
                        id: step.id === selectedStep.id ? UpdateStepTechnique.id : step.technique.id,
                        name: step.id === selectedStep.id ? UpdateStepTechnique.name : step.technique.name,
                        __typename: step === selectedStep.id ? UpdateStepTechnique.__typename : step.technique.__typename
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


    setOpenUpdate(false);
  };

  const [UpdateStepTechnique] = useMutation(UPDATE_STEP_TECHNIQUE);

  return (
      <Dialog open={openUpdate} onClose={handleCloseUpdate} aria-labelledby="form-dialog-title">
        <DialogTitle id="form-dialog-title">Update Step</DialogTitle>
        <DialogContent>

          {/*<SelectType _type={_type} _setType={_setType} />*/}
          <SelectType value={_type} onChange={_setType} />
          <SelectTechnique type={_type} _technique={_technique} _setTechnique={_setTechnique} />

        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancelUpdate} color="primary">
            Cancel
          </Button>
          <Button onClick={handleCloseUpdate} color="primary" /*disabled={ _technique === "" ? true : false }*/>
            Update
          </Button>
        </DialogActions>
      </Dialog>
  );
}
