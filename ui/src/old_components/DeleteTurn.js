import React, { useState } from "react";
import { useMutation } from "@apollo/react-hooks";
import gql from "graphql-tag";
import { makeStyles } from "@material-ui/core/styles";

import Button from "@material-ui/core/Button";

const useStyles = makeStyles(theme => ({
	root: {

	}
}));

const DELETE_TURN = gql`
	mutation DeleteTurn($name: String!) {
    DeleteTurn(name: $name) {
      name
    }
  }
`;

export default function DeleteTurn({ data, GET_TURNS, name }) {
	const classes = useStyles();

	const [DeleteTurn] = useMutation(
		DELETE_TURN,
		{
			update(cache, { data: { DeleteTurn } }) {
        const { Turn } = cache.readQuery({ query: GET_TURNS });
        cache.writeQuery({
          query: GET_TURNS,
          data: { 
          	Turn: Turn.filter(function(item) { return item.name != name; })
          },
        })
      }
		}
	);

	const handleDelete = event => {
		DeleteTurn({
			variables: { name: name }
		});
	}

	return (
		<Button
        onClick={handleDelete}
        className={classes.button}
        color="primary"
        variant="contained"
      >
        Delete
      </Button>
	);
}