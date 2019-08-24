import React, { useEffect } from "react";
import axios from "axios";
import {
  ExpansionPanel, ExpansionPanelDetails, ExpansionPanelSummary,
  IconButton,
  List, ListItem, ListItemIcon, ListItemText,
  Typography
} from "@material-ui/core";
import DeleteIcon from '@material-ui/icons/Delete';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import ShowClearerComponent from "./PlaylistClearComponent";
import {usePlaylistState, useSetPlaylist} from "./PlaylistContext";
import { deleteFromPlaylist, updatePlaylist } from "./PlaylistActions";
import { withSnackbar } from "notistack";

const updateSeconds = 5;

function PlaylistComponent(props) {
  const setPlaylist = useSetPlaylist();

  useEffect(() => {
    axios.get('playlist').then((resp) => setPlaylist(resp.data.playlist));
    const interval = setInterval(
      () => updatePlaylist(setPlaylist),
      updateSeconds * 1000);
    return () => clearInterval(interval);
  }, [setPlaylist]);

  const clickRemove = async (entry_id) => {
    try {
      await deleteFromPlaylist(setPlaylist, entry_id);
    } catch (err) {
      props.enqueueSnackbar(`Error removing from playlist: ${err.message}`, {
        variant: 'error',
      });
    }
  };

  const renderEntry = (entry) => {
    const [id, show] = entry;

    return (
      <ListItem color="primary">
        <ListItemText primary={show} />

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
    <ExpansionPanel>
      <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
        <Typography variant="h5">Playlist</Typography>
      </ExpansionPanelSummary>

      <ExpansionPanelDetails>
        <div>
          <ShowClearerComponent />

          <List style={{listStyle: 'none'}} dense>
            {playlist.map(entry => renderEntry(entry))}
          </List>
        </div>
      </ExpansionPanelDetails>
    </ExpansionPanel>
  );
}

export default withSnackbar(PlaylistComponent);