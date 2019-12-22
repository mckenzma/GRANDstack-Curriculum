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

export default function CreateRankTextField({ nameLong, setNameLong }) {
  const classes = useStyles();

  return (
    // {/*<form className={classes.container} noValidate autoComplete="off">*/}
    <TextField
      id="outlined-rank"
      label="Rank"
      className={classes.textField}
      onChange={e => setNameLong(e.target.value)}
      margin="normal"
      variant="outlined"
    />
    // {/*</form>*/}
  );
}
