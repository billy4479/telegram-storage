import { writable } from 'svelte/store';

export const errorStore = writable<string>('');

export function displayError(message: string) {
  console.error(message);
  errorStore.set(message);
}
