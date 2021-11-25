import { c as create_ssr_component, e as escape, b as each, d as add_attribute, v as validate_component } from "./app-b77152d3.js";
import "./login-a9db068a.js";
import "./index-1636d17c.js";
async function zxcvbnAsync(password) {
  return import("zxcvbn").then((zxcvbn) => zxcvbn.default(password));
}
var PasswordStrength_svelte_svelte_type_style_lang = "";
const css$1 = {
  code: ".bar.svelte-3gj6vw{--tw-bg-opacity:1;background-color:rgba(156, 163, 175, var(--tw-bg-opacity));border-radius:0.25rem;display:inline-block;-webkit-box-flex:1;-ms-flex-positive:1;-webkit-flex-grow:1;flex-grow:1;height:100%;--tw-shadow-color:0, 0, 0;--tw-shadow:0 1px 3px 0 rgba(var(--tw-shadow-color), 0.1), 0 1px 2px 0 rgba(var(--tw-shadow-color), 0.06);-webkit-box-shadow:var(--tw-ring-offset-shadow, 0 0 #0000), var(--tw-ring-shadow, 0 0 #0000), var(--tw-shadow);box-shadow:var(--tw-ring-offset-shadow, 0 0 #0000), var(--tw-ring-shadow, 0 0 #0000), var(--tw-shadow)}.week.svelte-3gj6vw{--tw-bg-opacity:1;background-color:rgba(220, 38, 38, var(--tw-bg-opacity))}.bad.svelte-3gj6vw{--tw-bg-opacity:1;background-color:rgba(249, 115, 22, var(--tw-bg-opacity))}.decent.svelte-3gj6vw{--tw-bg-opacity:1;background-color:rgba(245, 158, 11, var(--tw-bg-opacity))}.good.svelte-3gj6vw{--tw-bg-opacity:1;background-color:rgba(59, 130, 246, var(--tw-bg-opacity))}.strong.svelte-3gj6vw{--tw-bg-opacity:1;background-color:rgba(5, 150, 105, var(--tw-bg-opacity))}.bg-light-50.svelte-3gj6vw{--tw-bg-opacity:1;background-color:rgba(253, 253, 253, var(--tw-bg-opacity))}.rounded.svelte-3gj6vw{border-radius:0.25rem}.border.svelte-3gj6vw{border-width:1px}.block.svelte-3gj6vw{display:block}.flex.svelte-3gj6vw{display:-webkit-box;display:-ms-flexbox;display:-webkit-flex;display:flex}.font-bold.svelte-3gj6vw{font-weight:700}.h-2.svelte-3gj6vw{height:0.5rem}.list-disc.svelte-3gj6vw{list-style-type:disc}.mb-3.svelte-3gj6vw{margin-bottom:0.75rem}.mt-3.svelte-3gj6vw{margin-top:0.75rem}.ml-10.svelte-3gj6vw{margin-left:2.5rem}.overflow-hidden.svelte-3gj6vw{overflow:hidden}.p-3.svelte-3gj6vw{padding:0.75rem}.shadow.svelte-3gj6vw{--tw-shadow-color:0, 0, 0;--tw-shadow:0 1px 3px 0 rgba(var(--tw-shadow-color), 0.1), 0 1px 2px 0 rgba(var(--tw-shadow-color), 0.06);-webkit-box-shadow:var(--tw-ring-offset-shadow, 0 0 #0000), var(--tw-ring-shadow, 0 0 #0000), var(--tw-shadow);box-shadow:var(--tw-ring-offset-shadow, 0 0 #0000), var(--tw-ring-shadow, 0 0 #0000), var(--tw-shadow)}.text-red-600.svelte-3gj6vw{--tw-text-opacity:1;color:rgba(220, 38, 38, var(--tw-text-opacity))}.break-words.svelte-3gj6vw{overflow-wrap:break-word}.w-full.svelte-3gj6vw{width:100%}.w-100.svelte-3gj6vw{width:25rem}.gap-2.svelte-3gj6vw{grid-gap:0.5rem;gap:0.5rem}",
  map: null
};
const PasswordStrength = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { password } = $$props;
  let { passwordConfirm } = $$props;
  let first = "";
  let second = "";
  let third = "";
  let forth = "";
  let fifth = "";
  let suggestion;
  if ($$props.password === void 0 && $$bindings.password && password !== void 0)
    $$bindings.password(password);
  if ($$props.passwordConfirm === void 0 && $$bindings.passwordConfirm && passwordConfirm !== void 0)
    $$bindings.passwordConfirm(passwordConfirm);
  $$result.css.add(css$1);
  {
    {
      (async () => {
        if (password && password !== "") {
          const r = await zxcvbnAsync(password);
          suggestion = r.feedback;
          switch (r.score) {
            case 0:
              first = "week";
              second = "";
              third = "";
              forth = "";
              fifth = "";
              break;
            case 1:
              first = "bad";
              second = "bad";
              third = "";
              forth = "";
              fifth = "";
              break;
            case 2:
              first = "decent";
              second = "decent";
              third = "decent";
              forth = "";
              fifth = "";
              break;
            case 3:
              first = "good";
              second = "good";
              third = "good";
              forth = "good";
              fifth = "";
              break;
            case 4:
              first = "strong";
              second = "strong";
              third = "strong";
              forth = "strong";
              fifth = "strong";
              break;
          }
        } else {
          first = "";
          second = "";
          third = "";
          forth = "";
          fifth = "";
          suggestion = void 0;
        }
      })();
    }
  }
  return `<div class="${"border shadow rounded p-3 bg-light-50 overflow-hidden break-words svelte-3gj6vw"}"><h3 class="${"mb-3 svelte-3gj6vw"}">Password strength:</h3>
  <div class="${"h-2 w-full flex gap-2 svelte-3gj6vw"}"><div class="${escape(first) + " bar svelte-3gj6vw"}"></div>
    <div class="${escape(second) + " bar svelte-3gj6vw"}"></div>
    <div class="${escape(third) + " bar svelte-3gj6vw"}"></div>
    <div class="${escape(forth) + " bar svelte-3gj6vw"}"></div>
    <div class="${escape(fifth) + " bar svelte-3gj6vw"}"></div></div>

  ${suggestion && (suggestion.suggestions.length !== 0 || suggestion.warning !== "") ? `<div class="${"mt-3 svelte-3gj6vw"}">Suggestions:
      <ul class="${"list-disc block overflow-hidden break-words w-100 svelte-3gj6vw"}">${each(suggestion.suggestions, (s) => `<li class="${"ml-10 svelte-3gj6vw"}">${escape(s)}</li>`)}</ul>
      ${suggestion.warning !== "" ? `<p class="${"font-bold svelte-3gj6vw"}">WARNING: ${escape(suggestion.warning)}</p>` : ``}</div>` : ``}

  ${password !== passwordConfirm ? `<p class="${"text-red-600 font-bold svelte-3gj6vw"}">Password does not match.</p>` : ``}
</div>`;
});
var register_svelte_svelte_type_style_lang = "";
const css = {
  code: "label.svelte-66sab{display:inline-block;margin-right:0.75rem;width:11.25rem}.bg-gray-50.svelte-66sab{--tw-bg-opacity:1;background-color:rgba(249, 250, 251, var(--tw-bg-opacity))}.border-gray-300.svelte-66sab{--tw-border-opacity:1;border-color:rgba(209, 213, 219, var(--tw-border-opacity))}.rounded.svelte-66sab{border-radius:0.25rem}.border.svelte-66sab{border-width:1px}.cursor-pointer.svelte-66sab{cursor:pointer}.inline-block.svelte-66sab{display:inline-block}.flex.svelte-66sab{display:-webkit-box;display:-ms-flexbox;display:-webkit-flex;display:flex}.flex-col.svelte-66sab{-webkit-box-orient:vertical;-webkit-box-direction:normal;-ms-flex-direction:column;-webkit-flex-direction:column;flex-direction:column}.items-center.svelte-66sab{-webkit-box-align:center;-ms-flex-align:center;-webkit-align-items:center;align-items:center}.justify-center.svelte-66sab{-webkit-box-pack:center;-ms-flex-pack:center;-webkit-justify-content:center;justify-content:center}.h-screen.svelte-66sab{height:100vh}.text-3xl.svelte-66sab{font-size:1.875rem;line-height:2.25rem}.my-3.svelte-66sab{margin-top:0.75rem;margin-bottom:0.75rem}.mb-10.svelte-66sab{margin-bottom:2.5rem}.mt-3.svelte-66sab{margin-top:0.75rem}.overflow-hidden.svelte-66sab{overflow:hidden}.px-20.svelte-66sab{padding-left:5rem;padding-right:5rem}.py-10.svelte-66sab{padding-top:2.5rem;padding-bottom:2.5rem}.py-4.svelte-66sab{padding-top:1rem;padding-bottom:1rem}.shadow-md.svelte-66sab{--tw-shadow-color:0, 0, 0;--tw-shadow:0 4px 6px -1px rgba(var(--tw-shadow-color), 0.1), 0 2px 4px -1px rgba(var(--tw-shadow-color), 0.06);-webkit-box-shadow:var(--tw-ring-offset-shadow, 0 0 #0000), var(--tw-ring-shadow, 0 0 #0000), var(--tw-shadow);box-shadow:var(--tw-ring-offset-shadow, 0 0 #0000), var(--tw-ring-shadow, 0 0 #0000), var(--tw-shadow)}.text-blue-600.svelte-66sab{--tw-text-opacity:1;color:rgba(37, 99, 235, var(--tw-text-opacity))}.underline.svelte-66sab{-webkit-text-decoration-line:underline;text-decoration-line:underline}.break-words.svelte-66sab{overflow-wrap:break-word}.w-100.svelte-66sab{width:25rem}",
  map: null
};
const Register = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let token = "";
  let password = "";
  let passwordConfirm = "";
  let form;
  $$result.css.add(css);
  let $$settled;
  let $$rendered;
  do {
    $$settled = true;
    $$rendered = `<div class="${"flex justify-center items-center h-screen svelte-66sab"}"><form action="${"/api/login"}" autocomplete="${"off"}" class="${"border border-gray-300 inline-block rounded shadow-md bg-gray-50 px-20 py-10 svelte-66sab"}"${add_attribute("this", form, 0)}><h3 class="${"text-3xl mb-10 svelte-66sab"}">Register</h3>
    <div class="${"flex flex-col svelte-66sab"}"><div class="${"mt-3 svelte-66sab"}"><label for="${"token"}" class="${"svelte-66sab"}">Token:</label>
        <input type="${"text"}" name="${"token"}" placeholder="${"Token"}"${add_attribute("value", token, 0)}></div>
      <div class="${"mt-3 svelte-66sab"}"><label for="${"password"}" class="${"svelte-66sab"}">Password:</label>
        <input type="${"password"}" name="${"password"}" placeholder="${"Password"}"${add_attribute("value", password, 0)}></div>
      <div class="${"my-3 svelte-66sab"}"><label for="${"password-confirm"}" class="${"svelte-66sab"}">Confirm Password:</label>
        <input type="${"password"}" name="${"password-confirm"}" placeholder="${"Confirm Password"}"${add_attribute("value", passwordConfirm, 0)}></div>

      ${validate_component(PasswordStrength, "PasswordStrength").$$render($$result, { password, passwordConfirm }, {
      password: ($$value) => {
        password = $$value;
        $$settled = false;
      },
      passwordConfirm: ($$value) => {
        passwordConfirm = $$value;
        $$settled = false;
      }
    }, {})}

      <p class="${"mt-3 overflow-hidden break-words w-100 svelte-66sab"}"><strong>IMPORTANT:</strong> If you forget your password your files will be
        LOST FOREVER. Use a password manager!
      </p>

      <p class="${"py-4 svelte-66sab"}">Already have an account?
        <a class="${"text-blue-600 underline svelte-66sab"}" href="${"/login"}">Login here</a>.
      </p>

      <input type="${"submit"}" value="${"Register"}" class="${"btn-good-light cursor-pointer svelte-66sab"}"></div></form>
</div>`;
  } while (!$$settled);
  return $$rendered;
});
export { Register as default };
