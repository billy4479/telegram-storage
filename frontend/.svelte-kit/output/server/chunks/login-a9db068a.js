import { w as writable } from "./index-1636d17c.js";
function getJWT() {
  return sessionStorage.getItem("jwt");
}
const isAuthenticatedStore = writable(false);
function authorizationHeader() {
  return new Headers({
    Authorization: "Bearer " + getJWT()
  });
}
isAuthenticatedStore.subscribe((value) => value);
function logout() {
  sessionStorage.removeItem("jwt");
  sessionStorage.removeItem("masterKey");
  isAuthenticatedStore.set(false);
}
export { authorizationHeader as a, isAuthenticatedStore as i, logout as l };
