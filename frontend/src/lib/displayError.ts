import { writable } from 'svelte/store';

export const errorStore = writable<string>('');

export function displayError(message: string): void {
  console.error(message);
  errorStore.set(message);
  debugger;
}
