import React, {useEffect, useState} from "react";
import {
  Collapse,
  Grid,
  ListItem,
  ListItemText, makeStyles,
  Typography
} from "@material-ui/core";
import {ExpandLess, ExpandMore} from '@material-ui/icons';
import {useStatusState} from "./StatusContext";
import ShowKnob from "./ShowKnob";
import axios from "axios";
import {withSnackbar} from "notistack";

const useStyles = makeStyles(theme => ({
  grid: {
    padding: theme.spacing(2),
  },
}));

function PlayingSettingsComponent(props) {
  const classes = useStyles();
  const {show, showKnobs} = useStatusState();
  const [open, setOpen] = useState(true);

  const handleClick = () => {
    setOpen(!open);
  };

  const changeCallback = (show, name) => {
    return async (value) => {
      try {
        await axios.post('show_knob', {
          show: show,
          name: name,
          value: value,
        });
      } catch (err) {
        props.enqueueSnackbar(`Error adjusting show ${show} value ${name}: ${err.message}`,
          {variant: 'error'});
      }
    };
  };

  if (showKnobs.length === 0) {
    return <div></div>;
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
          {
            showKnobs.map(knob =>
              <ShowKnob show={show} onChange={changeCallback(show, knob.name)} {...knob} />)
          }
        </Grid>
      </Collapse>
    </>
  );
}

export default withSnackbar(PlayingSettingsComponent);