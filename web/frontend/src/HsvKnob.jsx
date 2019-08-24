import React, { useState } from "react";
import {Box, Button, Typography} from "@material-ui/core";
import { ChromePicker } from "react-color";
import { hsl2hsv, hsv2hsl } from "./hsl2hsv";
import axios from "axios";
import { withSnackbar } from "notistack";

function HsvKnob(props) {
  const {show, name, value} = props;

  // Unfortunately the picker uses HSL so we convert before/after.
  const def = value.default;
  const [h, s, l] = hsv2hsl(def.h, def.s, def.v);
  const [pickerColor, setPickerColor] = useState({
    h: h * 360.0,
    s: s,
    l: l,
  });

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
    <>
      <Typography gutterBottom>
        {name}
      </Typography>

      <Box display="flex" alignItems="center">
        <ChromePicker
          color={pickerColor}
          onChangeComplete={(color) => setPickerColor(color.hsl)}
        />
        <Box m={2}>
          <Button variant="contained" onClick={submitColorChange}>
            Set Color
          </Button>
        </Box>
      </Box>
    </>
  );
}

export default withSnackbar(HsvKnob);