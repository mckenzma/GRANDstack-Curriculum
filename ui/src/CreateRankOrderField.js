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

export default function CreateRankOrderField({ rankOrder, setRankOrder }) {
  const classes = useStyles();

  return (
    <TextField
      id="outlined-number"
      label="Number"
      type="number"
      InputLabelProps={{
        shrink: true,
      }}
      onChange={e => setRankOrder(parseInt(e.target.value))}
      variant="outlined"
      helperText="Enter order of rank"
    />
  );
}
