import React, { useState, useRef } from "react"
import { useQuery } from "@apollo/react-hooks";
import gql from "graphql-tag";
import { makeStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
import Typography from '@material-ui/core/Typography';

import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
// import ListItemAvatar from '@material-ui/core/ListItemAvatar';
// import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ListItemText from '@material-ui/core/ListItemText';

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
	query rankQuery(
		$rankID: ID!
	)
	{
    Rank(
      filter: {
        id: $rankID
      }
    ) {
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

	const { loading, error, data } = useQuery(GET_TESTING_REQUIREMENTS, {
    variables: {
      rankID
    }
  });

	if (loading) return "Loading...";
	if (error) return `Error ${error.message}`;

	return (
		<div /*style={style}*/ style={style2} /*className={classes.root}*/>
			<Grid /*style={style2}*/ container spacing={3}>
				<Grid item sm={12}>
					<RankSelect rankID={rankID} setRankID={setRankID} />
				</Grid>
			</Grid>
				
				{data.Rank.map(r => {
					return (

			<Grid container spacing={3}>

				{r.strikes.length > 0 && 
					<Grid item sm={12}>
						<Paper elevation={2}>
							<Typography variant="h3">Strikes</Typography>
							<List>
							{r.strikes.map(s => {
								return (
									<ListItem>
										<ListItemText
											primary={s.name}
											secondary={s.description}
										/>
									</ListItem>
								);
							})}
							</List>
						</Paper>
					</Grid>
				}

				{r.blocks.length > 0 && 
					<Grid item sm={12}>
					 	<Paper elevation={2}>
							<h3>Blocks</h3>
							{r.blocks.map(b => {
								return (
									<p>{b.name}</p>
								);
							})}
						</Paper>
					</Grid>
				}

				{r.kicks.length > 0 && 
					<Grid item sm={12}>
						<Paper elevation={2}>
							<h3>Kicks</h3>
							{r.kicks.map(k => {
								return (
									<p>{k.name}</p>
								);
							})}
						</Paper>
					</Grid>
				}

				{r.stances.length > 0 && 
					<Grid item sm={12}>
						<Paper elevation={2}>
							<h3>Stances</h3>
							{r.stances.map(s => {
								return (
									<p>{s.name}</p>
								);
							})}
						</Paper>
					</Grid>
				}

				{r.movements.length > 0 && 
					<Grid item sm={12}>
						<Paper elevation={2}>
							<h3>Movements</h3>
							{r.movements.map(m => {
								return (
									<p>{m.name}</p>
								);
							})}
						</Paper>
					</Grid>
				}

				{r.turns.length > 0 && 
					<Grid item sm={12}>
						<Paper elevation={2}>
							<h3>Turns</h3>
							{r.turns.map(t => {
								return (
									<p>{t.name}</p>
								);
							})}
						</Paper>
					</Grid>
				}

				{r.katas.length > 0 && 
					<Grid item sm={12}>
						<Paper elevation={2}>
							<h3>Katas</h3>
							{r.katas.map(k => {
								return (
									<p>{k.name}</p>
								);
							})}
						</Paper>
					</Grid>
				}

			</Grid>

				);
				})}

			{/*</Grid>*/}

		</div>
	);
}
