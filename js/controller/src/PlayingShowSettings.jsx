import React, { useState } from "react";
import {
  Box,
  Collapse,
  Grid,
  ListItem,
  ListItemText,
  makeStyles,
  Typography,
} from "@material-ui/core";
import { ExpandLess, ExpandMore } from "@material-ui/icons";
import { usePlayingStatus } from "./StatusContext";
import ShowKnob from "./ShowKnob";
import axios from "axios";

const useStyles = makeStyles((theme) => ({
  grid: {
    padding: theme.spacing(2),
  },
}));

export default function PlayingShowSettings() {
  const classes = useStyles();
  const { show, showKnobs } = usePlayingStatus();
  const [open, setOpen] = useState(true);

  const handleClick = () => {
    setOpen(open => !open);
  };

  const changeCallback = (show, name) => {
    return async (value) => {
      await axios.post("show_knob", {
        show: show,
        name: name,
        value: value,
      });
    };
  };

  if (showKnobs.length === 0) {
    return <></>;
  }

  return (
    <>
      <ListItem button onClick={handleClick}>
        <ListItemText>
          <Typography variant="h5">Now Playing - {show}</Typography>
        </ListItemText>
        {open ? <ExpandLess /> : <ExpandMore />}
      </ListItem>

      <Collapse in={open} timeout="auto">
        <Grid
          className={classes.grid}
          container
          direction="column"
          justify="center"
        >
          <Box paddingBottom={2}>
            <Typography variant="subtitle2">
              <em>Note: affects running show and choices are not saved</em>
            </Typography>
          </Box>

          {showKnobs.map((knob) => (
            <ShowKnob key={`playing${knob.name}`} onChange={changeCallback(show, knob.name)} {...knob} />
          ))}
        </Grid>
      </Collapse>
    </>
  );
}
