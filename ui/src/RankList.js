import React from "react";
import { Query } from "react-apollo";
import gql from "graphql-tag";
import "./RankList.css";
import { withStyles } from "@material-ui/core/styles";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Tooltip,
  Paper,
  TableSortLabel
} from "@material-ui/core";

const styles = theme => ({
  root: {
    maxWidth: 700,
    marginTop: theme.spacing.unit * 3,
    overflowX: "auto",
    margin: "auto"
  },
  table: {
    minWidth: 700
  }
});

class RankList extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      order: "asc",
      orderBy: "id",
      page: 0,
      rowsPerPage: 10
    };
  }

  handleSortRequest = property => {
    const orderBy = property;
    let order = "desc";

    if (this.state.orderBy === property && this.state.order === "desc") {
      order = "asc";
    }

    this.setState({ order, orderBy });
  };

  render() {
    const { order, orderBy } = this.state;
    return (
      <Query
        query={gql`
          query ranksPaginateQuery(
            $first: Int
            $offset: Int
            $orderBy: _RankOrdering
          ) {
            Rank(first: $first, offset: $offset, orderBy: $orderBy) {
              id
              nameShort
              nameLong
            }
          }
        `}
        variables={{
          first: this.state.rowsPerPage,
          offset: this.state.rowsPerPage * this.state.page,
          orderBy: this.state.orderBy + "_" + this.state.order
        }}
      >
        {({ loading, error, data }) => {
          if (loading) return <p>Loading...</p>;
          if (error) return <p>Error</p>;

          return (
            <Paper className={this.props.classes.root}>
              <Table className={this.props.classes.table}>
                <TableHead>
                  <TableRow>
                    <TableCell
                      key="id"
                      sortDirection={orderBy === "id" ? order : false}
                    >
                      <Tooltip
                        title="Sort"
                        placement="bottom-start"
                        enterDelay={300}
                      >
                        <TableSortLabel
                          active={orderBy === "id"}
                          direction={order}
                          onClick={() => this.handleSortRequest("id")}
                        >
                          Rank ID
                        </TableSortLabel>
                      </Tooltip>
                    </TableCell>
                    <TableCell
                      key="nameShort"
                      sortDirection={orderBy === "nameShort" ? order : false}
                    >
                      <Tooltip
                        title="Sort"
                        placement="bottom-end"
                        enterDelay={300}
                      >
                        <TableSortLabel
                          active={orderBy === "nameShort"}
                          direction={order}
                          onClick={() => this.handleSortRequest("nameShort")}
                        >
                          Name Short
                        </TableSortLabel>
                      </Tooltip>
                    </TableCell>
                    <TableCell
                      key="nameLong"
                      sortDirection={orderBy === "nameLong" ? order : false}
                    >
                      <Tooltip
                        title="Sort"
                        placement="bottom-start"
                        enterDelay={300}
                      >
                        <TableSortLabel
                          active={orderBy === "nameLong"}
                          direction={order}
                          onClick={() => this.handleSortRequest("nameLong")}
                        >
                          Name Long
                        </TableSortLabel>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {data.Rank.map(n => {
                    return (
                      <TableRow key={n.id}>
                        <TableCell component="th" scope="row">
                          {n.id}
                        </TableCell>
                        <TableCell >{n.nameShort}</TableCell>
                        <TableCell >{n.nameLong}</TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </Paper>
          );
        }}
      </Query>
    );
  }
}

export default withStyles(styles)(RankList);
