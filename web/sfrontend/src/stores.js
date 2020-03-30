import {derived, readable, writable} from 'svelte/store';

let lastUpdate = new Date();

export const status = readable({
  show: '',
  seconds: 0,
  showKnobs: [],
}, function start(set) {
  const interval = setInterval(async () => {
    const resp = await fetch("status");
    const { show, seconds_remaining, knobs } = await resp.json();

    set({
      show: show,
      seconds: seconds_remaining,
      showKnobs: knobs,
    });

    lastUpdate = new Date();
  }, 2000);

  return function stop() {
    clearInterval(interval);
  };
});

// Decrements seconds_remaining down to zero then stops.
export const seconds_remaining = derived(
  status,
  ($status, set) => {
    const interval = setInterval(() => {
      const elapsed = Math.round((new Date() - lastUpdate) / 1000);
      const remaining = $status.seconds - elapsed;
      set(remaining >= 0 ? remaining : 0);
    }, 500);

    return function stop() {
      clearInterval(interval);
    };
  });

export const playlist = writable({'playlist':[]}, () => {});