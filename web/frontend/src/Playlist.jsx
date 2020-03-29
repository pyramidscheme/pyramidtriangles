import React, {useEffect, useState} from "react";
import {
  Box,
  Button,
  Collapse,
  Grid,
  List,
  ListItem,
  ListItemText, makeStyles,
  Typography
} from "@material-ui/core";
import {ExpandLess, ExpandMore} from '@material-ui/icons';
import {clearPlaylist, updatePlaylist} from "./PlaylistActions";
import {usePlaylist, useSetPlaylist} from "./PlaylistContext";
import PlaylistItem from "./PlaylistItem";

const useStyles = makeStyles(theme => ({
  grid: {
    padding: theme.spacing(2),
  },
}));

export default function Playlist() {
  const classes = useStyles();

  const {playlist, playing} = usePlaylist();
  const setPlaylist = useSetPlaylist();

  const [open, setOpen] = useState(true);

  // Playlist expands/collapses when playlist length changes.
  useEffect(() => setOpen(playlist.length > 0), [playlist.length]);

  useEffect(() => {
    // Get playlist from the server initially.
    updatePlaylist(setPlaylist).then();

    // Frequently updates the current playlist from the server.
    const interval = setInterval(() => updatePlaylist(setPlaylist), 4_000);
    return () => clearInterval(interval);
  }, [setPlaylist]);

  const clickClear = async () => {
    await clearPlaylist(setPlaylist);
  };

  const handleClick = () => {
    setOpen(!open);
  };

  if (playlist.length === 0) {
    return <></>;
  }

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
            <Button onClick={clickClear}>
              Clear Playlist
            </Button>
          </Box>
          <List dense>
            {playlist.map(([entryId, show]) => {
              return (
                <PlaylistItem
                  entryId={entryId}
                  show={show}
                  isPlaying={playing === entryId}
                />);
            })}
          </List>
        </Grid>
      </Collapse>
    </>
  );
};