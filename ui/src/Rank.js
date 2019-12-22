import React, { useState } from "react";
import { useQuery } from "@apollo/react-hooks";
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

import Button from "@material-ui/core/Button";

import CreateRank from "./CreateRank";

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

const GET_RANKS = gql`
  {
    Rank {
      nameLong
      #nameShort
    }
  }
`;


export default function Rank() {
  const classes = useStyles();

  const [order, setOrder] = useState("asc");
  const [orderBy, setOrderBy] = useState("nameLong");

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

  const { loading, error, data } = useQuery(GET_RANKS);

  if (loading) return "Loading...";
  if (error) return `Error ${error.message}`;

  return (
    <div className={classes.root}>
      <Grid container spacing={3}>
        <Grid item /*xs={12}*/ sm={6}>
    <Paper className={classes.root}>
      <Table className={classes.table}>
        <TableHead>
          <TableRow>
            <TableCell
              key="nameLong"
              sortDirection={orderBy === "nameLong" ? order : false}
            >
              <Tooltip title="Sort" placement="bottom-start" enterDelay={300}>
                <TableSortLabel
                  active={orderBy === "nameLong"}
                  direction={order}
                  onClick={() => handleSortRequest("nameLong")}
                >
                  Name (Long)
                </TableSortLabel>
              </Tooltip>
            </TableCell>
            {/*<TableCell
              key="nameShort"
              sortDirection={orderBy === "nameShort" ? order : false}
            >
              <Tooltip title="Sort" placement="bottom-end" enterDelay={300}>
                <TableSortLabel
                  active={orderBy === "nameShort"}
                  direction={order}
                  onClick={() => handleSortRequest("nameShort")}
                >
                  Name (Short)
                </TableSortLabel>
              </Tooltip>
            </TableCell>*/}
          </TableRow>
        </TableHead>
        <TableBody>
          {data.Rank //.slice()
            .sort(getSorting(order, orderBy))
            .map(n => {
              return (
                // <TableRow key={n.id}>
                <TableRow key={n.nameLong}>
                  <TableCell component="th" scope="row">
                    {n.nameLong}
                  </TableCell>
                  {/*<TableCell>{n.nameShort}</TableCell>*/}
                </TableRow>
              );
            })}
        </TableBody>
      </Table>
    </Paper>
    </Grid>
<Grid item /*xs={12}*/ sm={6}>
<Paper className={classes.root}>
<CreateRank />
</Paper>
</Grid>

    </Grid>
    </div>
  );
}
