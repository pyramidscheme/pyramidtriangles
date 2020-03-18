import React from "react";
import {ExpansionPanel, ExpansionPanelDetails, ExpansionPanelSummary, Grid, Typography} from "@material-ui/core";
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import BrightnessComponent from "./BrightnessComponent";
import ShowCycleComponent from "./ShowCycleComponent";
import SpeedComponent from "./SpeedComponent";

export default function GlobalSettingsComponent() {
  return (
    <ExpansionPanel defaultExpanded>
      <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
        <Typography variant="h5">Global Settings</Typography>
      </ExpansionPanelSummary>

      <ExpansionPanelDetails>
        <Grid
          container
          direction="column"
          justify="center"
        >
          <BrightnessComponent />
          <ShowCycleComponent />
          <SpeedComponent />
        </Grid>
      </ExpansionPanelDetails>
    </ExpansionPanel>
  );
}