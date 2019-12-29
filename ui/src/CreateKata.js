import React, { useState } from "react";
import { useMutation } from "@apollo/react-hooks";
import gql from "graphql-tag";
import { makeStyles } from "@material-ui/core/styles";

import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";

import Button from "@material-ui/core/Button";

import CreateKataTextField from "./CreateKataTextField";

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

const CREATE_KATA = gql`
  mutation CreateKata($name: String!) {
    CreateKata(name: $name) {
      name
    }
  }
`;

export default function CreateKata({ data, GET_KATAS }) {
  const classes = useStyles();

  const [name, setName] = useState("");

  const [CreateKata] = useMutation(
    CREATE_KATA,
    {
      update(cache, { data: { CreateKata } }) {
        const { Kata } = cache.readQuery({ query: GET_KATAS });
        cache.writeQuery({
          query: GET_KATAS,
          data: { Kata: Kata.concat([CreateKata]) },
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
        <CreateKataTextField
          name={name}
          setName={setName}
        />
      </form>
        
      <Button
        onClick={e => {
          CreateKata({
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
