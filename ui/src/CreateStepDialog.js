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
  };

  // console.log("_technique: ", _technique);
  // console.log("selectedStep :", selectedStep);
  // console.log("move: ", move);

  const handleCreate = event => {

    console.log("selectedStep: ", selectedStep);
    console.log("prevId: ", selectedStep.prevId);
    console.log("nextId: ", selectedStep.nextId);

    new Promise(resolve => {
      setTimeout(() => {
        resolve();

          CreateStep({
            variables: {
              name: "New Step"
            },
            update: (cache, { data: { CreateStep } }) => {
              // const { Step } = cache.readQuery({ query: GET_STEPS });

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
                }
              });

              if (selectedStep.prevId === "" && selectedStep.nextId === ""){
                // console.log("do nothing");
              }
              if (selectedStep.prevId !== "" && selectedStep.nextId !== ""){
                // console.log("insert between");
                // Insert Step Between
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
                InsertStepNextTo({
                  variables: {
                    prevStepID: CreateStep.id, 
                    nextStepID: selectedStep.nextId
                  }
                });
              }

            }
          });
      }, 600);
    });
    
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
    <div>
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
    </div>
  );
}
