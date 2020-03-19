import React, {useState} from "react";
import {
  Collapse,
  Grid,
  ListItem,
  ListItemText, makeStyles,
  Typography
} from "@material-ui/core";
import {ExpandLess, ExpandMore} from '@material-ui/icons';
import HsvKnob from "./HsvKnob";
import ValueKnob from "./ValueKnob";
import { useStatusState } from "./StatusContext";

const useStyles = makeStyles(theme => ({
  grid: {
    padding: theme.spacing(2),
  },
}));

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
  const classes = useStyles();
  const {show, showKnobs} = useStatusState();
  const [open, setOpen] = useState(true);

  const handleClick = () => {
    setOpen(!open);
  };

  return (
    <>
      <ListItem button onClick={handleClick}>
        <ListItemText>
          <Typography variant="h5">{show} Show Settings</Typography>
        </ListItemText>
        {open ? <ExpandLess /> : <ExpandMore />}
      </ListItem>
      <Collapse in={open} timeout="auto" unmountOnExit>
        <Grid
          className={classes.grid}
          container
          direction="column"
          justify="center"
        >
          { Array.isArray(showKnobs) && showKnobs.length
              ? showKnobs.map(knob => <ShowKnob show={show} {...knob} />)
              : <em>{show} has no knobs to fiddle</em>
          }
        </Grid>
      </Collapse>
    </>
  );
}
