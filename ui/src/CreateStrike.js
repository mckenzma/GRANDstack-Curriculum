import React, { useState } from "react";
import { useMutation } from "@apollo/react-hooks";
import gql from "graphql-tag";
import { makeStyles } from "@material-ui/core/styles";

import Paper from "@material-ui/core/Paper";
// import Typography from "@material-ui/core/Typography";

import Stepper from "@material-ui/core/Stepper";
import Step from "@material-ui/core/Step";
import StepLabel from "@material-ui/core/StepLabel";
import StepContent from "@material-ui/core/StepContent";
import Button from "@material-ui/core/Button";

import CreateStrikeTextField from "./CreateStrikeTextField";

// import Grid from "@material-ui/core/Grid";

const useStyles = makeStyles(theme => ({
  root: {
    width: "100%",
    flexGrow: 1
  },
  button: {
    marginTop: theme.spacing(1),
    marginRight: theme.spacing(1)
  },
  actionsContainer: {
    marginBottom: theme.spacing(2)
  },
  resetContainer: {
    padding: theme.spacing(3)
  },
  container: {
    display: "flex",
    flexWrap: "wrap"
  }
}));

const CREATE_STRIKE = gql`
  mutation CreateStrike($name: String!) {
    CreateStrike(name: $name) {
      name
    }
  }
`;

export default function CreateStrike() {
  const classes = useStyles();

  const [name, setName] = useState("");

  // let input;
  const [CreateStrike, { data }] = useMutation(CREATE_STRIKE);


  const handleReset = () => {
    // setRank("");
    setName("");
  };

  return (
    <Paper className={classes.root} elevation={1}>
    {/*<Typography /*variant="headline"* component="h3">
        Registration
      </Typography>*/}
      <div className={classes.root} /*justifyContent="flex-start"*/>
            <form className={classes.container} noValidate autoComplete="off">
              <CreateStrikeTextField
                name={name}
                setName={setName}
              />
            </form>
          </div>
      
        <Paper square elevation={1} className={classes.resetContainer}>
          <Button
            onClick={e => {
              CreateStrike({
                variables: { name: name }
              });
            }}
            className={classes.button}
            color="primary"
            variant="contained"
          >
            Submit
          </Button>
        </Paper>
    </Paper>
  );
}
