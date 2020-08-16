import React, { useState } from "react";
import { useMutation } from "@apollo/react-hooks";
import gql from "graphql-tag";
import { makeStyles } from "@material-ui/core/styles";

import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";

import Button from "@material-ui/core/Button";

import CreateMovementTextField from "./CreateMovementTextField";

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

const CREATE_MOVEMENT = gql`
  mutation CreateMovement($name: String!) {
    CreateMovement(name: $name) {
      name
    }
  }
`;

export default function CreateMovement({ data, GET_MOVEMENTS }) {
  const classes = useStyles();

  const [name, setName] = useState("");

  const [CreateMovement] = useMutation(
    CREATE_MOVEMENT,
    {
      update(cache, { data: { CreateMovement } }) {
        const { Movement } = cache.readQuery({ query: GET_MOVEMENTS });
        cache.writeQuery({
          query: GET_MOVEMENTS,
          data: { Movement: Movement.concat([CreateMovement]) },
        })
      }
    }
  );

  const handleReset = () => {
    setName("");
  };

  return (
    <div className={classes.root} /*justifyContent="flex-start"*/>
      <form className={classes.container} noValidate autoComplete="off">
        <CreateMovementTextField
          name={name}
          setName={setName}
        />
      </form>
        
      <Button
        onClick={e => {
          CreateMovement({
            variables: { name: name }
          });
        }}
        className={classes.button}
        color="primary"
        variant="contained"
      >
        Submit
      </Button>
    </div>
  );
}
