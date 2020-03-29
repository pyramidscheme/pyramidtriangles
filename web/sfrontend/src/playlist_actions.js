import {playlist} from "./stores";

const sleep = (milliseconds) => {
  return new Promise(resolve => setTimeout(resolve, milliseconds))
};

const updatePlaylist = async () => {
  const resp = await fetch('playlist');
  const newData = await resp.json();
  playlist.update(oldData => oldData === newData ? oldData : newData);
};

export const addToPlaylist = async (show) => {
  await fetch('playlist', {
    method: 'POST',
    body: JSON.stringify({show: show}),
  });
  await updatePlaylist();
};

export const deleteFromPlaylist = async (entryId) => {
  await fetch(`playlist/entries/${entryId}`, {
    method: 'DELETE',
  });
  await updatePlaylist();
};

export const clearPlaylist = async () => {
  await fetch('playlist', {
    method: 'DELETE',
  });
  await updatePlaylist();
};

export const setPlayListNext = async (entryId) => {
  await fetch('playlist', {
    method: 'PUT',
    body: JSON.stringify({entry_id: entryId}),
  });
  await sleep(300); // There should be a small delay so the correct entry is highlighted.
  await updatePlaylist();
};