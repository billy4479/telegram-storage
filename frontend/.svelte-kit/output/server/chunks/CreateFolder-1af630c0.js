import { c as create_ssr_component, d as add_attribute, e as escape, v as validate_component, s as subscribe, b as each } from "./app-b77152d3.js";
import { a as authorizationHeader } from "./login-a9db068a.js";
import { w as writable } from "./index-1636d17c.js";
import { d as displayError } from "./displayError-15aadbc4.js";
const host = "";
const apiRoot = host + "/api";
const file = `${apiRoot}/file`;
const download = `${file}/download`;
const folder = `${apiRoot}/folder`;
const list = `${folder}/list`;
const genQuery = (base) => {
  return (params) => base + "?" + new URLSearchParams(params);
};
async function checkFetchError(p) {
  let message = "";
  let ok = true;
  p.catch((err) => {
    message = err;
    ok = false;
  });
  const res = await p;
  if (!ok) {
    return {
      ok,
      message,
      res
    };
  }
  if (!res.ok) {
    return { ok: false, message: await res.text(), res };
  }
  return { ok, message: void 0, res };
}
function guard(name) {
  return () => {
    throw new Error(`Cannot call ${name}(...) on the server`);
  };
}
const goto = guard("goto");
var IconBase_svelte_svelte_type_style_lang = "";
const css$3 = {
  code: "svg.svelte-sicv7d{stroke:currentColor;fill:currentColor;stroke-width:0;width:100%;height:auto;max-height:100%}",
  map: null
};
const IconBase = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { title = null } = $$props;
  let { viewBox } = $$props;
  if ($$props.title === void 0 && $$bindings.title && title !== void 0)
    $$bindings.title(title);
  if ($$props.viewBox === void 0 && $$bindings.viewBox && viewBox !== void 0)
    $$bindings.viewBox(viewBox);
  $$result.css.add(css$3);
  return `<svg xmlns="${"http://www.w3.org/2000/svg"}"${add_attribute("viewBox", viewBox, 0)} class="${"svelte-sicv7d"}">${title ? `<title>${escape(title)}</title>` : ``}${slots.default ? slots.default({}) : ``}</svg>`;
});
const MdCloudUpload = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  return `${validate_component(IconBase, "IconBase").$$render($$result, Object.assign({ viewBox: "0 0 24 24" }, $$props), {}, {
    default: () => `<path d="${"M19.35 10.04C18.67 6.59 15.64 4 12 4 9.11 4 6.6 5.64 5.35 8.04 2.34 8.36 0 10.91 0 14c0 3.31 2.69 6 6 6h13c2.76 0 5-2.24 5-5 0-2.64-2.05-4.78-4.65-4.96zM14 13v4h-4v-4H7l5-5 5 5h-3z"}"></path>`
  })}`;
});
const IoMdTrash = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  return `${validate_component(IconBase, "IconBase").$$render($$result, Object.assign({ viewBox: "0 0 512 512" }, $$props), {}, {
    default: () => `<path d="${"M128 405.429C128 428.846 147.198 448 170.667 448h170.667C364.802 448 384 428.846 384 405.429V160H128v245.429zM416 96h-80l-26.785-32H202.786L176 96H96v32h320V96z"}"></path>`
  })}`;
});
const MdCreateNewFolder = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  return `${validate_component(IconBase, "IconBase").$$render($$result, Object.assign({ viewBox: "0 0 24 24" }, $$props), {}, {
    default: () => `<path d="${"M20 6h-8l-2-2H4c-1.11 0-1.99.89-1.99 2L2 18c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V8c0-1.11-.89-2-2-2zm-1 8h-3v3h-2v-3h-3v-2h3V9h2v3h3v2z"}"></path>`
  })}`;
});
const selectedStore = writable([]);
let selected = [];
selectedStore.subscribe((v) => {
  selected = v;
});
function getSelected() {
  return selected;
}
function isSelected(entry) {
  return selected.includes(entry);
}
function toggle(entry) {
  const result = !isSelected(entry);
  selectedStore.update((v) => {
    if (result) {
      v.push(entry);
    } else {
      v = v.filter((e) => e !== entry);
    }
    return v;
  });
  return result;
}
function clearSelection() {
  selectedStore.set([]);
}
const q$1 = genQuery(folder);
async function getFolder(path) {
  const p = fetch(q$1({ path }), {
    headers: authorizationHeader()
  });
  const { ok, message, res } = await checkFetchError(p);
  if (!ok) {
    displayError(message);
    return Promise.reject(message);
  }
  const result = await res.json();
  return result;
}
async function getFolderByID(id) {
  const p = fetch(q$1({ id: id.toString() }), {
    headers: authorizationHeader()
  });
  const { ok, message, res } = await checkFetchError(p);
  if (!ok) {
    displayError(message);
    return Promise.reject(message);
  }
  const result = await res.json();
  return result;
}
const dirStack = { stack: [], index: 0 };
function pushDirHist(path) {
  dirStack.stack = dirStack.stack.slice(0, dirStack.index + 1);
  let i = dirStack.index;
  while (dirStack.stack[i] === path && i >= 0) {
    dirStack.stack.pop();
    i--;
  }
  dirStack.stack.push(path);
  dirStack.index = dirStack.stack.length - 1;
  return path;
}
function dirStackBack() {
  dirStack.index--;
  if (dirStack.index <= 0)
    dirStack.index = 0;
  return dirStack.stack[dirStack.index];
}
function dirStackForward() {
  if (dirStack.index !== dirStack.stack.length - 1) {
    dirStack.index++;
  }
  return dirStack.stack[dirStack.index];
}
const currentPathStore = writable("/");
currentPathStore.subscribe((v) => {
});
const q = genQuery(list);
async function getContentOf(path) {
  const folder2 = await getFolder(path);
  const res = await fetch(q({ id: folder2.folderID.toString() }), {
    headers: authorizationHeader()
  });
  if (!res.ok) {
    return Promise.reject("Invalid response");
  }
  const result = await res.json();
  if (!result) {
    return Promise.reject("Invalid response");
  }
  return result;
}
async function navigate(to) {
  clearSelection();
  currentPathStore.set(to);
  pushDirHist(to);
  return `/a/folder/${(await getFolder(to)).folderID}`;
}
let currentRefreshFn;
function setRefreshFn(refreshFn) {
  currentRefreshFn = refreshFn;
}
async function refreshCurrentView() {
  clearSelection();
  currentRefreshFn();
}
var Upload_svelte_svelte_type_style_lang = "";
const css$2 = {
  code: ".cursor-pointer.svelte-1jrlwff{cursor:pointer}.flex.svelte-1jrlwff{display:-webkit-box;display:-ms-flexbox;display:-webkit-flex;display:flex}.justify-evenly.svelte-1jrlwff{-webkit-box-pack:space-evenly;-ms-flex-pack:space-evenly;-webkit-justify-content:space-evenly;justify-content:space-evenly}.text-3xl.svelte-1jrlwff{font-size:1.875rem;line-height:2.25rem}.mb-10.svelte-1jrlwff{margin-bottom:2.5rem}.mt-10.svelte-1jrlwff{margin-top:2.5rem}",
  map: null
};
const Upload = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { close } = $$props;
  currentPathStore.subscribe((v) => {
  });
  if ($$props.close === void 0 && $$bindings.close && close !== void 0)
    $$bindings.close(close);
  $$result.css.add(css$2);
  return `<h1 class="${"text-3xl mb-10 svelte-1jrlwff"}">Upload</h1>

<form><input type="${"file"}" name="${"file"}" id="${"file"}" multiple>
  <br>
  <div class="${"flex justify-evenly mt-10 svelte-1jrlwff"}"><input type="${"submit"}" value="${"Upload"}" class="${"btn-good cursor-pointer svelte-1jrlwff"}">
    <button class="${"btn-bad-light"}">Cancel</button></div>
</form>`;
});
var Delete_svelte_svelte_type_style_lang = "";
const css$1 = {
  code: ".flex.svelte-shu4na{display:-webkit-box;display:-ms-flexbox;display:-webkit-flex;display:flex}.place-items-center.svelte-shu4na{place-items:center}.justify-evenly.svelte-shu4na{-webkit-box-pack:space-evenly;-ms-flex-pack:space-evenly;-webkit-justify-content:space-evenly;justify-content:space-evenly}.text-3xl.svelte-shu4na{font-size:1.875rem;line-height:2.25rem}.list-disc.svelte-shu4na{list-style-type:disc}.mb-3.svelte-shu4na{margin-bottom:0.75rem}.ml-5.svelte-shu4na{margin-left:1.25rem}.mt-5.svelte-shu4na{margin-top:1.25rem}",
  map: null
};
const Delete = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $selectedStore, $$unsubscribe_selectedStore;
  $$unsubscribe_selectedStore = subscribe(selectedStore, (value) => $selectedStore = value);
  let { close } = $$props;
  let recursive = false;
  if ($$props.close === void 0 && $$bindings.close && close !== void 0)
    $$bindings.close(close);
  $$result.css.add(css$1);
  $$unsubscribe_selectedStore();
  return `<h1 class="${"text-3xl mb-3 svelte-shu4na"}">Are you sure?</h1>
<p>The following files are going to be deleted:</p>
<ul class="${"list-disc ml-5 svelte-shu4na"}">${each($selectedStore, (entry) => `<li>${escape(entry.name)}
    </li>`)}</ul>
<br>
<label for="${"recursive"}">Enable recursive deleting</label>
<input name="${"recursive"}" type="${"checkbox"}"${add_attribute("checked", recursive, 1)}>

<div class="${"flex place-items-center justify-evenly mt-5 svelte-shu4na"}"><button class="${"btn-bad"}">Yes, delete</button>
  <button class="${"btn-neutral-light"}">No, cancel</button>
</div>`;
});
var CreateFolder_svelte_svelte_type_style_lang = "";
const css = {
  code: ".border.svelte-lxnaxc{border-width:1px}.flex.svelte-lxnaxc{display:-webkit-box;display:-ms-flexbox;display:-webkit-flex;display:flex}.place-items-center.svelte-lxnaxc{place-items:center}.justify-evenly.svelte-lxnaxc{-webkit-box-pack:space-evenly;-ms-flex-pack:space-evenly;-webkit-justify-content:space-evenly;justify-content:space-evenly}.text-2xl.svelte-lxnaxc{font-size:1.5rem;line-height:2rem}.my-5.svelte-lxnaxc{margin-top:1.25rem;margin-bottom:1.25rem}.ml-3.svelte-lxnaxc{margin-left:0.75rem}.mt-5.svelte-lxnaxc{margin-top:1.25rem}.py-1.svelte-lxnaxc{padding-top:0.25rem;padding-bottom:0.25rem}.px-2.svelte-lxnaxc{padding-left:0.5rem;padding-right:0.5rem}.shadow.svelte-lxnaxc{--tw-shadow-color:0, 0, 0;--tw-shadow:0 1px 3px 0 rgba(var(--tw-shadow-color), 0.1), 0 1px 2px 0 rgba(var(--tw-shadow-color), 0.06);-webkit-box-shadow:var(--tw-ring-offset-shadow, 0 0 #0000), var(--tw-ring-shadow, 0 0 #0000), var(--tw-shadow);box-shadow:var(--tw-ring-offset-shadow, 0 0 #0000), var(--tw-ring-shadow, 0 0 #0000), var(--tw-shadow)}",
  map: null
};
const CreateFolder = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let name = "";
  let { close } = $$props;
  if ($$props.close === void 0 && $$bindings.close && close !== void 0)
    $$bindings.close(close);
  $$result.css.add(css);
  return `<h1 class="${"text-2xl svelte-lxnaxc"}">Create a new folder</h1>
<form><div class="${"my-5 svelte-lxnaxc"}"><label for="${"name"}">Name</label>
    <input type="${"text"}" name="${"name"}" autocomplete="${"off"}" class="${"ml-3 py-1 px-2 border shadow svelte-lxnaxc"}"${add_attribute("value", name, 0)}></div>

  <div class="${"flex place-items-center justify-evenly mt-5 svelte-lxnaxc"}"><input type="${"submit"}" value="${"Create"}" class="${"btn-good"}">
    <button class="${"btn-bad-light"}">Cancel</button></div>
</form>`;
});
export { CreateFolder as C, Delete as D, IconBase as I, MdCreateNewFolder as M, Upload as U, MdCloudUpload as a, IoMdTrash as b, goto as c, currentPathStore as d, dirStackBack as e, dirStackForward as f, getSelected as g, checkFetchError as h, genQuery as i, download as j, isSelected as k, getContentOf as l, setRefreshFn as m, navigate as n, getFolderByID as o, pushDirHist as p, refreshCurrentView as r, selectedStore as s, toggle as t };
