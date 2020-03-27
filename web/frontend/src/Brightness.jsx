import React, { useEffect, useState } from "react";
import { Box, Slider, Typography } from "@material-ui/core";
import axios from "axios";
import { withSnackbar } from "notistack";

function Brightness(props) {
  const [brightness, setBrightness] = useState(100);

  // Loads initial brightness once.
  useEffect(() => {
    axios.get('brightness').then((resp) => setBrightness(resp.data.value));
  }, []);

  const handleClick = (event, value) => {
    setBrightness(value);
  };

  const handleChange = async (event, value) => {
    try {
      await axios.post('brightness', {value: value});
    } catch(err) {
      props.enqueueSnackbar(`Error adjusting brightness: ${err.message}`, {variant: "error"});
    }
  };

  return (
    <Box marginBottom={2}>
      <Typography gutterBottom>
        Brightness
      </Typography>
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

export default withSnackbar(Brightness);
