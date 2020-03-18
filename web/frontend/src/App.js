import React from 'react';
import './App.css';
import {AppBar, Grid, makeStyles, Paper, Toolbar, Typography} from "@material-ui/core";
import {ThemeProvider} from "@material-ui/core/styles";
import GlobalSettingsComponent from "./GlobalSettingsComponent";
import PlaylistComponent from "./PlaylistComponent";
import {PlaylistProvider} from "./PlaylistContext";
import ShowSelectorComponent from "./ShowSelectorComponent";
import ShowSettingsComponent from "./ShowSettingsComponent";
import StatusComponent from "./StatusComponent";
import {StatusProvider} from "./StatusContext";
import {theme} from "./Theme";

const useStyles = makeStyles(theme => ({
  container: {
    background: '#2D0038',
  },
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
    <ThemeProvider theme={theme}>
      <PlaylistProvider>
        <StatusProvider>
          <AppBar position="static">
            <Toolbar>
              <Typography variant="h6">
                Triangle Shows | <StatusComponent />
              </Typography>
            </Toolbar>
          </AppBar>

          <Grid container className={classes.container}>
            <Grid item xs={6}>
              <Paper className={classes.showSelector}>
                <ShowSelectorComponent />
              </Paper>
            </Grid>

            <Grid item xs={6}>
              <Paper className={classes.settings}>
                <GlobalSettingsComponent />
                <PlaylistComponent />
                <ShowSettingsComponent />
              </Paper>
            </Grid>
          </Grid>
        </StatusProvider>
      </PlaylistProvider>
    </ThemeProvider>
  );
}
