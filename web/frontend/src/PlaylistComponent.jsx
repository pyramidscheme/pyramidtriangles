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
import PlayArrowIcon from '@material-ui/icons/PlayArrow';
import { usePlaylistState, useSetPlaylist } from "./PlaylistContext";
import {clearPlaylist, deleteFromPlaylist, updatePlaylist} from "./PlaylistActions";
import { withSnackbar } from "notistack";

const useStyles = makeStyles(theme => ({
  grid: {
    padding: theme.spacing(2),
  },
}));

function PlaylistComponent(props) {
  const classes = useStyles();
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
  const [open, setOpen] = useState(true);

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

      <Collapse in={open} timeout="auto" unmountOnExit>
        <Grid
          className={classes.grid}
          container
          direction="column"
          justify="center"
        >
          { playlist.length
              ? <Box marginBottom={2}>
                  <Button variant="contained" onClick={clickClear}>Clear Playlist</Button>
                </Box>
              : <em>empty</em>
          }

          <List dense>
            {playlist.map(([id, show]) => {
                return (
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
                );
              })
            }
          </List>
        </Grid>
      </Collapse>
    </>
  );
}

export default withSnackbar(PlaylistComponent);