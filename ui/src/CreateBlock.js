import React, { useState } from "react";
import { useMutation } from "@apollo/react-hooks";
import gql from "graphql-tag";
import { makeStyles } from "@material-ui/core/styles";

import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";

import Button from "@material-ui/core/Button";

import CreateBlockTextField from "./CreateBlockTextField";

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

const CREATE_BLOCK = gql`
  mutation CreateBlock($name: String!) {
    CreateBlock(name: $name) {
      name
    }
  }
`;

export default function CreateBlock({ data, GET_BLOCKS }) {
  const classes = useStyles();

  const [name, setName] = useState("");

  const [CreateBlock] = useMutation(
    CREATE_BLOCK,
    {
      update(cache, { data: { CreateBlock } }) {
        const { Block } = cache.readQuery({ query: GET_BLOCKS });
        cache.writeQuery({
          query: GET_BLOCKS,
          data: { Block: Block.concat([CreateBlock]) },
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
        <CreateBlockTextField
          name={name}
          setName={setName}
        />
      </form>
        
    
      <Paper square elevation={1} className={classes.resetContainer}>
        <Button
          onClick={e => {
            CreateBlock({
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
    </div>
  );
}
