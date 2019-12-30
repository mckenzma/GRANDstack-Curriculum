import React, { useState } from "react";
import { useMutation } from "@apollo/react-hooks";
import gql from "graphql-tag";
import { makeStyles } from "@material-ui/core/styles";

import Button from "@material-ui/core/Button";

const useStyles = makeStyles(theme => ({
	root: {

	}
}));

const DELETE_RANK = gql`
	mutation DeleteRank($name: String!) {
    DeleteRank(name: $name) {
      name
    }
  }
`;

export default function DeleteRank({ data, GET_RANKS, name }) {
	const classes = useStyles();

	const [DeleteRank] = useMutation(
		DELETE_RANK,
		{
			update(cache, { data: { DeleteRank } }) {
        const { Rank } = cache.readQuery({ query: GET_RANKS });
        cache.writeQuery({
          query: GET_RANKS,
          data: { 
          	Rank: Rank.filter(function(item) { return item.name != name; })
          },
        })
      }
		}
	);

	const handleDelete = event => {
		DeleteRank({
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