import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";

const useStyles = makeStyles(theme => ({
  container: {
    display: "flex",
    flexWrap: "wrap"
  },
  textField: {
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1)
  },
  dense: {
    marginTop: 16
  },
  menu: {
    width: 200
  }
}));

export default function CreateRankTextField({ name, setName }) {
  const classes = useStyles();

  return (
    <TextField
      id="outlined-rank"
      label="Rank"
      className={classes.textField}
      onChange={e => setName(e.target.value)}
      margin="normal"
      variant="outlined"
      helperText="Enter rank name"
    />
  );
}
