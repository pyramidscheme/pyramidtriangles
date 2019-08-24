import React from 'react';
import { AppBar, Box, Grid, makeStyles, Paper, Toolbar, Typography } from "@material-ui/core";
import './App.css';
import { StatusProvider } from "./StatusContext";
import StatusComponent from "./StatusComponent";
import ShowSelectorComponent from "./ShowSelectorComponent";
import PlaylistComponent from "./PlaylistComponent";
import GlobalSettingsComponent from "./GlobalSettingsComponent";
import ShowSettingsComponent from "./ShowSettingsComponent";
import {PlaylistProvider} from "./PlaylistContext";

const useStyles = makeStyles(theme => ({
  showSelector: {
    margin: 10,
    padding: theme.spacing(2),
  },
  settings: {
    margin: 10,
  },
}));

export default function App() {
  const classes = useStyles();

  return (
    <PlaylistProvider>
      <StatusProvider>
        <Box flexGrow={1}>
          <AppBar position="static">
            <Toolbar>
              <Typography variant="h6">
                Triangle Shows | <StatusComponent />
              </Typography>
            </Toolbar>
          </AppBar>

          <Grid container spacing={3}>
            <Grid item xs={6}>
              <Paper className={classes.showSelector}>
                <ShowSelectorComponent />
              </Paper>
            </Grid>

            <Grid item xs={6}>
              <Paper className={classes.settings}>
                <PlaylistComponent />
                <GlobalSettingsComponent />
                <ShowSettingsComponent />
              </Paper>
            </Grid>
          </Grid>
        </Box>
      </StatusProvider>
    </PlaylistProvider>
  );
}
