import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import GridList from '@material-ui/core/GridList';
import GridListTile from '@material-ui/core/GridListTile';
import GridListTileBar from '@material-ui/core/GridListTileBar';
import IconButton from '@material-ui/core/IconButton';
import StarBorderIcon from '@material-ui/icons/StarBorder';
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

const useStyles = makeStyles((theme) => ({
  root: {
    // minWidth: 275,
    display: 'flex',
    // flexWrap: 'wrap',
    // overflow: 'hidden',
    // 'overflow-x': 'hidden'
  },
  container: {
    overflowX: 'auto',
    maxHeight: 250
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
 
export default function SingleLineGridList({move}) {
  const classes = useStyles();

  const [stepsSize, setStepsSize] = useState(move.steps.length);

  console.log(move);
  console.log(move.steps);

  var arr = new Array(2*(move.steps.length) + 1);
  console.log(arr);
  for (var i = 0; i<move.steps.length;i++){
      console.log(i, 2*(i+1)-1, 2*(i+1));
      arr[2*(i+1)-1] = move.steps[i];
  }

  for (var i = 0; i<arr.length; i=i+2){
    arr[i] = {type: "icon"};
    if (arr[i-1] !== undefined) {
      arr[i].prevId = arr[i-1].id; 
    } else {
      arr[i].prevId = "";
    }
    if (arr[i+1] !== undefined) {
      arr[i].nextId = arr[i+1].id; 
    } else {
      arr[i].nextId = "";
    }
  }

  console.log(arr);

  return (
    <div className={classes.root}>
          <Grid className={classes.container} container spacing={1} alignItems="center" /*flexWrap="nowrap"*/ display="flex" /*overflow="hidden"*/ maxHeight={250} width="100%" overflowX="auto">
                
        {arr.map((step,index) => {
          console.log(stepsSize, index, step);

          return (
            <Grid item display="inline">
              {step.type === "icon" &&
                <Button><Icon fontSize="large">add_circle</Icon></Button>
              }

              {step.type !== "icon" &&
                <Card>
                  <CardContent>
                    <Typography className={classes.title} color="textSecondary" gutterBottom>
                      {step.name}
                    </Typography>
                    <Typography variant="h5" component="h2">
                      blah blah
                    </Typography>
                    <Typography className={classes.pos} color="textSecondary">
                      adjective
                    </Typography>
                    <Typography variant="body2" component="p">
                      well meaning and kindly.
                      <br />
                      {'"a benevolent smile"'}
                    </Typography>
                  </CardContent>
                  <CardActions>
                    <Button color="primary">
                      <EditIcon />
                    </Button>
                    <Button color="primary">
                      <DeleteOutlineIcon />
                    </Button>
                  </CardActions>
                </Card>
              }

            </Grid>
          )

        })}
      </Grid>
    </div>
  );
}