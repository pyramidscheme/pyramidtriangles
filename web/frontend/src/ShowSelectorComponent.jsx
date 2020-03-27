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
import { withSnackbar } from "notistack";

function ShowSelectorComponent(props) {
  const [shows, setShows] = useState([]);
  const setPlaylist = useSetPlaylist();

  const updateShowList = async () => {
    const response = await axios.get('shows');
    const newShows = response.data.shows;
    // Attempts to only update when there's a substantive difference.
    setShows(oldShows => oldShows === newShows ? oldShows : newShows);
  };

  const errorMessage = (message) => {
    props.enqueueSnackbar(message, {variant: 'error'});
  };

  useEffect(() => {
    // Get list of shows from server at startup.
    axios.get('shows').then((resp) => setShows(resp.data.shows));

    // Refresh list of shows from the server every 10 seconds.
    const interval = setInterval(updateShowList, 10_000);
    return () => clearInterval(interval);
  }, []);

  const clickPlay = async (show) => {
    try {
      await axios.post('shows', {value: show});
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

  const PlayButton = ({show}) => {
    return (
      <ListItemIcon>
        <IconButton onClick={() => clickPlay(show)}>
          <PlayCircleOutlineIcon />
        </IconButton>
      </ListItemIcon>
    );
  };

  const EnqueueButton = ({show}) => {
    return (
      <ListItemIcon>
        <IconButton onClick={() => clickEnqueue(show)}>
          <PlaylistAddIcon />
        </IconButton>
      </ListItemIcon>
    );
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
            <PlayButton show={show.name} />
            <EnqueueButton show={show.name} />
          </ListItem>
          )}
      </List>
    </>
  );
}

export default withSnackbar(ShowSelectorComponent);
