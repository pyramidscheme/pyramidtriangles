import React, { useState } from "react";
import {
  Collapse,
  ListItem,
  ListItemText,
  Grid,
  makeStyles,
  Typography,
} from "@material-ui/core";
import { ExpandLess, ExpandMore } from "@material-ui/icons";
import Brightness from "./Brightness";
import ShowCycle from "./ShowCycle";
import Speed from "./Speed";

const useStyles = makeStyles((theme) => ({
  grid: {
    padding: theme.spacing(2),
  },
}));

export default function GlobalSettings() {
  const classes = useStyles();
  const [open, setOpen] = useState(true);

  const handleClick = () => {
    setOpen(open => !open);
  };

  return (
    <>
      <ListItem button onClick={handleClick}>
        <ListItemText>
          <Typography variant="h5">Global Settings</Typography>
        </ListItemText>
        {open ? <ExpandLess /> : <ExpandMore />}
      </ListItem>
      <Collapse in={open} timeout="auto">
        <Grid
          className={classes.grid}
          container
          direction="column"
          justify="center"
        >
          <Brightness />
          <ShowCycle />
          <Speed />
        </Grid>
      </Collapse>
    </>
  );
}
