import React from 'react';
import './App.css';
import {AppBar, Grid, makeStyles, Paper, Toolbar, Typography} from "@material-ui/core";
import {ThemeProvider} from "@material-ui/core/styles";
import GlobalSettings from "./GlobalSettings";
import Playlist from "./Playlist";
import {PlaylistProvider} from "./PlaylistContext";
import ShowSelector from "./ShowSelector";
import PlayingSettings from "./PlayingShowSettings";
import Status from "./Status";
import {StatusProvider} from "./StatusContext";
import {theme} from "./Theme";

const useStyles = makeStyles(theme => ({
  container: {
    background: theme.background,
  },
  showSelector: {
    margin: 10,
    padding: theme.spacing(2),
  },
  settings: {
    margin: 10,
  },
}));

const Layout = () => {
  const classes = useStyles();

  return (
    <>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6">
            Triangle Shows | <Status />
          </Typography>
        </Toolbar>
      </AppBar>

      <Grid container className={classes.container}>
        <Grid item xs={6}>
          <Paper className={classes.showSelector}>
            <ShowSelector />
          </Paper>
        </Grid>

        <Grid item xs={6}>
          <Paper className={classes.settings}>
            <GlobalSettings />
          </Paper>
          <Paper className={classes.settings}>
            <Playlist />
          </Paper>
          <Paper className={classes.settings}>
            <PlayingSettings />
          </Paper>
        </Grid>
      </Grid>
    </>
  );
};

export default function App() {
  // Sets up react Providers to supply context (e.g. theme, 'status' endpoint state, and 'playlist' endpoint state).
  return (
    <ThemeProvider theme={theme}>
      <PlaylistProvider>
        <StatusProvider>
          <Layout />
        </StatusProvider>
      </PlaylistProvider>
    </ThemeProvider>
  );
}
