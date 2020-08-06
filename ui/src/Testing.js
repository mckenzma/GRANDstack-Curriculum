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
// import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
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
    	id
      name
      rankOrder
      strikes {
      	id
      	name
      	description
      	firstRank
      }
      blocks {
      	id
      	name
      	description
      	firstRank
      }
      kicks {
      	id
      	name
      	description
      	firstRank
      }
      stances {
      	id
      	name
      	description
      	firstRank
      }
      movements {
      	id
      	name
      	description
      	firstRank
      }
      turns {
      	id
      	name
      	description
      	firstRank
      }
      katas {
      	id
      	name
      	firstRank
      	orderedMoves {
      		id
      		name
      		orderedSteps {
      			id
      			name
      			technique {
      				id
      				name
      			}
      		}
      	}
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
		<div style={style} /*style={style2}*/ /*className={classes.root}*/>
			<Grid style={style2} container spacing={3}>
				<Grid item sm={12}>
					<RankSelect rankID={rankID} setRankID={setRankID} />
				</Grid>
			</Grid>
				
				{data.Rank.map(r => {
					return (

						<Grid container spacing={3} key={r.id}>

							{r.strikes.length > 0 && 
								<Grid item sm={12}>
									<Paper elevation={2}>
										<Typography variant="h3">Strikes</Typography>
										<List>
										{r.strikes.map(s => {
											return (
												<ListItem key={s.id}>
													<ListItemText
														primary={s.name}
														secondary={ s.firstRank === r.id ? s.description : null }
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
										<Typography variant="h3">Blocks</Typography>
										{r.blocks.map(b => {
											return (
												<ListItem key={b.id}>
													<ListItemText
														primary={b.name}
														secondary={ b.firstRank === r.id ? b.description : null }
													/>
												</ListItem>
											);
										})}
									</Paper>
								</Grid>
							}

							{r.kicks.length > 0 && 
								<Grid item sm={12}>
									<Paper elevation={2}>
										<Typography variant="h3">Kicks</Typography>
										{r.kicks.map(k => {
											return (
												<ListItem key={k.id}>
													<ListItemText
														primary={k.name}
														secondary={ k.firstRank === r.id ? k.description : null }
													/>
												</ListItem>
											);
										})}
									</Paper>
								</Grid>
							}

							{r.stances.length > 0 && 
								<Grid item sm={12}>
									<Paper elevation={2}>
										<Typography variant="h3">Stances</Typography>
										{r.stances.map(s => {
											return (
												<ListItem key={s.id}>
													<ListItemText
														primary={s.name}
														secondary={ s.firstRank === r.id ? s.description : null }
													/>
												</ListItem>
											);
										})}
									</Paper>
								</Grid>
							}

							{r.movements.length > 0 && 
								<Grid item sm={12}>
									<Paper elevation={2}>
										<Typography variant="h3">Movements</Typography>
										{r.movements.map(m => {
											return (
												<ListItem key={m.id}>
													<ListItemText
														primary={m.name}
														secondary={ m.firstRank === r.id ? m.description : null }
													/>
												</ListItem>
											);
										})}
									</Paper>
								</Grid>
							}

							{r.turns.length > 0 && 
								<Grid item sm={12}>
									<Paper elevation={2}>
										<Typography variant="h3">Turns</Typography>
										{r.turns.map(t => {
											return (
												<ListItem key={t.id}>
													<ListItemText
														primary={t.name}
														secondary={ t.firstRank === r.id ? t.description : null }
													/>
												</ListItem>
											);
										})}
									</Paper>
								</Grid>
							}

							{r.katas.length > 0 && 
								<Grid item sm={12}>
									<Paper elevation={2}>
										<Typography variant="h3">Katas</Typography>
										{r.katas.map(k => {
											return (
												<List>
												<ListItem key={k.id}>
													<ListItemText
														primary={k.name}
													/>
												</ListItem>
											 	<List component="div">
													{ k.firstRank === r.id && k.orderedMoves.map( (move,index) => {
														return(
															<ListItem key={move.id}>
																<ListItemText
																	secondary={index+1 + ". " + move.orderedSteps.map(os => {return os.technique.name }).flat(2).join(', ')}
																/>
															}
															</ListItem>
														);
													})}
												</List>
											</List>		
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
