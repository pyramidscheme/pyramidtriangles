import React, { useEffect } from "react";
import {
  Button,
  ExpansionPanel, ExpansionPanelDetails, ExpansionPanelSummary,
  IconButton,
  List, ListItem, ListItemIcon, ListItemText,
  Typography
} from "@material-ui/core";
import DeleteIcon from '@material-ui/icons/Delete';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
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

  const playlistEntry = (entry, index) => {
    const [id, show] = entry;

    return (
      <ListItem color="primary">
        <ListItemText primary={`${index + 1}. ${show}`} />

        <ListItemIcon>
          <IconButton onClick={() => clickRemove(id)}>
            <DeleteIcon />
          </IconButton>
        </ListItemIcon>
      </ListItem>
    );
  };

  const playlist = usePlaylistState();

  return (
    <ExpansionPanel defaultExpanded>
      <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
        <Typography variant="h5">Playlist</Typography>
      </ExpansionPanelSummary>

      <ExpansionPanelDetails>
        <div>
          { playlist.length !== 0
            ? <Button variant="contained" onClick={clickClear}>Clear</Button>
            : null
          }

          <List style={{listStyle: 'none'}} dense>
            {playlist.map(playlistEntry)}
          </List>
        </div>
      </ExpansionPanelDetails>
    </ExpansionPanel>
  );
}

export default withSnackbar(PlaylistComponent);