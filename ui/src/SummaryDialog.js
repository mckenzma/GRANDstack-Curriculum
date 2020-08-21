import React, { useState } from "react";
import { withStyles } from "@material-ui/core/styles";

// Material UI components
import Dialog from "@material-ui/core/Dialog";
import MuiDialogTitle from "@material-ui/core/DialogTitle";
import MuiDialogContent from "@material-ui/core/DialogContent";
import IconButton from "@material-ui/core/IconButton";
import CloseIcon from "@material-ui/icons/Close";
import Typography from "@material-ui/core/Typography";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";

import AssessmentIcon from '@material-ui/icons/Assessment';

import Grid from '@material-ui/core/Grid';

import StackedBarChart_TechniqueCountByTypeByRank from "./StackedBarChart_TechniqueCountByTypeByRank";
import HeatmapChart_TechniqueCountByRankByType from "./HeatmapChart_TechniqueCountByRankByType";
import HeatChart_TechniqueByRankByType from './HeatChart_TechniqueByRankByType';

const DialogTitle = withStyles(theme => ({
  root: {
    borderBottom: `1px solid ${theme.palette.divider}`,
    margin: 0,
    padding: theme.spacing(2)
  },
  closeButton: {
    position: "absolute",
    right: theme.spacing(1),
    top: theme.spacing(1),
    color: theme.palette.grey[500]
  }
}))(props => {
  const { children, classes, onClose } = props;
  return (
    <MuiDialogTitle disableTypography className={classes.root}>
      <Typography>{children}</Typography>
      {onClose ? (
        <IconButton
          aria-label="Close"
          className={classes.closeButton}
          onClick={onClose}
        >
          <CloseIcon />
        </IconButton>
      ) : null}
    </MuiDialogTitle>
  );
});

const DialogContent = withStyles(theme => ({
  root: {
    margin: 0,
    padding: theme.spacing(2)
  }
}))(MuiDialogContent);

export default function SummaryDialog() {
  const [open, setOpen] = useState(false);

  const handleClickOpen = event => {
    setOpen(true);
  };

  const handleClose = event => {
    setOpen(false);
  };

  return (
    // use react fragment here in stead of div
    <div>
      <ListItem button variant="outlined"
        color="secondary"
        onClick={handleClickOpen}>
          <ListItemIcon>
            <AssessmentIcon />
          </ListItemIcon>
          <ListItemText primary="Technique Analysis" />
        </ListItem>
      <Dialog
        fullWidth={true}
        maxWidth={'xl'}
        onClose={handleClose}
        aria-labelledby="customized-dialog-title"
        open={open}
      >
        <DialogTitle id="customized-dialog-title" onClose={handleClose}>
          Technique Summary
        </DialogTitle>
        <DialogContent>
          <Grid container /*spacing={10}*/>
            <Grid item xs={12} md={6}>
              {/*<GraphSummaryRelationships />*/}
              <StackedBarChart_TechniqueCountByTypeByRank />
            </Grid>
            <Grid item xs={12} md={6}>
              {/*<GraphSummaryRelationships />*/}
              <HeatmapChart_TechniqueCountByRankByType />
            </Grid>
            <Grid item xs={12} md={12}>
              <HeatChart_TechniqueByRankByType label={"Block"}/>
            </Grid>
            <Grid item xs={12} md={12}>
              <HeatChart_TechniqueByRankByType label={"Strike"}/>
            </Grid>
            <Grid item xs={12} md={12}>
              <HeatChart_TechniqueByRankByType label={"Kick"}/>
            </Grid>
            <Grid item xs={12} md={12}>
              <HeatChart_TechniqueByRankByType label={"Stance"}/>
            </Grid>
            <Grid item xs={12} md={12}>
              <HeatChart_TechniqueByRankByType label={"Movement"}/>
            </Grid>
            <Grid item xs={12} md={12}>
              <HeatChart_TechniqueByRankByType label={"Turn"}/>
            </Grid>
            <Grid item xs={12} md={12}>
              <HeatChart_TechniqueByRankByType label={"Kata"}/>
            </Grid>
          </Grid>
        </DialogContent>
      </Dialog>
    </div>
  );
}
