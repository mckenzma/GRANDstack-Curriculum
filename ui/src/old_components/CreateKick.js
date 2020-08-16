import React, { useState } from "react";
import { useMutation } from "@apollo/react-hooks";
import gql from "graphql-tag";
import { makeStyles } from "@material-ui/core/styles";

import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";

import Button from "@material-ui/core/Button";

import CreateKickTextField from "./CreateKickTextField";

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

const CREATE_KICK = gql`
  mutation CreateKick($name: String!) {
    CreateKick(name: $name) {
      name
    }
  }
`;

export default function CreateKick({ data, GET_KICKS }) {
  const classes = useStyles();

  const [name, setName] = useState("");

  const [CreateKick] = useMutation(
    CREATE_KICK,
    {
      update(cache, { data: { CreateKick } }) {
        const { Kick } = cache.readQuery({ query: GET_KICKS });
        cache.writeQuery({
          query: GET_KICKS,
          data: { Kick: Kick.concat([CreateKick]) },
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
        <CreateKickTextField
          name={name}
          setName={setName}
        />
      </form>
        
      <Button
        onClick={e => {
          CreateKick({
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
