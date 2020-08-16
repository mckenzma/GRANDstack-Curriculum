import React, { useState, useEffect } from "react";
import { useMutation } from "@apollo/react-hooks";
import gql from "graphql-tag";
import { makeStyles } from "@material-ui/core/styles";

import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";

import Button from "@material-ui/core/Button";

import CreateRankTextField from "./CreateRankTextField";
import CreateRankOrderField from "./CreateRankOrderField";

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

const CREATE_RANK = gql`
  mutation CreateRank($name: String!, $rankOrder: Int!) {
    CreateRank(name: $name, rankOrder: $rankOrder) {
      name
      rankOrder
    }
  }
`;

export default function CreateRank({ data, GET_RANKS }) {
  const classes = useStyles();

  const [name, setName] = useState("");
  const [rankOrder, setRankOrder] = useState(0);

  const [CreateRank] = useMutation(
    CREATE_RANK,
    {
      update(cache, { data: { CreateRank } }) {
        const { Rank } = cache.readQuery({ query: GET_RANKS });
        cache.writeQuery({
          query: GET_RANKS,
          data: { Rank: Rank.concat([CreateRank]) },
        })
      }
    }
  );

  const handleReset = () => {
    setName("");
    setRankOrder(0);
  };

  const handleSubmit = event => {
    CreateRank({
      variables: { name: name, rankOrder: rankOrder }
    });
  }

  return (
    <div className={classes.root} >
      <form className={classes.container} noValidate autoComplete="off">
        <CreateRankTextField
          name={name}
          setName={setName}
        />
        <CreateRankOrderField
          rankOrder={rankOrder}
          setRankOrder={setRankOrder}
        />
      </form>
    
      <Button
        onClick={handleSubmit}
        className={classes.button}
        color="primary"
        variant="contained"
      >
        Submit
      </Button>
    </div>
  );
}

