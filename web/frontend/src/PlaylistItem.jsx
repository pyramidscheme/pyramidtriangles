import React, {useEffect, useState} from "react";
import axios from "axios";
import {IconButton, ListItem, ListItemIcon, ListItemText} from "@material-ui/core";
import DeleteIcon from "@material-ui/icons/Delete";
import PlayArrowIcon from "@material-ui/icons/PlayArrow";
import TuneIcon from "@material-ui/icons/Tune";
import {deleteFromPlaylist, setPlayListNext} from "./PlaylistActions";
import {useSetPlaylist} from "./PlaylistContext";
import PlaylistSettingsDialog from "./PlaylistSettingsDialog";
import {withSnackbar} from "notistack";

const SettingsButton = ({onClick}) => {
  return (
    <ListItemIcon>
      <IconButton onClick={onClick}>
        <TuneIcon />
      </IconButton>
    </ListItemIcon>
  );
};

const DeleteButton = ({onClick}) => {
  return (
    <ListItemIcon>
      <IconButton onClick={onClick}>
        <DeleteIcon />
      </IconButton>
    </ListItemIcon>
  );
};

const PlaylistItem = (props) => {
  const {entryId, show, isPlaying} = props;

  const setPlaylist = useSetPlaylist();
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [showKnobs, setShowKnobs] = useState([]);

  // Load the available knobs for a show once.
  useEffect(() => {
    axios.get(`show_knob/${show}`)
      .then((resp) => setShowKnobs(oldData => oldData === resp.data ? oldData : resp.data));
  }, [show]);

  const errorMessage = (msg) => {
    props.enqueueSnackbar(msg, {variant: 'error'})
  };

  const clickPlay = async () => {
    try {
      await setPlayListNext(setPlaylist, entryId);
    } catch (err) {
      errorMessage(`Error setting next playlist entry: ${err.message}`);
    }
  };

  const openSettings = (event) => {
    event.stopPropagation();
    setSettingsOpen(true);
  };

  const clickRemove = async (event) => {
    event.stopPropagation();
    try {
      await deleteFromPlaylist(setPlaylist, entryId);
    } catch (err) {
      errorMessage(`Error removing from playlist: ${err.message}`);
    }
  };

  return (
    <>
      <ListItem
        button
        divider
        onClick={clickPlay}
        selected={isPlaying}
      >
        {isPlaying ? // PlayArrowIcon only for currently playing show.
          <ListItemIcon>
            <PlayArrowIcon />
          </ListItemIcon>
          : ''}
        <ListItemText inset={!isPlaying} primary={show} />
        {showKnobs.length ? <SettingsButton onClick={openSettings} /> : ''}
        <DeleteButton onClick={clickRemove} />
      </ListItem>

      {showKnobs.length
        ? <PlaylistSettingsDialog
            open={settingsOpen}
            setOpen={setSettingsOpen}
            showKnobs={showKnobs}
            entryId={entryId}
            show={show}
          />
        : ''}
    </>
  );
};

export default withSnackbar(PlaylistItem);