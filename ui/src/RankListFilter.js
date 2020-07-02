import React, { useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { useQuery } from "@apollo/react-hooks";

import { Query } from "react-apollo";
import gql from "graphql-tag";

import ListItemText from "@material-ui/core/ListItemText";
import Checkbox from "@material-ui/core/Checkbox";
import CheckBoxOutlineBlankIcon from "@material-ui/icons/CheckBoxOutlineBlank";
import CheckBoxIcon from "@material-ui/icons/CheckBox";

import Divider from "@material-ui/core/Divider";

import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import Select from "@material-ui/core/Select";
import Chip from "@material-ui/core/Chip";
import PropTypes from "prop-types";

import { withStyles } from "@material-ui/core/styles";

const useStyles = makeStyles(theme => ({
  // const styles = theme => ({
  root: {
    display: "flex",
    flexWrap: "wrap"
  },
  formControl: {
    margin: theme.spacing(1),
    minWidth: 120
  },
  chips: {
    display: "flex",
    flexWrap: "wrap"
  },
  chip: {
    margin: theme.spacing(0.25)
  },
  noLabel: {
    marginTop: theme.spacing(3)
  }
  // });
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

export default function RankListFilter({
  selectedRanks,
  setSelectedRanks
}) {
  const classes = useStyles();

  // console.log(selectedRanks);

  const { loading, error, data } = useQuery(GET_RANKS);
  
  const [order, setOrder] = useState("asc");
  
  const [orderBy, setOrderBy] = useState("rankOrder");
  
  const [name, setName] = useState(null);
  
  const [state, setState] = useState(null);

  const [selected, setSelected] = useState("");
  const [numSelected, setNumSelected] = useState(0);
  const [numSelectedRanks, setNumSelectedRanks] = useState(
    selectedRanks.length
  );

  const handleChange = name => event => {
    setState({ ...state, [name]: event.target.checked });
    console.log(name);
  };

  function handleClick(event, name) {
    console.log("click");
    setSelected(selectedRanks);
    const selectedIndex = selectedRanks.indexOf(name);
    let newSelected = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selectedRanks, name);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selectedRanks.slice(1));
    } else if (selectedIndex === selectedRanks.length - 1) {
      newSelected = newSelected.concat(selectedRanks.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selectedRanks.slice(0, selectedIndex),
        selectedRanks.slice(selectedIndex + 1)
      );
    }

    setSelectedRanks(newSelected.sort());
    setNumSelectedRanks(newSelected.length);
  }

  const handleSelectAllClick = (event, data) => {
    let newSelected = [];

    if (event.target.checked) {
      newSelected = data.map(n => n.name);
      setSelectedRanks(newSelected.sort());
      setNumSelectedRanks(rowCount);
      return;
    }
    setSelectedRanks([]);
    setNumSelected(0);
  };

  function getSorting(order, orderBy) {
    return order === "desc"
      ? (a, b) => (b[orderBy] < a[orderBy] ? -1 : 1)
      : (a, b) => (a[orderBy] < b[orderBy] ? -1 : 1);
  }

  if (loading) return "Loading...";
  if (error) return `Error ${error.message}`;

  const rowCount = Object.keys(data.Rank).length;
  
  return (
    <FormControl className={classes.formControl}>
      <InputLabel>Ranks</InputLabel>
      <Select
        multiple
        value={selectedRanks}
        renderValue={selectedRanks => (
          <div className={classes.chips}>
            {selectedRanks.map(value => (
              <Chip
                key={value}
                label={value}
              />
            ))}
          </div>
        )}
      >
        <MenuItem>
          <Checkbox
            indeterminate={
              numSelectedRanks > 0 && numSelectedRanks < rowCount
            }
            checked={numSelectedRanks === rowCount}
            onChange={event =>
              handleSelectAllClick(event, Object(data.Rank))
            }
          />
          <ListItemText>Select All</ListItemText>
        </MenuItem>
        <Divider />
        {data.Rank.slice()
          .sort(getSorting(order, orderBy))
          .map(n => {
            return (
              <MenuItem key={n.name} value={n.name}>
                <Checkbox
                  checked={selectedRanks.indexOf(n.name) !== -1}
                  onChange={handleChange(n.name)}
                  value={n.name}
                  onClick={event =>
                    handleClick(event, n.name)
                  }
                />
                <ListItemText>{n.name}</ListItemText>
              </MenuItem>
            );
          })}
      </Select>
    </FormControl>

  );
}
