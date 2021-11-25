import { c as create_ssr_component } from "./app-b77152d3.js";
import { w as writable } from "./index-1636d17c.js";
var Overlay_svelte_svelte_type_style_lang = "";
const css = {
  code: ".bg-dark-700.svelte-1a7445z{--tw-bg-opacity:1;background-color:rgba(27, 27, 27, var(--tw-bg-opacity))}.bg-light-100.svelte-1a7445z{--tw-bg-opacity:1;background-color:rgba(252, 252, 252, var(--tw-bg-opacity))}.rounded-xl.svelte-1a7445z{border-radius:0.75rem}.flex.svelte-1a7445z{display:-webkit-box;display:-ms-flexbox;display:-webkit-flex;display:flex}.place-items-center.svelte-1a7445z{place-items:center}.justify-center.svelte-1a7445z{-webkit-box-pack:center;-ms-flex-pack:center;-webkit-justify-content:center;justify-content:center}.h-screen.svelte-1a7445z{height:100vh}.text-lg.svelte-1a7445z{font-size:1.125rem;line-height:1.75rem}.max-w-4\\/5.svelte-1a7445z{max-width:80%}.opacity-70.svelte-1a7445z{opacity:0.7}.opacity-100.svelte-1a7445z{opacity:1}.p-10.svelte-1a7445z{padding:2.5rem}.fixed.svelte-1a7445z{position:fixed}.top-0.svelte-1a7445z{top:0px}.left-0.svelte-1a7445z{left:0px}.w-screen.svelte-1a7445z{width:100vw}.z-10.svelte-1a7445z{z-index:10}.z-20.svelte-1a7445z{z-index:20}",
  map: null
};
const Overlay = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { close } = $$props;
  let { open } = $$props;
  let isOpen = false;
  close = () => {
    isOpen = false;
  };
  open = () => {
    isOpen = true;
  };
  if ($$props.close === void 0 && $$bindings.close && close !== void 0)
    $$bindings.close(close);
  if ($$props.open === void 0 && $$bindings.open && open !== void 0)
    $$bindings.open(open);
  $$result.css.add(css);
  return `${isOpen ? `<div class="${"fixed top-0 left-0 h-screen w-screen bg-dark-700 opacity-70 flex place-items-center justify-center z-10 svelte-1a7445z"}"></div>
  <div class="${"fixed top-0 left-0 h-screen w-screen flex place-items-center justify-center z-20 svelte-1a7445z"}"><div class="${"p-10 max-w-4/5 opacity-100 bg-light-100 rounded-xl text-lg svelte-1a7445z"}">${slots.default ? slots.default({}) : ``}</div></div>` : ``}`;
});
const errorStore = writable("");
function displayError(message) {
  console.error(message);
  errorStore.set(message);
  debugger;
}
export { Overlay as O, displayError as d, errorStore as e };
