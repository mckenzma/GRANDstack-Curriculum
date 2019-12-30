import React, { useState } from "react";
import { useMutation } from "@apollo/react-hooks";
import gql from "graphql-tag";
import { makeStyles } from "@material-ui/core/styles";

import Button from "@material-ui/core/Button";

const useStyles = makeStyles(theme => ({
	root: {

	}
}));

const DELETE_BLOCK = gql`
	mutation DeleteBlock($name: String!) {
    DeleteBlock(name: $name) {
      name
    }
  }
`;

export default function DeleteBlock({ data, GET_BLOCKS, name }) {
	const classes = useStyles();

	const [DeleteBlock] = useMutation(
		DELETE_BLOCK,
		{
			update(cache, { data: { DeleteBlock } }) {
        const { Block } = cache.readQuery({ query: GET_BLOCKS });
        cache.writeQuery({
          query: GET_BLOCKS,
          data: { 
          	Block: Block.filter(function(item) { return item.name != name; })
          },
        })
      }
		}
	);

	const handleDelete = event => {
		DeleteBlock({
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