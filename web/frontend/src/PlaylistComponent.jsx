import React, {useEffect, useState} from "react";
import {
  Box,
  Button,
  Collapse,
  Grid,
  IconButton,
  List,
  ListItem,
  ListItemIcon,
  ListItemText, makeStyles,
  Typography
} from "@material-ui/core";
import {ExpandLess, ExpandMore} from '@material-ui/icons';
import DeleteIcon from '@material-ui/icons/Delete';
import TuneIcon from '@material-ui/icons/Tune';
import PlayArrowIcon from '@material-ui/icons/PlayArrow';
import { usePlaylistState, useSetPlaylist } from "./PlaylistContext";
import {clearPlaylist, deleteFromPlaylist, setPlayListNext, updatePlaylist} from "./PlaylistActions";
import PlaylistSettingsDialog from "./PlaylistSettingsDialog";
import { withSnackbar } from "notistack";
import axios from "axios";

const useStyles = makeStyles(theme => ({
  grid: {
    padding: theme.spacing(2),
  },
}));

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
  const {entryId, show, isPlaying, setPlaylist} = props;
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [showKnobs, setShowKnobs] = useState([]);

  const errorMessage = (msg) => {
    props.enqueueSnackbar(msg, {variant: 'error'})
  };

  useEffect(() => {
    axios.get(`show_knob/${show}`)
      .then((resp) => setShowKnobs(oldData => oldData !== resp.data ? resp.data : oldData))
      .catch((err) => errorMessage(`Error fetching settings for show: ${err.message}`));
  }, []);

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
    try {
      event.stopPropagation();
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
        {isPlaying ? // PlayArrow icon for currently playing show.
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

function PlaylistComponent(props) {
  const classes = useStyles();

  const {playlist, playing} = usePlaylistState();
  const setPlaylist = useSetPlaylist();

  const [open, setOpen] = useState(true);

  // Playlist expands/collapses when playlist length changes.
  useEffect(() => setOpen(playlist.length > 0), [playlist.length]);

  useEffect(() => {
    // Get playlist from the server initially.
    updatePlaylist(setPlaylist).then();

    // Frequently updates the current playlist from the server.
    const interval = setInterval(
      () => updatePlaylist(setPlaylist),
      4_000);
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

  const handleClick = () => {
    setOpen(!open);
  };

  return (
    <>
      <ListItem button onClick={handleClick}>
        <ListItemText>
          <Typography variant="h5">Playlist</Typography>
        </ListItemText>
        {open ? <ExpandLess /> : <ExpandMore />}
      </ListItem>

      <Collapse in={open} timeout="auto">
        <Grid
          className={classes.grid}
          container
          direction="column"
          justify="center"
        >
          <Box marginBottom={2}>
            <Button variant="contained" onClick={clickClear}>Clear Playlist</Button>
          </Box>
          <List dense>
            {playlist.map(([entryId, show]) => {
              return (
                <PlaylistItem
                  entryId={entryId}
                  show={show}
                  isPlaying={playing === entryId}
                  setPlaylist={setPlaylist}
                />);
            })}
          </List>
        </Grid>
      </Collapse>
    </>
  );
}

export default withSnackbar(PlaylistComponent);