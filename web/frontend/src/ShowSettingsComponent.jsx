import React from "react";
import {ExpansionPanel, ExpansionPanelDetails, ExpansionPanelSummary, Grid, Typography} from "@material-ui/core";
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import HsvKnob from "./HsvKnob";
import ValueKnob from "./ValueKnob";
import { useStatusState } from "./StatusContext";

function ShowKnob(props) {
  const {show, type, name} = props;

  switch (type) {
    case 'HSVKnob':
      return <HsvKnob {...props} />;
    case 'ValueKnob':
      return <ValueKnob {...props} />;
    default:
      throw new Error(`Unrecognized knob (${show},${name}) of type ${type}`);
  }
}

export default function ShowSettingsComponent() {
  const {show, showKnobs} = useStatusState();

  return (
    <ExpansionPanel defaultExpanded>
      <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
        <Typography variant="h5">{show} Show Settings</Typography>
      </ExpansionPanelSummary>

      <ExpansionPanelDetails>
        { Array.isArray(showKnobs) && showKnobs.length
          ? <Grid
              container
              direction="column"
              justify="center"
            >
              {showKnobs.map(knob =>
                <ShowKnob show={show} {...knob} />)
              }
            </Grid>

          : <em>{show} has no knobs to fiddle</em>
        }
      </ExpansionPanelDetails>
    </ExpansionPanel>
  );
}
