import React from "react";
import { Slider, Typography } from "@material-ui/core";
import axios from "axios";
import { withSnackbar } from "notistack";

function ValueKnob(props) {
  const {show, name, value} = props;

  const errorMessage = (message) => {
    props.enqueueSnackbar(message, {variant: 'error'});
  };

  const handleValueChange = async (event, value) => {
    try {
      await axios.post('show_knob', {
        show: show,
        name: name,
        value: value,
      });
    } catch (err) {
      errorMessage(`Error adjusting show ${show} value ${name}: ${err.message}`);
    }
  };

  const {min, max, step} = value;
  const defaultValue = value.default;

  return (
    <>
      <Typography gutterBottom>
        {name}
      </Typography>

      <Slider
        defaultValue={defaultValue}
        onChangeCommitted={handleValueChange}
        valueLabelDisplay="auto"
        step={step}
        marks
        min={min}
        max={max}
      />
    </>
  );
}

export default withSnackbar(ValueKnob);