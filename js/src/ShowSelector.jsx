import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Collapse,
  IconButton,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Typography,
} from "@material-ui/core";
import PlayCircleOutlineIcon from "@material-ui/icons/PlayCircleOutline";
import PlaylistAddIcon from "@material-ui/icons/PlaylistAdd";
import {ExpandLess, ExpandMore} from "@material-ui/icons";
import { addToPlaylist } from "./PlaylistActions";
import { useSetPlaylist } from "./PlaylistContext";

export default function ShowSelector() {
  const [shows, setShows] = useState([]);
  const setPlaylist = useSetPlaylist();

  const [open, setOpen] = useState(true);

  useEffect(() => {
    // Get list of shows from server at startup.
    axios.get("shows").then((resp) => setShows(resp.data.shows));
  }, []);

  const clickExpand = () => {
    setOpen(open => !open);
  };

  const clickPlay = async (show) => {
    await axios.post("shows", { data: show });
  };

  const clickEnqueue = async (show) => {
    await addToPlaylist(setPlaylist, show);
  };

  const PlayButton = ({ show }) => {
    return (
      <ListItemIcon>
        <IconButton onClick={() => clickPlay(show)}>
          <PlayCircleOutlineIcon />
        </IconButton>
      </ListItemIcon>
    );
  };

  const EnqueueButton = ({ show }) => {
    return (
      <ListItemIcon>
        <IconButton onClick={() => clickEnqueue(show)}>
          <PlaylistAddIcon />
        </IconButton>
      </ListItemIcon>
    );
  };

  return (
    <List style={{ listStyle: "none" }} dense>
      <ListItem button onClick={clickExpand}>
        <ListItemText>
          <Typography variant="h5" gutterBottom>
            Show Selector
          </Typography>
        </ListItemText>
        {open ? <ExpandLess /> : <ExpandMore />}
      </ListItem>

      <Collapse in={open} timeout="auto">
        {shows.map((show) => (
          <ListItem key={show.name} color="primary" divider>
            <ListItemText primary={show.name} secondary={show.description} />
            <PlayButton show={show.name} />
            <EnqueueButton show={show.name} />
          </ListItem>
        ))}
      </Collapse>
    </List>
  );
}
