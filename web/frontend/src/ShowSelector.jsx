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

export default function ShowSelector() {
  const [shows, setShows] = useState([]);
  const setPlaylist = useSetPlaylist();

  useEffect(() => {
    // Get list of shows from server at startup.
    axios.get('shows')
      .then((resp) => setShows(resp.data.shows));
  }, []);

  const clickPlay = async (show) => {
    await axios.post('shows', {value: show});
  };

  const clickEnqueue = async (show) => {
    await addToPlaylist(setPlaylist, show);
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
};