import React, { useEffect, useState } from "react";
import { Box, Slider, Typography } from "@material-ui/core";
import axios from "axios";
import { withSnackbar } from "notistack";

function SpeedComponent(props) {
  const [speed, setSpeed] = useState(1.0);

  // Load initial speed once.
  useEffect(() => {
    axios.get('speed').then((resp) => setSpeed(resp.data.value));
  }, []);

  const handleChange = async (event, value) => {
    try {
      await axios.post('speed', {value: value});
    } catch(err) {
      props.enqueueSnackbar(`Error adjusting speed: ${err.message}`, {variant: 'error'});
    }
  };

  return (
    <Box marginBottom={2}>
      <Typography gutterBottom>
        Speed Multiplier (lower is faster)
      </Typography>
      <Slider
        value={speed}
        onChange={(event, value) => setSpeed(value)}
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
