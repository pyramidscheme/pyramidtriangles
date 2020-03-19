import React, {useState} from "react";
import {Collapse, ListItem, ListItemText, Grid, makeStyles, Typography} from "@material-ui/core";
import {ExpandLess, ExpandMore} from '@material-ui/icons';
import BrightnessComponent from "./BrightnessComponent";
import ShowCycleComponent from "./ShowCycleComponent";
import SpeedComponent from "./SpeedComponent";

const useStyles = makeStyles(theme => ({
  grid: {
    padding: theme.spacing(2),
  },
}));

export default function GlobalSettingsComponent() {
  const classes = useStyles();
  const [open, setOpen] = useState(true);

  const handleClick = () => {
    setOpen(!open);
  };

  return (
    <>
      <ListItem button onClick={handleClick}>
        <ListItemText>
          <Typography variant="h5">Global Settings</Typography>
        </ListItemText>
        {open ? <ExpandLess /> : <ExpandMore />}
      </ListItem>
      <Collapse in={open} timeout="auto" unmountOnExit>
        <Grid
          className={classes.grid}
          container
          direction="column"
          justify="center"
        >
          <BrightnessComponent />
          <ShowCycleComponent />
          <SpeedComponent />
        </Grid>
      </Collapse>
    </>
  );
}