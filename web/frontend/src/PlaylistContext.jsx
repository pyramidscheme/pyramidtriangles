import React, {createContext, useContext, useState} from "react";

// React context provider pattern to manage the state of the playlist (set/get) across any components nested within a
// PlaylistProvider.

const PlaylistStateContext = createContext({});
const PlaylistDispatchContext = createContext({});

function PlaylistProvider({children}) {
  const [playlist, setPlaylist] = useState({playlist: []});

  return (
    <PlaylistStateContext.Provider value={playlist}>
      <PlaylistDispatchContext.Provider value={setPlaylist}>
        {children}
      </PlaylistDispatchContext.Provider>
    </PlaylistStateContext.Provider>
  );
}

function usePlaylist() {
  const context = useContext(PlaylistStateContext);
  if (context === undefined) {
    throw new Error('usePlaylistState must be used within a PlaylistProvider')
  }
  return context;
}

function useSetPlaylist() {
  const context = useContext(PlaylistDispatchContext);
  if (context === undefined) {
    throw new Error('usePlaylistDispatch must be used within a PlaylistProvider')
  }
  return context;
}

export {PlaylistProvider, usePlaylist, useSetPlaylist};