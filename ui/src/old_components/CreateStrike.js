import React, { useState } from "react";
import { useMutation } from "@apollo/react-hooks";
import gql from "graphql-tag";
import { makeStyles } from "@material-ui/core/styles";

import Paper from "@material-ui/core/Paper";

import Button from "@material-ui/core/Button";

import CreateStrikeTextField from "./CreateStrikeTextField";

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

export default function CreateStrike({ data, GET_STRIKES }) {
  const classes = useStyles();

  const [name, setName] = useState("");

  const [CreateStrike] = useMutation(
    CREATE_STRIKE,
    {
      update(cache, { data: { CreateStrike } }) {
        const { Strike } = cache.readQuery({ query: GET_STRIKES });
        cache.writeQuery({
          query: GET_STRIKES,
          data: { Strike: Strike.concat([CreateStrike]) },
        })
      }
    }
  );

  const handleClick = event => {
    CreateStrike({
      variables: { name: name }
    });
  }

  return (
    <div className={classes.root} /*justifyContent="flex-start"*/>
      <form className={classes.container} noValidate autoComplete="off">
        <CreateStrikeTextField
          name={name}
          setName={setName}
        />
      </form>
  
      <Button
        onClick={handleClick}

        className={classes.button}
        color="primary"
        variant="contained"
      >
        Submit
      </Button>
    </div>
  );
}
