import React, { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";

// React context provider pattern to manage the state of the playlist (set/get) across any components nested within a
// PlaylistProvider.

const StatusStateContext = createContext({});

// Returns state accessors (not setters) for status: {show, seconds, showKnobs}.
function usePlayingStatus() {
  const context = useContext(StatusStateContext);
  if (context === undefined) {
    throw new Error("useStatusState must be used within a StatusStateContext");
  }
  return context;
}

// Status pertains to the running show.
function StatusProvider({ children }) {
  const [show, setShow] = useState("");
  const [seconds, setSeconds] = useState(0);
  const [showKnobs, setShowKnobs] = useState([]);

  const state = {
    show: show,
    seconds: seconds,
    showKnobs: showKnobs,
  };

  const updateStatus = async () => {
    const response = await axios.get("status");
    const { show, seconds_remaining, knobs } = response.data;
    setShow(show);
    setSeconds(seconds_remaining);
    // Attempts to only update when there's a substantive difference.
    setShowKnobs((oldKnobs) => (oldKnobs === knobs ? oldKnobs : knobs));
  };

  // Decrements seconds down to zero then stops.
  const decrementSeconds = () => {
    setSeconds((secs) => (secs > 0 ? secs - 1 : secs));
  };

  useEffect(() => {
    // This code duplication is annoying but seems the easiest way to avoid an react-hooks/exhaustive-deps error.
    axios.get("status").then((resp) => {
      const { show, seconds_remaining, knobs } = resp.data;
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
    };
  }, []);

  return (
    <StatusStateContext.Provider value={state}>
      {children}
    </StatusStateContext.Provider>
  );
}

export { StatusProvider, usePlayingStatus };
