import React, { useEffect, useState } from "react";
import axios from "axios";
import { Box, Slider, Typography } from "@material-ui/core";

export default function ShowCycle() {
  const [cycleSeconds, setCycleSeconds] = useState(60);

  // Loads initial cycleSeconds once.
  useEffect(() => {
    axios.get('cycle_time').then((resp) => setCycleSeconds(resp.data.value));
  }, []);

  const handleChange = (event, value) => {
    setCycleSeconds(value);
  };

  const handleChangeCommitted = async (event, value) => {
    await axios.post('cycle_time', {value: value});
  };

  return (
    <Box marginBottom={2}>
      <Typography gutterBottom>
        Show duration (s)
      </Typography>
      <Slider
        value={cycleSeconds}
        onChange={handleChange}
        onChangeCommitted={handleChangeCommitted}
        valueLabelDisplay="auto"
        step={10}
        marks
        min={10}
        max={120}
      />
    </Box>
  );
};