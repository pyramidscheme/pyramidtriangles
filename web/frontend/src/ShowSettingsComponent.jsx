import React from "react";
import { ExpansionPanel, ExpansionPanelDetails, ExpansionPanelSummary, Typography } from "@material-ui/core";
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

function PanelContent({show, knobs}) {
  if (Array.isArray(knobs) && knobs.length) {
    return (
      <div>
        {knobs.map(knob => <ShowKnob show={show} {...knob} />)}
      </div>
    );
  }

  return <div>...{show} has no knobs to fiddle...</div>;
}

export default function ShowSettingsComponent() {
  const {show, showKnobs} = useStatusState();

  return (
    <ExpansionPanel defaultExpanded>
      <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
        <Typography variant="h5">{show} Settings</Typography>
      </ExpansionPanelSummary>

      <ExpansionPanelDetails>
        <PanelContent show={show} knobs={showKnobs} />
      </ExpansionPanelDetails>
    </ExpansionPanel>
  );
}
