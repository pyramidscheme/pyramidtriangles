import { writable } from 'svelte/store';

export const playlist = writable({'playlist':[]});
export const show = writable('');
export const seconds = writable(0);