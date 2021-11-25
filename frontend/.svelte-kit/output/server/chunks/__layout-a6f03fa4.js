import { c as create_ssr_component, s as subscribe, e as escape, v as validate_component } from "./app-b77152d3.js";
import { e as errorStore, O as Overlay } from "./displayError-15aadbc4.js";
import "./index-1636d17c.js";
var Error_svelte_svelte_type_style_lang = "";
const css$1 = {
  code: ".text-3xl.svelte-177k9vn{font-size:1.875rem;line-height:2.25rem}.mb-3.svelte-177k9vn{margin-bottom:0.75rem}.mt-5.svelte-177k9vn{margin-top:1.25rem}.overflow-auto.svelte-177k9vn{overflow:auto}",
  map: null
};
const Error = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $errorStore, $$unsubscribe_errorStore;
  $$unsubscribe_errorStore = subscribe(errorStore, (value) => $errorStore = value);
  let { close } = $$props;
  if ($$props.close === void 0 && $$bindings.close && close !== void 0)
    $$bindings.close(close);
  $$result.css.add(css$1);
  $$unsubscribe_errorStore();
  return `<h1 class="${"text-3xl mb-3 svelte-177k9vn"}">An error has occurred...</h1>
<pre class="${"overflow-auto svelte-177k9vn"}">${escape($errorStore)}</pre>

<button class="${"btn-neutral mt-5 svelte-177k9vn"}">Ok</button>`;
});
var styles = "";
var __layout_svelte_svelte_type_style_lang = "";
const css = {
  code: `*,::before,::after{-webkit-box-sizing:border-box;box-sizing:border-box;border-width:0;border-style:solid;border-color:#e5e7eb}*{--tw-ring-inset:var(--tw-empty,/*!*/ /*!*/);--tw-ring-offset-width:0px;--tw-ring-offset-color:#fff;--tw-ring-color:rgba(59, 130, 246, 0.5);--tw-ring-offset-shadow:0 0 #0000;--tw-ring-shadow:0 0 #0000;--tw-shadow:0 0 #0000}:root{-moz-tab-size:4;-o-tab-size:4;tab-size:4}:-moz-focusring{outline:1px dotted ButtonText}:-moz-ui-invalid{box-shadow:none}::moz-focus-inner{border-style:none;padding:0}::-webkit-inner-spin-button,::-webkit-outer-spin-button{height:auto}::-webkit-search-decoration{-webkit-appearance:none}::-webkit-file-upload-button{-webkit-appearance:button;font:inherit}[type='search']{-webkit-appearance:textfield;outline-offset:-2px}abbr[title]{-webkit-text-decoration:underline dotted;text-decoration:underline dotted}body{margin:0;font-family:inherit;line-height:inherit}html{-webkit-text-size-adjust:100%;font-family:ui-sans-serif,system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Arial,"Noto Sans",sans-serif,"Apple Color Emoji","Segoe UI Emoji","Segoe UI Symbol","Noto Color Emoji";line-height:1.5}a{color:inherit;text-decoration:inherit}b,strong{font-weight:bolder}button,input,optgroup,select,textarea{font-family:inherit;font-size:100%;line-height:1.15;margin:0;padding:0;line-height:inherit;color:inherit}button,select{text-transform:none}button,[type='button'],[type='reset'],[type='submit']{-webkit-appearance:button}blockquote,dl,dd,h1,h2,h3,h4,h5,h6,hr,figure,p,pre{margin:0}button{background-color:transparent;background-image:none}button:focus{outline:1px dotted;outline:5px auto -webkit-focus-ring-color}button,[role="button"]{cursor:pointer}code,kbd,samp,pre{font-size:1em}fieldset{margin:0;padding:0}hr{height:0;color:inherit;border-top-width:1px}h1,h2,h3,h4,h5,h6{font-size:inherit;font-weight:inherit}img{border-style:solid}input::placeholder{opacity:1;color:#9ca3af}input::webkit-input-placeholder{opacity:1;color:#9ca3af}input::-moz-placeholder{opacity:1;color:#9ca3af}input:-ms-input-placeholder{opacity:1;color:#9ca3af}input::-ms-input-placeholder{opacity:1;color:#9ca3af}img,svg,video,canvas,audio,iframe,embed,object{display:block;vertical-align:middle}img,video{max-width:100%;height:auto}legend{padding:0}ol,ul{list-style:none;margin:0;padding:0}progress{vertical-align:baseline}pre,code,kbd,samp{font-family:ui-monospace,SFMono-Regular,Menlo,Monaco,Consolas,"Liberation Mono","Courier New",monospace}small{font-size:80%}sub,sup{font-size:75%;line-height:0;position:relative;vertical-align:baseline}sub{bottom:-0.25em}sup{top:-0.5em}summary{display:list-item}table{text-indent:0;border-color:inherit;border-collapse:collapse}textarea{resize:vertical}textarea::placeholder{opacity:1;color:#9ca3af}textarea::webkit-input-placeholder{opacity:1;color:#9ca3af}textarea::-moz-placeholder{opacity:1;color:#9ca3af}textarea:-ms-input-placeholder{opacity:1;color:#9ca3af}textarea::-ms-input-placeholder{opacity:1;color:#9ca3af}`,
  map: null
};
const _layout = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let showErrorOverlay;
  let closeErrorOverlay;
  let isShown = false;
  errorStore.subscribe((v) => {
    if (!isShown && v !== "") {
      showErrorOverlay();
    }
    isShown = v !== "";
  });
  $$result.css.add(css);
  let $$settled;
  let $$rendered;
  do {
    $$settled = true;
    $$rendered = `${slots.default ? slots.default({}) : ``}

${validate_component(Overlay, "Overlay").$$render($$result, {
      open: showErrorOverlay,
      close: closeErrorOverlay
    }, {
      open: ($$value) => {
        showErrorOverlay = $$value;
        $$settled = false;
      },
      close: ($$value) => {
        closeErrorOverlay = $$value;
        $$settled = false;
      }
    }, {
      default: () => `${validate_component(Error, "Error").$$render($$result, { close: closeErrorOverlay }, {}, {})}`
    })}`;
  } while (!$$settled);
  return $$rendered;
});
export { _layout as default };
