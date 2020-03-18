import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  IconButton,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Typography
} from "@material-ui/core";
import PlayCircleOutlineIcon from '@material-ui/icons/PlayCircleOutline';
import PlaylistAddIcon from '@material-ui/icons/PlaylistAdd';
import { addToPlaylist } from "./PlaylistActions";
import { useSetPlaylist } from "./PlaylistContext";
import { useStatusRefresh } from "./StatusContext";
import { withSnackbar } from "notistack";

function ShowSelectorComponent(props) {
  const [shows, setShows] = useState([]);
  const setPlaylist = useSetPlaylist();
  const statusRefresh = useStatusRefresh();

  const updateShowList = async () => {
    const response = await axios.get('shows');
    setShows(response.data.shows);
  };

  const errorMessage = (message) => {
    props.enqueueSnackbar(message, {variant: 'error'});
  };

  useEffect(() => {
    // Get list of shows from server at startup.
    axios.get('shows').then((resp) => setShows(resp.data.shows));

    // Refresh list of shows from the server every 10 seconds.
    const interval = setInterval(updateShowList, 10000);
    return () => clearInterval(interval);
  }, []);

  const clickPlay = async (show) => {
    try {
      // Play the new show...
      await axios.post('shows', {value: show});
      // Then refresh status in 2 seconds.
      setTimeout(statusRefresh, 2000);
    } catch (err) {
      errorMessage(`Error running show ${show}: ${err.message}`);
    }
  };

  const clickEnqueue = async (show) => {
    try {
      await addToPlaylist(setPlaylist, show);
    } catch (err) {
      errorMessage(`Error adding show ${show} to playlist: ${err.message}`);
    }
  };

  return (
    <>
      <Typography variant='h5' gutterBottom>
        Show Selector
      </Typography>

      <List style={{listStyle: 'none'}} dense>
        {shows.map(show =>
          <ListItem color="primary" divider>
            <ListItemText primary={show.name} secondary={show.description} />

            <ListItemIcon>
              <IconButton onClick={() => clickPlay(show.name)}>
                <PlayCircleOutlineIcon />
              </IconButton>
            </ListItemIcon>

            <ListItemIcon>
              <IconButton onClick={() => clickEnqueue(show.name)}>
                <PlaylistAddIcon />
              </IconButton>
            </ListItemIcon>
          </ListItem>
          )}
      </List>
    </>
  );
}

export default withSnackbar(ShowSelectorComponent);
