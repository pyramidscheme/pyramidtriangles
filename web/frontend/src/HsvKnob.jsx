import React, { useState } from "react";
import { Button, Card, CardActions, CardContent, makeStyles, Typography } from "@material-ui/core";
import { ChromePicker } from "react-color";
import { hsl2hsv, hsv2hsl } from "./hsl2hsv";
import axios from "axios";
import { withSnackbar } from "notistack";

const useStyles = makeStyles(theme => ({
  root: {
    display: 'flex',
    alignItems: 'center',
    flexDirection: 'column',
    maxWidth: 280,
    margin: theme.spacing(1),
  },
  title: {
    alignItems: 'left',
  },
  picker: {
    marginTop: theme.spacing(1),
  },
}));

function HsvKnob(props) {
  const {show, name, value} = props;
  const classes = useStyles();

  // Unfortunately the picker uses HSL so we convert before/after.
  const def = value.default;
  const [h, s, l] = hsv2hsl(def.h, def.s, def.v);
  const [pickerColor, setPickerColor] = useState({
    h: h * 360.0,
    s: s,
    l: l,
  });
  const [backgroundColor, setBackgroundColor] = useState(`hsl(${h*360.0},${s*100}%,${l*100}%)`);

  const errorMessage = (message) => {
    props.enqueueSnackbar(message, {variant: 'error'});
  };

  const submitColorChange = async () => {
    const [h, s, v] = hsl2hsv(pickerColor.h / 360.0, pickerColor.s, pickerColor.l);

    try {
      await axios.post('show_knob', {
        show: show,
        name: name,
        value: {h: h, s: s, v: v},
      });
    } catch (err) {
      errorMessage(`Error adjusting show ${show} color ${name}: ${err.message}`);
    }
  };

  return (
    <Card className={classes.root} style={{ backgroundColor: backgroundColor}}>
      <CardContent>
        <Typography className={classes.title} gutterBottom>
          {name}
        </Typography>

        <ChromePicker
          className={classes.picker}
          disableAlpha
          color={pickerColor}
          onChangeComplete={(color) => {
            setPickerColor(color.hsl);
            setBackgroundColor(color.hex);
          }}
        />
      </CardContent>
      <CardActions>
        <Button variant="contained" onClick={submitColorChange}>
          Set Color
        </Button>
      </CardActions>
    </Card>
  );
}

export default withSnackbar(HsvKnob);