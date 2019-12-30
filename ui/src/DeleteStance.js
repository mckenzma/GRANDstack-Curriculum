import React, { useState } from "react";
import { useMutation } from "@apollo/react-hooks";
import gql from "graphql-tag";
import { makeStyles } from "@material-ui/core/styles";

import Button from "@material-ui/core/Button";

const useStyles = makeStyles(theme => ({
	root: {

	}
}));

const DELETE_STANCE = gql`
	mutation DeleteStance($name: String!) {
    DeleteStance(name: $name) {
      name
    }
  }
`;

export default function DeleteStance({ data, GET_STANCES, name }) {
	const classes = useStyles();

	const [DeleteStance] = useMutation(
		DELETE_STANCE,
		{
			update(cache, { data: { DeleteStance } }) {
        const { Stance } = cache.readQuery({ query: GET_STANCES });
        cache.writeQuery({
          query: GET_STANCES,
          data: { 
          	Stance: Stance.filter(function(item) { return item.name != name; })
          },
        })
      }
		}
	);

	const handleDelete = event => {
		DeleteStance({
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