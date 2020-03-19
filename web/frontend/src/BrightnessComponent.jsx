import React, { useEffect, useState } from "react";
import { Box, Slider, Typography } from "@material-ui/core";
import axios from "axios";
import { withSnackbar } from "notistack";

function BrightnessComponent(props) {
  const [brightness, setBrightness] = useState(100);

  const getBrightness = async () => {
    try {
      const response = await axios.get('brightness');
      setBrightness(response.data.value);
    } catch (err) {
      console.error(`Error adjusting brightness: ${err.message}`);
    }
  };

  // Loads initial brightness once.
  useEffect(() => {
    axios.get('brightness').then((resp) => setBrightness(resp.data.value));
  }, []);

  const errorMessage = (message) => {
    props.enqueueSnackbar(message, {variant: "error"});
  };

  const handleChange = async (event, value) => {
    try {
      await axios.post('brightness', {value: value});
      getBrightness().then();
    } catch(err) {
      errorMessage(`Error adjusting brightness: ${err.message}`);
    }
  };

  return (
    <Box marginBottom={2}>
      <Typography gutterBottom>
        Brightness
      </Typography>
      <Slider
        defaultValue={brightness}
        onChangeCommitted={handleChange}
        min={0}
        max={100}
        valueLabelDisplay="auto"
      />
    </Box>
  );
}

export default withSnackbar(BrightnessComponent);
