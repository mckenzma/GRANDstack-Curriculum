import React, { useState } from "react";
import { useMutation } from "@apollo/react-hooks";
import gql from "graphql-tag";
import { makeStyles } from "@material-ui/core/styles";

import Button from "@material-ui/core/Button";

const useStyles = makeStyles(theme => ({
	root: {

	}
}));

const DELETE_STRIKE = gql`
	mutation DeleteStrike($name: String!) {
    DeleteStrike(name: $name) {
      name
    }
  }
`;

export default function DeleteStrike({ data, GET_STRIKES, name }) {
	const classes = useStyles();

	const [DeleteStrike] = useMutation(
		DELETE_STRIKE,
		{
			update(cache, { data: { DeleteStrike } }) {
        const { Strike } = cache.readQuery({ query: GET_STRIKES });
        cache.writeQuery({
          query: GET_STRIKES,
          data: { 
          	Strike: Strike.filter(function(item) { return item.name != name; })
          },
        })
      }
		}
	);

	const handleDelete = event => {
		DeleteStrike({
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