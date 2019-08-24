import React, { useEffect, useState } from "react";
import axios from "axios";
import { Box, Slider, Typography } from "@material-ui/core";
import { withSnackbar } from "notistack";

function ShowCycleComponent(props) {
  const [cycleSeconds, setCycleSeconds] = useState(60);

  const getCycleSeconds = async () => {
    try {
      const response = await axios.get('cycle_time');
      setCycleSeconds(response.data.value);
    } catch (err) {
      console.error(`Error fetching show cycle time: ${err.message}`);
    }
  };

  // Loads initial cycleSeconds once.
  useEffect(() => {
    axios.get('cycle_time').then((resp) => setCycleSeconds(resp.data.value));
  }, []);

  const errorMessage = (message) => {
    props.enqueueSnackbar(message, {variant: 'error'});
  };

  const handleChange = async (event, value) => {
    try {
      await axios.post('cycle_time', {value: value});
      await getCycleSeconds();
    } catch(err) {
      errorMessage(`Error adjusting show cycle time: ${err.message}`);
    }
  };

  return (
    <Box mb={2}>
      <Typography gutterBottom>
        Show duration (s)
      </Typography>
      <Slider
        defaultValue={cycleSeconds}
        onChangeCommitted={handleChange}
        valueLabelDisplay="auto"
        step={10}
        marks
        min={10}
        max={120}
      />
    </Box>
  );
}

export default withSnackbar(ShowCycleComponent);
