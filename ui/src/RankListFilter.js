import React, { useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { useQuery } from "@apollo/react-hooks";

import gql from "graphql-tag";

import ListItemText from "@material-ui/core/ListItemText";
import Checkbox from "@material-ui/core/Checkbox";

import Divider from "@material-ui/core/Divider";

import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import Select from "@material-ui/core/Select";
import Chip from "@material-ui/core/Chip";

const useStyles = makeStyles(theme => ({
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
}));

const GET_RANKS = gql`
  {
    Rank {
      id
      name
      abbreviation
      rankOrder
    }
  }
`;

export default function RankListFilter( props ){
  const classes = useStyles();

  const { value, onChange } = props;

  const { loading, error, data } = useQuery(GET_RANKS);
  
  const [order, setOrder] = useState("asc");
  const [orderBy, setOrderBy] = useState("rankOrder");
  const [name, setName] = useState(null);
  const [state, setState] = useState(null);

  const [selected, setSelected] = useState(value);
  const [numSelected, setNumSelected] = useState(value.length !== undefined ? value.length : 0 );

  const handleChange = name => event => {
    setState({ ...state, [name]: event.target.checked });
  };

  function handleClick(event, obj) {
    const selectedIndex = selected.findIndex(r => r.id === obj.id);
    let newSelected = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, obj);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));;
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1)
      );
    }

    setSelected(newSelected.sort());
    onChange(newSelected.sort());
    setNumSelected(newSelected.length);
  }


  const handleSelectAllClick = (event, data) => {
    let newSelected = [];

    if (event.target.checked) {
      newSelected = data;
      setSelected(newSelected.sort());
      onChange(newSelected.sort());
      setNumSelected(rowCount);
      return;
    }
    setSelected([]);
    onChange([]);
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
        value={selected}
        renderValue={selected => (
          <div className={classes.chips}>
            {selected.sort(getSorting("asc","rankOrder")).map(value => (
              <Chip
                key={value.id}
                label={value.name}
              />
            ))}
          </div>
        )}
      >
        <MenuItem>
          <Checkbox
            indeterminate={
              numSelected > 0 && numSelected < rowCount
            }
            checked={numSelected === rowCount}
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
              <MenuItem key={n.id} value={n.name}>
                <Checkbox
                  // checked={selected.indexOf(n) !== -1}
                  checked={selected.find(obj => obj.id === n.id) !== undefined}
                  onChange={handleChange(n.id)}
                  value={n}
                  onClick={event =>
                    handleClick(event, n)
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
