import React, { useState } from "react";
import { useMutation } from "@apollo/react-hooks";
import gql from "graphql-tag";
import { makeStyles } from "@material-ui/core/styles";

import Button from "@material-ui/core/Button";

const useStyles = makeStyles(theme => ({
	root: {

	}
}));

const DELETE_KATA = gql`
	mutation DeleteKata($name: String!) {
    DeleteKata(name: $name) {
      name
    }
  }
`;

export default function DeleteKata({ data, GET_KATAS, name }) {
	const classes = useStyles();

	const [DeleteKata] = useMutation(
		DELETE_KATA,
		{
			update(cache, { data: { DeleteKata } }) {
        const { Kata } = cache.readQuery({ query: GET_KATAS });
        cache.writeQuery({
          query: GET_KATAS,
          data: { 
          	Kata: Kata.filter(function(item) { return item.name != name; })
          },
        })
      }
		}
	);

	const handleDelete = event => {
		DeleteKata({
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