import React from "react";
import { Slider, Typography } from "@material-ui/core";

export default function ValueKnob({name, value, onChange}) {
  const {min, max, step} = value;
  const defaultValue = value.default;

  return (
    <>
      <Typography gutterBottom>
        {name}
      </Typography>

      <Slider
        defaultValue={defaultValue}
        onChangeCommitted={(e, value) => onChange(value)}
        valueLabelDisplay="auto"
        step={step}
        marks
        min={min}
        max={max}
      />
    </>
  );
}