import axios from "axios";

// Functions to call server REST endpoints and update playlist state.
// setPlaylist argument is the React callback to modify playlist state in components.

const sleep = (milliseconds) => {
  return new Promise(resolve => setTimeout(resolve, milliseconds))
};

async function updatePlaylist(setPlaylist) {
  const response = await axios.get('playlist');
  const newPlaylist = response.data;
  // Attempts to only update when there's a substantive difference.
  setPlaylist(oldPlaylist => oldPlaylist !== newPlaylist ? newPlaylist : oldPlaylist);
}

async function addToPlaylist(setPlaylist, show) {
  await axios.post('playlist', {show: show});
  await updatePlaylist(setPlaylist);
}

async function deleteFromPlaylist(setPlaylist, entryId) {
  await axios.delete(`playlist/entries/${entryId}`);
  await updatePlaylist(setPlaylist);
}

async function clearPlaylist(setPlaylist) {
  await axios.delete('playlist');
  await updatePlaylist(setPlaylist);
}

async function setPlayListNext(setPlaylist, entryId) {
  await axios.put('playlist', {entry_id: entryId});
  await sleep(300); // There should be a small delay so the correct entry is highlighted.
  await updatePlaylist(setPlaylist);
}

export {updatePlaylist, addToPlaylist, deleteFromPlaylist, clearPlaylist, setPlayListNext};