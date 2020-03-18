import React, { useEffect } from "react";
import {
  Box,
  Button,
  ExpansionPanel, ExpansionPanelDetails, ExpansionPanelSummary, Grid,
  IconButton,
  List, ListItem, ListItemIcon, ListItemText,
  Typography
} from "@material-ui/core";
import DeleteIcon from '@material-ui/icons/Delete';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import PlayArrowIcon from '@material-ui/icons/PlayArrow';
import { usePlaylistState, useSetPlaylist } from "./PlaylistContext";
import {clearPlaylist, deleteFromPlaylist, updatePlaylist} from "./PlaylistActions";
import { withSnackbar } from "notistack";

function PlaylistComponent(props) {
  const setPlaylist = useSetPlaylist();

  useEffect(() => {
    // Get playlist from the server initially.
    updatePlaylist(setPlaylist).then();

    // Every 5 seconds, updates the current playlist from the server.
    const interval = setInterval(
      () => updatePlaylist(setPlaylist),
      5000);
    return () => clearInterval(interval);
  }, [setPlaylist]);

  const clickClear = async () => {
    try {
      await clearPlaylist(setPlaylist);
    } catch (err) {
      props.enqueueSnackbar(`Error clearing running shows: ${err.message}`, {
        variant: 'error',
      });
    }
  };

  const clickRemove = async (entryId) => {
    try {
      await deleteFromPlaylist(setPlaylist, entryId);
    } catch (err) {
      props.enqueueSnackbar(`Error removing from playlist: ${err.message}`, {
        variant: 'error',
      });
    }
  };

  const {playlist, playing} = usePlaylistState();

  let items = [];
  // Loop to create a list entry for each playlist show.
  playlist.forEach(([id, show]) => items.push(
      <ListItem
        color="primary"
        divider
        selected={playing === id}
      >
        { // PlayArrow icon for currently playing show.
          playing === id ?
          <ListItemIcon>
            <PlayArrowIcon />
          </ListItemIcon>
          : ''
        }

        <ListItemText
          // Inset item if another playlist entry is playing.
          inset={playing && playing !== id}
          primary={show}
        />

        <ListItemIcon>
          <IconButton onClick={() => clickRemove(id)}>
            <DeleteIcon />
          </IconButton>
        </ListItemIcon>
      </ListItem>
  ));

  return (
    <ExpansionPanel defaultExpanded>
      <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
        <Typography variant="h5">Playlist</Typography>
      </ExpansionPanelSummary>

      <ExpansionPanelDetails>
        <Grid
          container
          direction="column"
          justify="center"
        >
          {
            Array.isArray(playlist) && playlist.length
              ? <Box marginBottom={2}>
                  <Button variant="contained" onClick={clickClear}>Clear Playlist</Button>
                </Box>
              : <em>empty</em>
          }

          <List dense>
            {items}
          </List>
        </Grid>
      </ExpansionPanelDetails>
    </ExpansionPanel>
  );
}

export default withSnackbar(PlaylistComponent);