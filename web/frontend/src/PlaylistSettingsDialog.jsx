import React, {useEffect, useState} from "react";
import axios from "axios";
import {Button, Dialog, DialogActions, DialogContent, DialogTitle, Grid, makeStyles} from "@material-ui/core";
import ShowKnob from "./ShowKnob";
import {withSnackbar} from "notistack";

const useStyles = makeStyles(theme => ({
  grid: {
    padding: theme.spacing(2),
  },
}));

function PlaylistSettingsDialog(props) {
  const classes = useStyles();
  const {entryId, show} = props;

  // state callbacks passed from parent
  const {open, setOpen, showKnobs} = props;

  const [setting, setSetting] = useState({});

  const handleClose = () => {
    setOpen(false);
  };

  // Get the settings once after loading.
  useEffect(() => {
    axios.get(`playlist/entries/${entryId}`).then(resp => setSetting(resp.data));
  }, [entryId]);

  const errorMessage = (msg) => {
    props.enqueueSnackbar(msg, {variant: 'error'});
  };

  const changeCallback = (name) => {
    return async (value) => {
      try {
        const newSetting = {[name]: value};
        await axios.put(`playlist/entries/${entryId}`, newSetting);
        setSetting(oldSetting => {
          return {...oldSetting, ...newSetting};
        });
      } catch (err) {
        errorMessage(`Error sending settings for show: ${err.message}`);
      }
    };
  };

  return (
    <Dialog onClose={handleClose} open={open}>
      <DialogTitle onClose={handleClose}>
        Settings for {show}
      </DialogTitle>
      <DialogContent>
        <Grid
          className={classes.grid}
          container
          direction="column"
          justify="center"
        >
          {
            showKnobs.map(knob => {
              // Use a playlist setting over a default.
              if (setting.hasOwnProperty(knob.name) && knob.value.default !== setting[knob.name]) {
                knob.value.default = setting[knob.name];
              }
              return <ShowKnob show={show} onChange={changeCallback(knob.name)} {...knob} />
            })
          }
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

export default withSnackbar(PlaylistSettingsDialog);