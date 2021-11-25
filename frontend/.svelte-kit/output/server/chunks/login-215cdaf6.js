import { c as create_ssr_component, d as add_attribute } from "./app-b77152d3.js";
import "./login-a9db068a.js";
import "./index-1636d17c.js";
var login_svelte_svelte_type_style_lang = "";
const css = {
  code: "label.svelte-10hwudc{display:inline-block;margin-right:0.75rem;width:7.5rem}.bg-gray-50.svelte-10hwudc{--tw-bg-opacity:1;background-color:rgba(249, 250, 251, var(--tw-bg-opacity))}.border-gray-300.svelte-10hwudc{--tw-border-opacity:1;border-color:rgba(209, 213, 219, var(--tw-border-opacity))}.rounded.svelte-10hwudc{border-radius:0.25rem}.border.svelte-10hwudc{border-width:1px}.cursor-pointer.svelte-10hwudc{cursor:pointer}.inline-block.svelte-10hwudc{display:inline-block}.flex.svelte-10hwudc{display:-webkit-box;display:-ms-flexbox;display:-webkit-flex;display:flex}.flex-col.svelte-10hwudc{-webkit-box-orient:vertical;-webkit-box-direction:normal;-ms-flex-direction:column;-webkit-flex-direction:column;flex-direction:column}.items-center.svelte-10hwudc{-webkit-box-align:center;-ms-flex-align:center;-webkit-align-items:center;align-items:center}.justify-center.svelte-10hwudc{-webkit-box-pack:center;-ms-flex-pack:center;-webkit-justify-content:center;justify-content:center}.h-screen.svelte-10hwudc{height:100vh}.text-3xl.svelte-10hwudc{font-size:1.875rem;line-height:2.25rem}.mb-10.svelte-10hwudc{margin-bottom:2.5rem}.mt-3.svelte-10hwudc{margin-top:0.75rem}.px-20.svelte-10hwudc{padding-left:5rem;padding-right:5rem}.py-10.svelte-10hwudc{padding-top:2.5rem;padding-bottom:2.5rem}.py-4.svelte-10hwudc{padding-top:1rem;padding-bottom:1rem}.shadow-md.svelte-10hwudc{--tw-shadow-color:0, 0, 0;--tw-shadow:0 4px 6px -1px rgba(var(--tw-shadow-color), 0.1), 0 2px 4px -1px rgba(var(--tw-shadow-color), 0.06);-webkit-box-shadow:var(--tw-ring-offset-shadow, 0 0 #0000), var(--tw-ring-shadow, 0 0 #0000), var(--tw-shadow);box-shadow:var(--tw-ring-offset-shadow, 0 0 #0000), var(--tw-ring-shadow, 0 0 #0000), var(--tw-shadow)}.text-blue-600.svelte-10hwudc{--tw-text-opacity:1;color:rgba(37, 99, 235, var(--tw-text-opacity))}.underline.svelte-10hwudc{-webkit-text-decoration-line:underline;text-decoration-line:underline}",
  map: null
};
const Login = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let username = "";
  let password = "";
  $$result.css.add(css);
  return `<div class="${"flex justify-center items-center h-screen svelte-10hwudc"}"><form action="${"/api/login"}" class="${"border border-gray-300 inline-block rounded shadow-md bg-gray-50 px-20 py-10 svelte-10hwudc"}"><h3 class="${"text-3xl mb-10 svelte-10hwudc"}">Login</h3>
    <div class="${"flex flex-col svelte-10hwudc"}"><div><label for="${"username"}" class="${"svelte-10hwudc"}">Username:</label>
        <input type="${"text"}" name="${"username"}" placeholder="${"Telegram username"}"${add_attribute("value", username, 0)}></div>
      <div class="${"mt-3 svelte-10hwudc"}"><label for="${"password"}" class="${"svelte-10hwudc"}">Password:</label>
        <input type="${"password"}" name="${"password"}" placeholder="${"Password"}"${add_attribute("value", password, 0)}></div>

      <p class="${"py-4 svelte-10hwudc"}">Don&#39;t have an account yet?
        <a class="${"text-blue-600 underline svelte-10hwudc"}" href="${"/register"}">Register here</a>.
      </p>

      <input type="${"submit"}" value="${"Login"}" class="${"btn-good-light cursor-pointer svelte-10hwudc"}"></div></form>
</div>`;
});
export { Login as default };
