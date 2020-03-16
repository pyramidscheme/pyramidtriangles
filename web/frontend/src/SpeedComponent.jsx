import React, { useEffect, useState } from "react";
import { Box, Slider, Typography } from "@material-ui/core";
import axios from "axios";
import { withSnackbar } from "notistack";

function SpeedComponent(props) {
  const [speed, setSpeed] = useState(1.0);

  const errorMessage = (message) => {
    props.enqueueSnackbar(message, {variant: 'error'});
  };

  const getSpeed = async () => {
    try {
      const response = await axios.get('speed');
      setSpeed(response.data.value);
    } catch(err) {
      errorMessage(`Error requesting speed: ${err.message}`);
    }
  };

  // Load initial speed once.
  useEffect(() => {
    axios.get('speed').then((resp) => setSpeed(resp.data.value));
  }, []);

  const handleChange = async (event, value) => {
    try {
      await axios.post('speed', {value: value});
      getSpeed().then();
    } catch(err) {
      errorMessage(`Error adjusting speed: ${err.message}`);
    }
  };

  return (
    <Box mb={2}>
      <Typography gutterBottom>
        Speed Multiplier (lower is faster)
      </Typography>
      <Slider
        defaultValue={speed}
        onChangeCommitted={handleChange}
        valueLabelDisplay="auto"
        step={0.25}
        marks
        min={0.5}
        max={2.0}
      />
    </Box>
  );
}

export default withSnackbar(SpeedComponent);
