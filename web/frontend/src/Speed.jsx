import React, { useEffect, useState } from "react";
import { Box, Slider, Typography } from "@material-ui/core";
import axios from "axios";

export default function Speed() {
  const [speed, setSpeed] = useState(1.0);

  // Load initial speed once.
  useEffect(() => {
    axios.get('speed').then((resp) => setSpeed(resp.data.value));
  }, []);

  const handleChange = (event, value) => {
    setSpeed(value);
  };

  const handleChangeCommitted = async (event, value) => {
    await axios.post('speed', {value: value});
  };

  return (
    <Box marginBottom={2}>
      <Typography gutterBottom>
        Speed Multiplier (lower is faster)
      </Typography>
      <Slider
        value={speed}
        onChange={handleChange}
        onChangeCommitted={handleChangeCommitted}
        valueLabelDisplay="auto"
        step={0.25}
        marks
        min={0.5}
        max={2.0}
      />
    </Box>
  );
};
