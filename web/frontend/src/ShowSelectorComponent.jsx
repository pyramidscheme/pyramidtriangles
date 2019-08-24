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
  const updateSeconds = 10;
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
    axios.get('shows').then((resp) => setShows(resp.data.shows));
    const interval = setInterval(updateShowList, updateSeconds * 1000);
    return () => clearInterval(interval);
  }, []);

  const clickPlay = async (show) => {
    try {
      await axios.post('shows', {value: show});
      // Refresh status in 2 seconds.
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

  const ShowListItem = ({show}) => {
    return (
      <ListItem color="primary">
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
    );
  };

  return (
    <>
      <Typography variant='h5' gutterBottom>
        Show Selector
      </Typography>
      <List style={{listStyle: 'none'}} dense>
        {shows.map(show => <ShowListItem show={show} />)}
      </List>
    </>
  );
}

export default withSnackbar(ShowSelectorComponent);
