import React, { useState } from "react";
import { useMutation } from "@apollo/react-hooks";
import gql from "graphql-tag";
import { makeStyles } from "@material-ui/core/styles";

import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";

import Button from "@material-ui/core/Button";

import CreateTurnTextField from "./CreateTurnTextField";

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

const CREATE_TURN = gql`
  mutation CreateTurn($name: String!) {
    CreateTurn(name: $name) {
      name
    }
  }
`;

export default function CreateTurn({ data, GET_TURNS }) {
  const classes = useStyles();

  const [name, setName] = useState("");

  const [CreateTurn] = useMutation(
    CREATE_TURN,
    {
      update(cache, { data: { CreateTurn } }) {
        const { Turn } = cache.readQuery({ query: GET_TURNS });
        cache.writeQuery({
          query: GET_TURNS,
          data: { Turn: Turn.concat([CreateTurn]) },
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
        <CreateTurnTextField
          name={name}
          setName={setName}
        />
      </form>
        
      <Button
        onClick={e => {
          CreateTurn({
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
