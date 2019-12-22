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
      nameLong
      #nameShort
    }
  }
`;

// export default function RankSelect({ rank, setRank }) {
export default function RankSelect() {
  const classes = useStyles();

  const inputLabel = React.useRef(null);
  const [labelWidth, setLabelWidth] = React.useState(0);
  // React.useEffect(() => {
  //   setLabelWidth(inputLabel.current.offsetWidth);
  // }, []);

  const [rank, setRank] = useState("");

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
          value={rank}
          onChange={e => setRank(e.target.value)}
          labelWidth={labelWidth}
        >
        {data.Rank
          .map(n => {
            return (
              <MenuItem key={n.nameLong} value={n.nameLong}>{n.nameLong}</MenuItem>
            );
          })}



          {/*<MenuItem value="">
            <em>None</em>
          </MenuItem>*/}
          {/*<MenuItem value={"white"}>White</MenuItem>
          <MenuItem value={"yellow"}>Yellow</MenuItem>
          <MenuItem value={"orange"}>Orange</MenuItem>
          <MenuItem value={"purple"}>Purple</MenuItem>
          <MenuItem value={"blue"}>Blue</MenuItem>
          <MenuItem value={"green"}>Green</MenuItem>
          <MenuItem value={"red"}>Red</MenuItem>
          <MenuItem value={"first black"}>1st Black</MenuItem>
          <MenuItem value={"second black"}>2nd Black</MenuItem>
          <MenuItem value={"third black"}>3rd Black</MenuItem>
          <MenuItem value={"fourth black"}>4th Black</MenuItem>
          <MenuItem value={"fifth black"}>5th Black</MenuItem>
          <MenuItem value={"sixth black"}>6th Black</MenuItem>
          <MenuItem value={"seventh black"}>7th Black</MenuItem>
          <MenuItem value={"eighth black"}>8th Black</MenuItem>
          <MenuItem value={"nineth black"}>9th Black</MenuItem>
          <MenuItem value={"tenth black"}>10th Black</MenuItem>*/}
        </Select>
        {/*<FormHelperText>Required</FormHelperText>*/}
      </FormControl>

      {/* Need to set rankGroup based on rank */}
    </div>
  );
}
