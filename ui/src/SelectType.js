import React, { useState } from 'react';
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


// TODO - update to pull labels from Technique
export default function SelectType({ _type, _setType }) {
  const classes = useStyles();
  const [type, setType] = useState(_type);

  const handleChange = (event) => {
    setType(event.target.value);
    _setType(event.target.value);
  };

  return (
    <div>
      <FormControl className={classes.formControl}>
        <InputLabel id="demo-simple-select-helper-label">Type</InputLabel>
        <Select
          labelId="demo-simple-select-helper-label"
          id="demo-simple-select-helper"
          value={type}
          onChange={handleChange}
        >
          <MenuItem value="">
            <em>None</em>
          </MenuItem>
          <Divider />
          <MenuItem value={"Block"}>Block</MenuItem>
          <MenuItem value={"Kick"}>Kick</MenuItem>
          <MenuItem value={"Strike"}>Strike</MenuItem>
          <Divider />
          <MenuItem value={"Movement"}>Movement</MenuItem>
          <MenuItem value={"Stance"}>Stance</MenuItem>
          <MenuItem value={"Turn"}>Turn</MenuItem>
        </Select>
        <FormHelperText>Select Type</FormHelperText>
      </FormControl>
    </div>
  );
}
