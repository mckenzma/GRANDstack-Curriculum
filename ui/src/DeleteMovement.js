import React, { useState } from "react";
import { useMutation } from "@apollo/react-hooks";
import gql from "graphql-tag";
import { makeStyles } from "@material-ui/core/styles";

import Button from "@material-ui/core/Button";

const useStyles = makeStyles(theme => ({
	root: {

	}
}));

const DELETE_MOVEMENT = gql`
	mutation DeleteMovement($name: String!) {
    DeleteMovement(name: $name) {
      name
    }
  }
`;

export default function DeleteMovement({ data, GET_MOVEMENTS, name }) {
	const classes = useStyles();

	const [DeleteMovement] = useMutation(
		DELETE_MOVEMENT,
		{
			update(cache, { data: { DeleteMovement } }) {
        const { Movement } = cache.readQuery({ query: GET_MOVEMENTS });
        cache.writeQuery({
          query: GET_MOVEMENTS,
          data: { 
          	Movement: Movement.filter(function(item) { return item.name != name; })
          },
        })
      }
		}
	);

	const handleDelete = event => {
		DeleteMovement({
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