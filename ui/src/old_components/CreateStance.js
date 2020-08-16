import React, { useState } from "react";
import { useMutation } from "@apollo/react-hooks";
import gql from "graphql-tag";
import { makeStyles } from "@material-ui/core/styles";

import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";

import Button from "@material-ui/core/Button";

import CreateStanceTextField from "./CreateStanceTextField";

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

const CREATE_STANCE = gql`
  mutation CreateStance($name: String!) {
    CreateStance(name: $name) {
      name
    }
  }
`;

export default function CreateStance({ data, GET_STANCES }) {
  const classes = useStyles();

  const [name, setName] = useState("");

  const [CreateStance] = useMutation(
    CREATE_STANCE,
    {
      update(cache, { data: { CreateStance } }) {
        const { Stance } = cache.readQuery({ query: GET_STANCES });
        cache.writeQuery({
          query: GET_STANCES,
          data: { Stance: Stance.concat([CreateStance]) },
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
        <CreateStanceTextField
          name={name}
          setName={setName}
        />
      </form>
        
      <Button
        onClick={e => {
          CreateStance({
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
