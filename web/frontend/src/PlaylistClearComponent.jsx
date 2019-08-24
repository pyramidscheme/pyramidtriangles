import React from "react";
import { Button } from "@material-ui/core";
import { clearPlaylist } from "./PlaylistActions";
import { useSetPlaylist } from "./PlaylistContext";
import { withSnackbar } from "notistack";

function PlaylistClearComponent(props) {
  const setPlaylist = useSetPlaylist();

  const handleClick = async () => {
    try {
      await clearPlaylist(setPlaylist);
    } catch (err) {
      props.enqueueSnackbar(`Error clearing running shows: ${err.message}`, {
        variant: 'error',
      });
    }
  };

  return <Button variant="contained" onClick={handleClick}>Clear</Button>;
}

export default withSnackbar(PlaylistClearComponent);
