import React, {useState} from 'react';

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

const CREATE_STEP = gql`
  mutation CreateStep($name: String!) {
    CreateStep(name: $name)
    {
      id
      name
    }
  }
`;

const CONNECT_MOVE_TO_STEP = gql`
  mutation ConnectMoveToStep($fromMoveID: ID!, $toStepID: ID!)
  {
    ConnectMoveToStep(fromMoveID: $fromMoveID, toStepID: $toStepID)
    {
      id
      name
    }
  }
`;

const CONNECT_STEP_TO_TECHNIQUE = gql`
  mutation ConnectStepToTechnique($fromStepID: ID!, $toTechniqueID: ID!) {
    ConnectStepToTechnique(fromStepID: $fromStepID, toTechniqueID: $toTechniqueID) 
    {
      id
      name
    }
  }
`;

const INSERT_STEP_BETWEEN = gql`
  mutation InsertStepBetween($prevStepID: ID!, $newStepID: ID!, $nextStepID: ID!) 
  {
    InsertStepBetween(prevStepID: $prevStepID, newStepID: $newStepID, nextStepID: $nextStepID) {
      id
      name
    }
  }
`;

const INSERT_STEP_NEXT_TO = gql`
  mutation InsertStepNextTo($prevStepID: ID!, $nextStepID: ID!) 
  {
    InsertStepNextTo(prevStepID: $prevStepID, nextStepID: $nextStepID) 
    {
      id
      name
    }
  }
`;

export default function CreateStepDialog({
  openCreate,
  setOpenCreate, 
  selectedStep, 
  setSelectedStep, 
  move
}) {

  const [_type, _setType] = useState("");
  const [_technique, _setTechnique] = useState ("");

  const handleCancel = event => {
    setOpenCreate(false);
    setSelectedStep("");
    _setType("");
    _setTechnique("");
  };

  const handleCreate = event => {

    new Promise(resolve => {
      setTimeout(() => {
        resolve();

        CreateStep({
          variables: {
            name: "New Step"
          },
          update: (cache, { data: { CreateStep } }) => {
            const { Move } = cache.readQuery({ query: GET_MOVE_STEPS, variables: { selectedMove: move.id} });
            const existingSteps = Move[0].orderedSteps;
            let newSteps = existingSteps;
            // console.log('newSteps: ', newSteps);

            // Connect Step to Move
            ConnectMoveToStep({
              variables: {
                fromMoveID: move.id,
                toStepID: CreateStep.id
              }
            });

            ConnectStepToTechnique({
              variables: {
                fromStepID: CreateStep.id,
                toTechniqueID: _technique
              },
              update: (cache, { data: { ConnectStepToTechnique } }) => {
                // console.log("ConnectStepToTechnique:", ConnectStepToTechnique);
                CreateStep.technique = ConnectStepToTechnique;
                // console.log("CreateStep: ", CreateStep);
                if (selectedStep.prevId === "" && selectedStep.nextId === ""){
                  // console.log("do nothing");
                  newSteps = newSteps.concat([CreateStep]);
                }
                if (selectedStep.prevId !== "" && selectedStep.nextId !== ""){
                  // console.log("insert between");
                  // Insert Step Between
                  var index = existingSteps.map(function(e) { return e.id; }).indexOf(selectedStep.prevId);
                  // console.log(existingSteps);
                  // console.log(index);
                  // if(index+1 === newSteps.length - 1){
                  //   newSteps[index+2] = newSteps[index+1];
                  // }
                  // newSteps[index+1] = CreateStep;
                  newSteps.splice(index+1,0,CreateStep);

                  InsertStepBetween({
                    variables: {
                      prevStepID: selectedStep.prevId,
                      newStepID: CreateStep.id, 
                      nextStepID: selectedStep.nextId
                    }
                  })
                }
                if (selectedStep.prevId !== "" && selectedStep.nextId === ""){
                  // console.log("insert next to (after)");
                  // Insert Step Next To
                  newSteps.push(CreateStep);
                  // newSteps = newSteps.concat([CreateStep]);
                  InsertStepNextTo({
                    variables: {
                      prevStepID: selectedStep.prevId, 
                      nextStepID: CreateStep.id
                    }
                  });
                  
                }
                if (selectedStep.prevId === "" && selectedStep.nextId !== ""){
                  // console.log("insert next to (before)");
                  // Insert Step Next To
                  newSteps.unshift(CreateStep);
                  InsertStepNextTo({
                    variables: {
                      prevStepID: CreateStep.id, 
                      nextStepID: selectedStep.nextId
                    }
                  });
                }

                // console.log('newSteps: ', newSteps);

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
                      // orderedSteps: _steps.map(step => {
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
          }
        });
      }, 600);
    });

    _setTechnique("");
    setSelectedStep("");
    setOpenCreate(false);
  };

  const [name, setName] = useState("test name");

  const [CreateStep] = useMutation(CREATE_STEP);
  const [ConnectMoveToStep] = useMutation(CONNECT_MOVE_TO_STEP);
  const [ConnectStepToTechnique] = useMutation(CONNECT_STEP_TO_TECHNIQUE);
  const [InsertStepBetween] = useMutation(INSERT_STEP_BETWEEN);
  const [InsertStepNextTo] = useMutation(INSERT_STEP_NEXT_TO);

  return (
      <Dialog open={openCreate} /*onClose={handleCloseCreate}*/ aria-labelledby="form-dialog-title">
        <DialogTitle id="form-dialog-title">Create Step</DialogTitle>
        <DialogContent>

          <SelectType _type={_type} _setType={_setType} />
          <SelectTechnique type={_type} _technique={_technique} _setTechnique={_setTechnique} />

        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancel} color="primary">
            Cancel
          </Button>
          <Button 
            onClick={handleCreate} 
            color="primary"
            disabled={ _technique === "" ? true : false }
          >
            Create
          </Button>
        </DialogActions>
      </Dialog>
  );
}
