import axios from "axios";

async function updatePlaylist(setPlaylist) {
  const response = await axios.get('playlist');
  setPlaylist(response.data.playlist);
}

async function addToPlaylist(setPlaylist, show) {
  await axios.post('playlist', {show: show});
  await updatePlaylist(setPlaylist);
}

async function deleteFromPlaylist(setPlaylist, entry_id) {
  await axios.delete(`playlist/${entry_id}`);
  await updatePlaylist(setPlaylist);
}

async function clearPlaylist(setPlaylist) {
  await axios.delete('playlist');
  await updatePlaylist(setPlaylist);
}

export {updatePlaylist, addToPlaylist, deleteFromPlaylist, clearPlaylist};