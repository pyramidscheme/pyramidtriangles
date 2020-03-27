import React from "react";
import { useStatusState } from "./StatusContext";

export default function Status() {
  const {show, seconds} = useStatusState();

  // Can use React's Suspense component once it's released for data waiting.
  if (show === '') { // Loading or Stopped
    return <span>Loading...</span>
  }

  return <span>running <strong>{show}</strong> : {seconds} seconds remaining</span>;
}