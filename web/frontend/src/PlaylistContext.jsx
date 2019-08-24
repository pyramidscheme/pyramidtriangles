import React, { useState } from "react";

const PlaylistStateContext = React.createContext();
const PlaylistDispatchContext = React.createContext();

function PlaylistProvider({children}) {
  const [playlist, setPlaylist] = useState([]);
  return (
    <PlaylistStateContext.Provider value={playlist}>
      <PlaylistDispatchContext.Provider value={setPlaylist}>
        {children}
      </PlaylistDispatchContext.Provider>
    </PlaylistStateContext.Provider>
  );
}

function usePlaylistState() {
  const context = React.useContext(PlaylistStateContext);
  if (context === undefined) {
    throw new Error('usePlaylistState must be used within a PlaylistProvider')
  }
  return context;
}

function useSetPlaylist() {
  const context = React.useContext(PlaylistDispatchContext);
  if (context === undefined) {
    throw new Error('usePlaylistDispatch must be used within a PlaylistProvider')
  }
  return context;
}

export {PlaylistProvider, usePlaylistState, useSetPlaylist};