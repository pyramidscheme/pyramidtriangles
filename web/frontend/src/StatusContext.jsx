import React, { useEffect, useState } from "react";
import axios from "axios";

// React context provider pattern to manage the state of the playlist (set/get) across any components nested within a
// PlaylistProvider.

const StatusStateContext = React.createContext();
const StatusRefreshContext = React.createContext();

function StatusProvider({children}) {
  const [show, setShow] = useState('');
  const [seconds, setSeconds] = useState(60);
  const [showKnobs, setShowKnobs] = useState([]);

  const state = {
    show: show,
    seconds: seconds,
    showKnobs: showKnobs,
  };

  const updateStatus = async () => {
    const response = await axios.get('status');
    const {show, seconds_remaining, knobs} = response.data;
    setShow(show);
    setSeconds(seconds_remaining);
    // Attempts to only update when there's a substantive difference.
    setShowKnobs(oldKnobs => oldKnobs === knobs ? oldKnobs : knobs);
  };

  // Decrements seconds down to zero then stops
  const decrementSeconds = () => {
    setSeconds(secs => secs > 0 ? secs - 1 : secs);
  };

  useEffect(() => {
    // This code duplication is annoying but seems the easiest way to avoid an react-hooks/exhaustive-deps error.
    axios.get('status').then((resp) => {
      const {show, seconds_remaining, knobs} = resp.data;
      setShow(show);
      setSeconds(seconds_remaining);
      setShowKnobs(knobs);
    });

    const statusInterval = setInterval(updateStatus, 2_000);
    const countdownInterval = setInterval(decrementSeconds, 1_000);

    // Cleans up the intervals when component is unmounted.
    return () => {
      clearInterval(statusInterval);
      clearInterval(countdownInterval);
    }
  }, []);

  return (
    <StatusStateContext.Provider value={state}>
      <StatusRefreshContext.Provider value={updateStatus}>
        {children}
      </StatusRefreshContext.Provider>
    </StatusStateContext.Provider>
  );
}

// Returns state accessors (not setters) for status: {show, seconds, showKnobs}.
function useStatusState() {
  const context = React.useContext(StatusStateContext);
  if (context === undefined) {
    throw new Error('useStatusState must be used within a StatusStateContext')
  }
  return context;
}

// Children components can force an update with 'useStatusRefresh'.
function useStatusRefresh() {
  const context = React.useContext(StatusRefreshContext);
  if (context === undefined) {
    throw new Error('useStatusRefresh must be used within a StatusRefreshContext')
  }
  return context;
}

export {StatusProvider, useStatusState, useStatusRefresh};