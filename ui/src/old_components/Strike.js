import React, { useState, useEffect } from "react";
import { useQuery } from "@apollo/react-hooks";
import { useMutation } from "@apollo/react-hooks";
import gql from "graphql-tag";
import { makeStyles } from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Tooltip from "@material-ui/core/Tooltip";
import Paper from "@material-ui/core/Paper";
import { TableSortLabel } from "@material-ui/core";

import Grid from "@material-ui/core/Grid";

import CreateStrike from "./CreateStrike";
import DeleteStrike from "./DeleteStrike";

import RankSelectFilter from "./RankListSelect";

const useStyles = makeStyles(theme => ({
  root: {
    maxWidth: "auto",
    marginTop: theme.spacing(3),
    overflowX: "auto",
    margin: "auto"
  },
  table: {
    // minWidth: 700
  },

  button: {
    margin: theme.spacing(1)
  },
  input: {
    display: "none"
  }
}));

const GET_STRIKES = gql`
  {
    Strike {
      name
    }
  }
`;

export default function Strike2() {
  const classes = useStyles();

  const [order, setOrder] = useState("asc");
  const [orderBy, setOrderBy] = useState("name");

  const handleSortRequest = property => {
    const newOrderBy = property;
    let newOrder = "desc";

    if (orderBy === property && order === "desc") {
      newOrder = "asc";
    }

    setOrder(newOrder);
    setOrderBy(newOrderBy);
  };

  const getSorting = (order, orderBy) => {
  return order === "desc"
    ? (a, b) => (b[orderBy] < a[orderBy] ? -1 : 1)
    : (a, b) => (a[orderBy] < b[orderBy] ? -1 : 1);
  };

  const { loading, error, data } = useQuery(GET_STRIKES);

  if (loading) return "Loading...";
  if (error) return `Error ${error.message}`;

  return (
    <div className={classes.root}>
      <Grid container spacing={3}>
        <Grid item /*xs={12}*/ sm={6}>
          <Table className={classes.table}>
            <TableHead>
              <TableRow>
                <TableCell
                  key="name"
                  sortDirection={orderBy === "name" ? order : false}
                >
                  <Tooltip title="Sort" placement="bottom-start" enterDelay={300}>
                    <TableSortLabel
                      active={orderBy === "name"}
                      direction={order}
                      onClick={() => handleSortRequest("name")}
                    >
                      Name
                    </TableSortLabel>
                  </Tooltip>
                </TableCell>
                <TableCell key="delete" />
                
              </TableRow>
            </TableHead>
            <TableBody>
              {data.Strike //.slice()
                .sort(getSorting(order, orderBy))
                .map(n => {
                  return (
                    <TableRow key={n.name}>
                      <TableCell component="th" scope="row">
                        {n.name}
                      </TableCell>
                      <TableCell>
                      <DeleteStrike data={data} GET_STRIKES={GET_STRIKES} name={n.name} />
                    </TableCell>
                    </TableRow>
                  );
                })}
            </TableBody>
          </Table>
        </Grid>
        <Grid item /*xs={12}*/ sm={6}>
          <RankSelectFilter />
          <CreateStrike data={data} GET_STRIKES={GET_STRIKES} />
        </Grid>
      </Grid>
    </div>
  );
}
