import React, { useState } from 'react';

import { useQuery, useMutation } from "@apollo/react-hooks";

import gql from "graphql-tag";

import { makeStyles } from '@material-ui/core/styles';
// import GridList from '@material-ui/core/GridList';
// import GridListTile from '@material-ui/core/GridListTile';
// import GridListTileBar from '@material-ui/core/GridListTileBar';
// import IconButton from '@material-ui/core/IconButton';
// import StarBorderIcon from '@material-ui/icons/StarBorder';
// import tileData from './tileData';

import Icon from '@material-ui/core/Icon';
import EditIcon from '@material-ui/icons/Edit';
import DeleteOutlineIcon from '@material-ui/icons/DeleteOutline';

import Button from '@material-ui/core/Button';

import Card from '@material-ui/core/Card';
// import CardActionArea from '@material-ui/core/CardActionArea';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';

import CreateStepDialog from './CreateStepDialog';
import UpdateStepDialog from './UpdateStepDialog';
import DeleteStepDialog from './DeleteStepDialog';

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
`;


const useStyles = makeStyles((theme) => ({
  root: {
    // minWidth: 275,
    display: 'flex',
    // flexWrap: 'wrap',
    // overflow: 'hidden',
    // 'overflow-x': 'hidden'
  },
  container: {
    // width: '100%',
    overflowX: 'hidden',
    // maxHeight: 250,
    flexWrap: 'nowrap'
  },
  bullet: {
    display: 'inline-block',
    margin: '0 2px',
    transform: 'scale(0.8)',
  },
  title: {
    fontSize: 14,
  },
  pos: {
    marginBottom: 12,
  },
}));
 
export default function StepList({/*kata,*/move}) {
  const classes = useStyles();

  const [selectedStep, setSelectedStep] = useState("");
  const [_type, _setType] = useState("");
  const [_technique, _setTechnique] = useState("");
  
  const [prevStep, setPrevStep] = useState("");
  const [nextStep, setNextStep] = useState("");

  // console.log("move: ", move);

  const [openCreate, setOpenCreate] = useState(false);
  const [openUpdate, setOpenUpdate] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);

  const handleClickOpenCreate = (move,step) => {
    // console.log("step: ", step);
    setSelectedStep(step);
    setOpenCreate(true);
  };

  const handleClickOpenUpdate = (move,step,type,technique) => {
    console.log(type,technique);
    setSelectedStep(step);
    _setType(type);
    _setTechnique(technique);
    setOpenUpdate(true);
  };

  const handleClickOpenDelete = (step,index,prev,next) => {
    // console.log("step: ", step);
    // console.log("prev: ", prev);
    // console.log("next: ", next);
    // console.log("index: ", index);
    setSelectedStep(step);
    setPrevStep(prev !== undefined ? prev.id : "");
    setNextStep(next !== undefined ? next.id : "");
    setOpenDelete(true);
  };

  const { loading, error, data } = useQuery(GET_MOVE_STEPS, {
    variables: {
      selectedMove: move.id
    }
  });

  // console.log("data: ", data);

  if (loading) return "Loading...";
  if (error) return `Error ${error.message}`;

  return (
    // <div className={classes.root}>
    <Grid className={classes.container} container spacing={1} alignItems="center" /*flexWrap="nowrap"*/ /*display="flex"*/ /*overflow="hidden"*/ /*maxHeight={250}*/ /*width="100%"*/ /*overflowX="auto"*/>
      <CreateStepDialog selectedStep={selectedStep} setSelectedStep={setSelectedStep} openCreate={openCreate} setOpenCreate={setOpenCreate} move={move}/>      
      <UpdateStepDialog 
        selectedStep={selectedStep} 
        setSelectedStep={setSelectedStep} 
        openUpdate={openUpdate} 
        setOpenUpdate={setOpenUpdate} 
        move={move} 
        _type={_type} 
        _setType={_setType}
        _technique={_technique}
        _setTechnique={_setTechnique}
      />      
      <DeleteStepDialog selectedStep={selectedStep} setSelectedStep={setSelectedStep} openDelete={openDelete} setOpenDelete={setOpenDelete} prevStep={prevStep} setPrevStep={setPrevStep} nextStep={nextStep} setNextStep={setNextStep} move={move}/>      
      {data.Move.map(move => {
        return (
          <React.Fragment key={0}>
            {move.orderedSteps.length === 0 &&
              <Grid item key={0}>
                <Button onClick={() => handleClickOpenCreate(move,{prevId: "", type: "icon", id: 0, nextId: ""})}><Icon fontSize="large">add_circle</Icon></Button>
              </Grid>
            }

            {move.orderedSteps.length !== 0 &&
              move.orderedSteps.map((step,index) => {
              return (
                <React.Fragment key={index}>
                  <Grid item key={2*index}/*display="inline"*/>
                    <Button onClick={
                      () => handleClickOpenCreate(
                          move,
                          {
                            prevId: move.orderedSteps[index-1] !== undefined ? move.orderedSteps[index-1].id : "", 
                            type: "icon", 
                            id: 2*index, 
                            nextId: step.id
                          }
                        )
                      }><Icon fontSize="large">add_circle</Icon>
                    </Button>
                  </Grid>
                  <Grid item key={2*index+1}/*display="inline"*/>
                    <Card>
                      <CardContent>
                        <Typography className={classes.title} color="textSecondary" gutterBottom>
                          Step {index+1}
                        </Typography>
                        <Typography variant="h5" component="h2">
                          {/* TODO - simplify once I can use a shared label */}
                          {step.technique !== null && step.technique.name}
                          {step.technique === null && "Select Move"}
                          {/*step.block !== null && step.block.name}
                          {step.strike !== null && step.strike.name}
                          {step.kick !== null && step.kick.name}
                          {step.turn !== null && step.turn.name}
                          {step.movement !== null && step.movement.name}
                          {step.stance !== null && step.stance.name}
                          {(step.block === null 
                            && step.strike === null 
                            && step.kick === null 
                            && step.turn === null
                            && step.movement === null
                            && step.stance === null) && "Select Move"*/}
                        </Typography>
                      </CardContent>
                      <CardActions>
                        <Button color="primary" onClick={
                          () =>handleClickOpenUpdate(
                            move,
                            step,
                            step.technique.__typename,
                            step.technique.id
                          )
                        }>
                          <EditIcon />
                        </Button>
                        <Button color="primary" onClick={() => handleClickOpenDelete(step,index,move.orderedSteps[index-1],move.orderedSteps[index+1])}>
                          <DeleteOutlineIcon />
                        </Button>
                      </CardActions>
                    </Card>

                  </Grid>
                  {index === move.orderedSteps.length-1 &&
                    <Grid item key={2*index+2}/*display="inline"*/>
                      <Button onClick={
                        () => handleClickOpenCreate(
                            move,
                            {
                              prevId: step.id, 
                              type: "icon", 
                              id: 2*index+2, 
                              nextId: ""
                            }
                          )
                      }><Icon fontSize="large">add_circle</Icon></Button>
                    </Grid>
                  }
                </React.Fragment>
              )
            })}
          </React.Fragment>
        );
      })}
      {/*arr.map((step,index) => {

        return (
          <Grid item key={index}/*display="inline"* / >
            {step.type === "icon" &&
              <Button onClick={() => handleClickOpenCreate(move,step)}><Icon fontSize="large">add_circle</Icon></Button>
            }

            {step.type !== "icon" &&
              <Card>
                <CardContent>
                  <Typography className={classes.title} color="textSecondary" gutterBottom>
                    Step {(index + 1)/2}
                  </Typography>
                  <Typography variant="h5" component="h2">
                    {/* TODO - simplify once I can use a shared label * /}
                    {step.block !== null && step.block.name}
                    {step.strike !== null && step.strike.name}
                    {step.kick !== null && step.kick.name}
                    {step.turn !== null && step.turn.name}
                    {step.movement !== null && step.movement.name}
                    {step.stance !== null && step.stance.name}
                    {(step.block === null 
                      && step.strike === null 
                      && step.kick === null 
                      && step.turn === null
                      && step.movement === null
                      && step.stance === null) && "Select Move"}
                  </Typography>
                </CardContent>
                <CardActions>
                  <Button color="primary" onClick={handleClickOpenUpdate}>
                    <EditIcon />
                  </Button>
                  <Button color="primary" onClick={() => handleClickOpenDelete(step,index)}>
                    <DeleteOutlineIcon />
                  </Button>
                </CardActions>
              </Card>
            }

          </Grid>
        )

      })*/}
    </Grid>
    // </div>
  );
}