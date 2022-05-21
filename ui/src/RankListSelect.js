import React, { useState } from 'react';
import { useQuery } from "@apollo/react-hooks";
import gql from "graphql-tag";
import { withStyles } from '@material-ui/core/styles';
import { makeStyles } from "@material-ui/core/styles";
import { green } from '@material-ui/core/colors';
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import InputLabel from "@material-ui/core/InputLabel";
import Select from "@material-ui/core/Select";
import Checkbox from '@material-ui/core/Checkbox';
import CheckBoxOutlineBlankIcon from '@material-ui/icons/CheckBoxOutlineBlank';
import CheckBoxIcon from '@material-ui/icons/CheckBox';
import Favorite from '@material-ui/icons/Favorite';
import FavoriteBorder from '@material-ui/icons/FavoriteBorder';
import MenuItem from "@material-ui/core/MenuItem";
import ListItemText from "@material-ui/core/ListItemText";
import FormHelperText from "@material-ui/core/FormHelperText";

import FormControl from "@material-ui/core/FormControl";
import Divider from "@material-ui/core/Divider";
import Chip from "@material-ui/core/Chip";

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
      name
      rankOrder
    }
  }
`;

export default function RankSelectFilter() {
  const classes = useStyles();

  const { loading, error, data } = useQuery(GET_RANKS);

  const [order, setOrder] = useState("asc");
  const [orderBy, setOrderBy] = useState("rankOrder");

  const [state, setState] = React.useState({
    checkedA: true,
    checkedB: true,
    checkedF: true,
    checkedG: true,
  });

  const [name, setName] = useState("");
  const [selectedRanks, setSelectedRanks] = useState([]);
  const [numSelectedRanks, setNumSelectedRanks] = useState(0);

  const inputLabel = React.useRef(null);
  const [labelWidth, setLabelWidth] = React.useState(0);


  const handleChange = name => event => {
    setState({ ...state, [name]: event.target.checked });
  };

  const [selected, setSelected] = useState([]);

  function handleClick(event, name) {
    setSelected(selectedRanks);
    const selectedIndex = selectedRanks.indexOf(name);
    let newSelected = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selectedRanks, name);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selectedRanks.slice(1));
    } else if (selectedIndex === selectedRanks.length - 1) {
      newSelected = newSelected.concat(selectedRanks.slice(0,-1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selectedRanks.slice(0,selectedIndex),
        selectedRanks.slice(selectedIndex + 1)
      );
    }

    setSelectedRanks(newSelected);
    setNumSelectedRanks(newSelected.length);
  };

  function handleSelectAllClick(event, data) {
    let newSelected = [];

    if (event.target.checked) {
      newSelected = data.map(n => n.name);
      setSelectedRanks(newSelected.sort());
      // setNumSelectedRanks(selectedRanks.length);
      setNumSelectedRanks(rowCount);
      return;
    }
    setSelectedRanks([]);
    // setNumSelectedRanks(selectedRanks.length);
    setNumSelectedRanks(0);
  };

  const getSorting = (order, orderBy) => {
  return order === "desc"
    ? (a, b) => (b[orderBy] < a[orderBy] ? -1 : 1)
    : (a, b) => (a[orderBy] < b[orderBy] ? -1 : 1);
  };

  if (loading) return "Loading...";
  if (error) return `Error ${error.message}`;

  const rowCount = Object.keys(data.Rank).length;

  // console.log(selectedRanks);
  // console.log(numSelectedRanks);

  return (
    <FormControl required variant="outlined" className={classes.formControl}>
      <InputLabel ref={inputLabel} id="demo-simple-select-outlined-label">
        Rank
      </InputLabel>
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
            // disabled
            indeterminate={numSelectedRanks > 0 && numSelectedRanks < rowCount}
            checked={numSelectedRanks === rowCount}
            onChange={event =>
              handleSelectAllClick(event, Object(data.Rank))
            }
            color="primary"
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
                color="primary"
              />
              <ListItemText style={{backgroundColor:rank.colorhex, color: (rank.colorhex === "#000000" ? "#ffeb3b" : "#000000")}}>{n.name}</ListItemText>
            </MenuItem>
          );
        })}
      </Select>
      {<FormHelperText>Select Ranks technique is required for</FormHelperText>}
    </FormControl>
  );
}