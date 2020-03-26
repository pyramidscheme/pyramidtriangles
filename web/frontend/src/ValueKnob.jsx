import React from "react";
import { Slider, Typography } from "@material-ui/core";
import axios from "axios";
import { withSnackbar } from "notistack";

function ValueKnob(props) {
  const {show, name, value} = props;
  const {min, max, step} = value;
  const defaultValue = value.default;

  const handleChange = async (event, value) => {
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

  return (
    <>
      <Typography gutterBottom>
        {name}
      </Typography>

      <Slider
        defaultValue={defaultValue}
        onChangeCommitted={handleChange}
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