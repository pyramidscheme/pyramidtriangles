import React, { useEffect, useState } from "react";
import { Box, Slider, Typography } from "@material-ui/core";
import axios from "axios";

export default function Brightness() {
  const [brightness, setBrightness] = useState(100);

  // Loads initial brightness once.
  useEffect(() => {
    axios.get("brightness").then((resp) => setBrightness(resp.data.data));
  }, []);

  const handleClick = (event, value) => {
    setBrightness(value);
  };

  const handleChange = async (event, value) => {
    await axios.post("brightness", { data: value });
  };

  return (
    <Box marginBottom={2}>
      <Typography gutterBottom>Brightness</Typography>
      <Slider
        value={brightness}
        onChange={handleClick}
        onChangeCommitted={handleChange}
        valueLabelDisplay="auto"
        min={0}
        max={100}
      />
    </Box>
  );
}
