import React, { useState } from "react";
import { useMutation } from "@apollo/react-hooks";
import gql from "graphql-tag";
import { makeStyles } from "@material-ui/core/styles";

import Button from "@material-ui/core/Button";

const useStyles = makeStyles(theme => ({
	root: {

	}
}));

const DELETE_KICK = gql`
	mutation DeleteKick($name: String!) {
    DeleteKick(name: $name) {
      name
    }
  }
`;

export default function DeleteKick({ data, GET_KICKS, name }) {
	const classes = useStyles();

	const [DeleteKick] = useMutation(
		DELETE_KICK,
		{
			update(cache, { data: { DeleteKick } }) {
        const { Kick } = cache.readQuery({ query: GET_KICKS });
        cache.writeQuery({
          query: GET_KICKS,
          data: { 
          	Kick: Kick.filter(function(item) { return item.name != name; })
          },
        })
      }
		}
	);

	const handleDelete = event => {
		DeleteKick({
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