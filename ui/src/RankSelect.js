import React, { useState } from "react";
import { useQuery } from "@apollo/react-hooks";
import gql from "graphql-tag";
import { makeStyles } from "@material-ui/core/styles";
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import FormHelperText from "@material-ui/core/FormHelperText";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";

const useStyles = makeStyles(theme => ({
  formControl: {
    margin: theme.spacing(1),
    minWidth: 120
  },
  selectEmpty: {
    marginTop: theme.spacing(2)
  }
}));

const GET_RANKS = gql`
  {
    Rank {
      id
      name
      rankOrder
    }
  }
`;

export default function RankSelect({ rankID, setRankID }) {
  const classes = useStyles();

  const [order, setOrder] = useState("asc");
  const [orderBy, setOrderBy] = useState("rankOrder");

  const inputLabel = React.useRef(null);
  const [labelWidth, setLabelWidth] = React.useState(0);

  // const [rank, setRank] = useState("");

  const getSorting = (order, orderBy) => {
  return order === "desc"
    ? (a, b) => (b[orderBy] < a[orderBy] ? -1 : 1)
    : (a, b) => (a[orderBy] < b[orderBy] ? -1 : 1);
  };

  const { loading, error, data } = useQuery(GET_RANKS);

  if (loading) return "Loading...";
  if (error) return `Error ${error.message}`;

  return (
    <div>
      <FormControl required variant="outlined" className={classes.formControl}>
        <InputLabel ref={inputLabel} id="demo-simple-select-outlined-label">
          Rank
        </InputLabel>
        <Select
          labelId="demo-simple-select-outlined-label"
          id="demo-simple-select-outlined"
          value={rankID}
          onChange={e => setRankID(e.target.value)}
          labelWidth={labelWidth}
        >
        {/*<MenuItem value="">
            <em>None</em>
          </MenuItem>*/}
        {data.Rank
          .sort(getSorting(order, orderBy))
          .map(n => {
            return (
              <MenuItem key={n.id} value={n.id}>{n.name}</MenuItem>
            );
          })}
        </Select>
        {/*<FormHelperText>Required</FormHelperText>*/}
      </FormControl>

      {/* Need to set rankGroup based on rank */}
    </div>
  );
}
