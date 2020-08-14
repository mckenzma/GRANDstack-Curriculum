import React, { useState } from 'react';
import { useQuery } from "@apollo/react-hooks";
import gql from "graphql-tag";
import { makeStyles } from '@material-ui/core/styles';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormHelperText from '@material-ui/core/FormHelperText';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';

import Divider from '@material-ui/core/Divider';

const useStyles = makeStyles((theme) => ({
  formControl: {
    margin: theme.spacing(1),
    minWidth: 120,
  },
  selectEmpty: {
    marginTop: theme.spacing(2),
  },
}));

const GET_TECHNIQUES = gql`
  query {
    Technique {
      id
      name
      description
      __typename
    }
  }
`;

export default function SelectTechnique({type, _technique, _setTechnique}) {
  const classes = useStyles();
  const [technique, setTechnique] = useState(_technique);

  const { loading, error, data } = useQuery(GET_TECHNIQUES);

  // console.log("data: ", data);

  const handleChange = (event) => {
    setTechnique(event.target.value);
    _setTechnique(event.target.value);
  };

  // console.log("type: ", type);
  // console.log("technique: ", technique);

  function getSorting(order, orderBy) {
    return order === "desc"
      ? (a, b) => (b[orderBy] < a[orderBy] ? -1 : 1)
      : (a, b) => (a[orderBy] < b[orderBy] ? -1 : 1);
  }

  if (loading) return "Loading...";
  if (error) return `Error ${error.message}`;

  return (
    <div>
      <FormControl 
        className={classes.formControl} 
        disabled={ type === "" ? true : false }
      >
        <InputLabel id="demo-simple-select-disabled-label">Technique</InputLabel>
        <Select
            labelId="demo-simple-select-disabled-label"
            id="demo-simple-select-disabled"
            value={technique}
            onChange={handleChange}
          >
            <MenuItem value="">
              <em>None</em>
            </MenuItem>
            <Divider />
            {data.Technique
              .sort(getSorting("asc","name"))
              .filter(t => t.__typename === type)
              .map(t => {
                // console.log(t);
                return (
                  <MenuItem key={t.id} value={t.id}>{t.name}</MenuItem>
                )
              })}
          </Select>
        {/*<FormHelperText>Select Technique</FormHelperText>*/}
        <FormHelperText>{ type === "" ? "Select Type First" : "Select Technique" }</FormHelperText>
      </FormControl>
    </div>
  );
}
