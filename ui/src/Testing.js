import React, { useState, useRef } from "react"
import { useQuery } from "@apollo/react-hooks";
import gql from "graphql-tag";
import { makeStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";

import RankSelect from "./RankSelect";

const useStyles = makeStyles(theme => ({
	root: {
		maxWidth: "auto",
		marginTop: theme.spacing(3),
		overflowX: "auto",
		margin: "auto"
	}
}));

const GET_TESTING_REQUIREMENTS = gql`
	{
    Rank {
      name
      rankOrder
      strikes {
      	name
      	description
      }
      blocks {
      	name
      	description
      }
      kicks {
      	name
      	description
      }
      stances {
      	name
      	description
      }
      movements {
      	name
      	description
      }
      turns {
      	name
      	description
      }
      katas {
      	name
      	description
      }
    }
  }
`;

export default function Testing({headerHeight}) {
	const classes = useStyles();

	const [rankID, setRankID] = useState("");

	const tabHeaderRef = useRef(null);
	  const style = { top: headerHeight };
	  const style2 = {
	    marginTop:
	      headerHeight// +
	      //(tabHeaderRef.current ? tabHeaderRef.current.offsetHeight : 0)
	  };

	const { loading, error, data } = useQuery(GET_TESTING_REQUIREMENTS)

	if (loading) return "Loading...";
	if (error) return `Error ${error.message}`;

	return (
		<div style={style} /*className={classes.root}*/>
			<Grid style={style2} container spacing={3}>
				<Grid item sm={12}>
					<RankSelect rankID={rankID} setRankID={setRankID} />
				</Grid>
				
				{/*{data.Rank.map(r => {
					return (*/}

				<Grid item sm={12}>
					<Paper elevation={2}>
						Strikes
					</Paper>
				</Grid>

				<Grid item sm={12}>
				 <Paper elevation={2}>
						Blocks
					</Paper>
				</Grid>

				<Grid item sm={12}>
					<Paper elevation={2}>
						Kicks
					</Paper>
				</Grid>

				<Grid item sm={12}>
					<Paper elevation={2}>
						Stances
					</Paper>
				</Grid>

				<Grid item sm={12}>
					<Paper elevation={2}>
						Movements
					</Paper>
				</Grid>

				<Grid item sm={12}>
					<Paper elevation={2}>
						Turns
					</Paper>
				</Grid>

				<Grid item sm={12}>
					<Paper elevation={2}>
						Katas
					</Paper>
				</Grid>

				{/*});
				})}*/}

			</Grid>

		</div>
	);
}
