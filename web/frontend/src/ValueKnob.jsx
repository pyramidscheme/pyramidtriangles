import React from "react";
import { Slider, Typography } from "@material-ui/core";

export default function ValueKnob({name, value, onChange}) {
  const {min, max, step} = value;
  const defaultValue = value.default;

  const handleChangeCommitted = (event, value) => {
    onChange(value);
  };

  return (
    <>
      <Typography gutterBottom>
        {name}
      </Typography>

      <Slider
        defaultValue={defaultValue}
        onChangeCommitted={handleChangeCommitted}
        valueLabelDisplay="auto"
        step={step}
        marks
        min={min}
        max={max}
      />
    </>
  );
}