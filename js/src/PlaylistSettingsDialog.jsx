import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  makeStyles,
} from "@material-ui/core";
import ShowKnob from "./ShowKnob";

const useStyles = makeStyles((theme) => ({
  grid: {
    padding: theme.spacing(2),
  },
}));

export default function PlaylistSettingsDialog({
  entryId,
  show,
  open,
  setOpen,
  showKnobs,
}) {
  const classes = useStyles();
  const [setting, setSetting] = useState({});

  const handleClose = () => {
    setOpen(false);
  };

  // Get the settings once after loading.
  useEffect(() => {
    axios
      .get(`playlist/entries/${entryId}`)
      .then((resp) => setSetting(resp.data));
  }, [entryId]);

  const changeCallback = (name) => {
    return async (value) => {
      const newSetting = { [name]: value };
      await axios.put(`playlist/entries/${entryId}`, newSetting);
      setSetting((oldSetting) => Object.assign(oldSetting, newSetting));
    };
  };

  return (
    <Dialog onClose={handleClose} open={open}>
      <DialogTitle onClose={handleClose}>Settings for {show}</DialogTitle>
      <DialogContent>
        <Grid
          className={classes.grid}
          container
          direction="column"
          justify="center"
        >
          {showKnobs.map((knob) => {
            // Use a playlist setting over a default.
            if (
              setting.hasOwnProperty(knob.name) &&
              knob.value.default !== setting[knob.name]
            ) {
              knob.value.default = setting[knob.name];
            }
            return <ShowKnob key={`playlist${knob.name}`} onChange={changeCallback(knob.name)} {...knob} />;
          })}
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button autoFocus onClick={handleClose}>
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
}
