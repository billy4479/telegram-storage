import { g as getContext, c as create_ssr_component, e as escape, d as add_attribute, v as validate_component, b as each, f as compute_slots, h as createEventDispatcher, s as subscribe } from "./app-b77152d3.js";
import { h as checkFetchError, i as genQuery, j as download, I as IconBase, k as isSelected, s as selectedStore, t as toggle, n as navigate, p as pushDirHist, c as goto, d as currentPathStore, l as getContentOf, m as setRefreshFn, o as getFolderByID, M as MdCreateNewFolder, a as MdCloudUpload, b as IoMdTrash, U as Upload, D as Delete, C as CreateFolder } from "./CreateFolder-1af630c0.js";
import { d as displayError, O as Overlay } from "./displayError-15aadbc4.js";
import { a as authorizationHeader } from "./login-a9db068a.js";
import "./index-1636d17c.js";
let cryptoManager = null;
function getCryptoManager() {
  return cryptoManager;
}
const getStores = () => {
  const stores = getContext("__svelte__");
  return {
    page: {
      subscribe: stores.page.subscribe
    },
    navigating: {
      subscribe: stores.navigating.subscribe
    },
    get preloading() {
      console.error("stores.preloading is deprecated; use stores.navigating instead");
      return {
        subscribe: stores.navigating.subscribe
      };
    },
    session: stores.session
  };
};
const page = {
  subscribe(fn) {
    const store = getStores().page;
    return store.subscribe(fn);
  }
};
const q = genQuery(download);
async function authenticatedDownload(id, name, header, key, nonce) {
  const p = fetch(q({ id: id.toString() }), {
    headers: authorizationHeader()
  });
  const { ok, message, res } = await checkFetchError(p);
  if (!ok) {
    displayError(message);
    return Promise.reject(message);
  }
  const blob = await getCryptoManager().decryptFile(res.body, header, key, nonce).catch((err) => {
    displayError(err.message);
  });
  if (!blob) {
    return;
  }
  const blobURL = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = blobURL;
  a.download = name;
  document.body.appendChild(a);
  a.click();
  a.remove();
}
var Entry_svelte_svelte_type_style_lang = "";
const css$2 = {
  code: "span.svelte-193yy2c{overflow:hidden;white-space:nowrap;text-overflow:ellipsis}button.svelte-193yy2c{aspect-ratio:1}.bg-selected.svelte-193yy2c{--tw-bg-opacity:1;background-color:rgba(239, 246, 255, var(--tw-bg-opacity))}.bg-unselected.svelte-193yy2c{--tw-bg-opacity:1;background-color:rgba(243, 244, 246, var(--tw-bg-opacity))}.btn-selected.svelte-193yy2c{--tw-bg-opacity:1;background-color:rgba(191, 219, 254, var(--tw-bg-opacity));font-weight:700;--tw-text-opacity:1;color:rgba(59, 130, 246, var(--tw-text-opacity))}.btn-unselected.svelte-193yy2c{--tw-bg-opacity:1;background-color:rgba(249, 250, 251, var(--tw-bg-opacity))}.btn-unselected.svelte-193yy2c:hover{--tw-bg-opacity:1;background-color:rgba(243, 244, 246, var(--tw-bg-opacity))}.btn-unselected.svelte-193yy2c:focus{--tw-bg-opacity:1;background-color:rgba(243, 244, 246, var(--tw-bg-opacity))}.border-gray-300.svelte-193yy2c{--tw-border-opacity:1;border-color:rgba(209, 213, 219, var(--tw-border-opacity))}.rounded.svelte-193yy2c{border-radius:0.25rem}.border.svelte-193yy2c{border-width:1px}.inline-block.svelte-193yy2c{display:inline-block}.flex.svelte-193yy2c{display:-webkit-box;display:-ms-flexbox;display:-webkit-flex;display:flex}.flex-col.svelte-193yy2c{-webkit-box-orient:vertical;-webkit-box-direction:normal;-ms-flex-direction:column;-webkit-flex-direction:column;flex-direction:column}.items-center.svelte-193yy2c{-webkit-box-align:center;-ms-flex-align:center;-webkit-align-items:center;align-items:center}.items-stretch.svelte-193yy2c{-webkit-box-align:stretch;-ms-flex-align:stretch;-webkit-align-items:stretch;align-items:stretch}.justify-center.svelte-193yy2c{-webkit-box-pack:center;-ms-flex-pack:center;-webkit-justify-content:center;justify-content:center}.flex-grow.svelte-193yy2c{-webkit-box-flex:1;-ms-flex-positive:1;-webkit-flex-grow:1;flex-grow:1}.overflow-hidden.svelte-193yy2c{overflow:hidden}.py-3.svelte-193yy2c{padding-top:0.75rem;padding-bottom:0.75rem}.px-2.svelte-193yy2c{padding-left:0.5rem;padding-right:0.5rem}.shadow-md.svelte-193yy2c{--tw-shadow-color:0, 0, 0;--tw-shadow:0 4px 6px -1px rgba(var(--tw-shadow-color), 0.1), 0 2px 4px -1px rgba(var(--tw-shadow-color), 0.06);-webkit-box-shadow:var(--tw-ring-offset-shadow, 0 0 #0000), var(--tw-ring-shadow, 0 0 #0000), var(--tw-shadow);box-shadow:var(--tw-ring-offset-shadow, 0 0 #0000), var(--tw-ring-shadow, 0 0 #0000), var(--tw-shadow)}.text-center.svelte-193yy2c{text-align:center}.w-full.svelte-193yy2c{width:100%}.w-1\\/3.svelte-193yy2c{width:33.333333%}",
  map: null
};
const Entry = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { name } = $$props;
  let { selected = false } = $$props;
  let { onClick = () => {
  } } = $$props;
  let { onDoubleClick = () => {
  } } = $$props;
  let bgStyle = "";
  let buttonStyle = "";
  if ($$props.name === void 0 && $$bindings.name && name !== void 0)
    $$bindings.name(name);
  if ($$props.selected === void 0 && $$bindings.selected && selected !== void 0)
    $$bindings.selected(selected);
  if ($$props.onClick === void 0 && $$bindings.onClick && onClick !== void 0)
    $$bindings.onClick(onClick);
  if ($$props.onDoubleClick === void 0 && $$bindings.onDoubleClick && onDoubleClick !== void 0)
    $$bindings.onDoubleClick(onDoubleClick);
  $$result.css.add(css$2);
  {
    ((selected2) => {
      bgStyle = selected2 ? "bg-selected" : "bg-unselected";
      buttonStyle = selected2 ? "btn-selected" : "btn-unselected";
    })(selected);
  }
  return `<button class="${"border border-gray-300 inline-block rounded shadow-md w-full overflow-hidden flex flex-col items-stretch " + escape(buttonStyle) + " svelte-193yy2c"}"${add_attribute("title", name, 0)}><div class="${"flex-grow flex justify-center items-center " + escape(bgStyle) + " svelte-193yy2c"}"><div class="${"w-1/3 svelte-193yy2c"}">${slots.default ? slots.default({}) : ``}</div></div>
  <span class="${"text-center py-3 px-2 svelte-193yy2c"}">${escape(name)}</span>
</button>`;
});
const MdInsertDriveFile = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  return `${validate_component(IconBase, "IconBase").$$render($$result, Object.assign({ viewBox: "0 0 24 24" }, $$props), {}, {
    default: () => `<path d="${"M6 2c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6H6zm7 7V3.5L18.5 9H13z"}"></path>`
  })}`;
});
const FileEntry = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { data } = $$props;
  let selected = isSelected(data);
  selectedStore.subscribe(() => {
    selected = isSelected(data);
  });
  async function downloadFile() {
    await authenticatedDownload(data.fileID, data.name, data.header, data.key, data.nonce);
  }
  function onClick() {
    selected = toggle(data);
  }
  if ($$props.data === void 0 && $$bindings.data && data !== void 0)
    $$bindings.data(data);
  let $$settled;
  let $$rendered;
  do {
    $$settled = true;
    $$rendered = `${validate_component(Entry, "Entry").$$render($$result, {
      name: data.name,
      onClick,
      onDoubleClick: downloadFile,
      selected
    }, {
      selected: ($$value) => {
        selected = $$value;
        $$settled = false;
      }
    }, {
      default: () => `${validate_component(MdInsertDriveFile, "FileIcon").$$render($$result, {}, {}, {})}`
    })}`;
  } while (!$$settled);
  return $$rendered;
});
const MdFolder = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  return `${validate_component(IconBase, "IconBase").$$render($$result, Object.assign({ viewBox: "0 0 24 24" }, $$props), {}, {
    default: () => `<path d="${"M10 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2h-8l-2-2z"}"></path>`
  })}`;
});
const FolderEntry = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { data } = $$props;
  let selected = isSelected(data);
  selectedStore.subscribe(() => {
    selected = isSelected(data);
  });
  function onClick() {
    selected = toggle(data);
  }
  if ($$props.data === void 0 && $$bindings.data && data !== void 0)
    $$bindings.data(data);
  let $$settled;
  let $$rendered;
  do {
    $$settled = true;
    $$rendered = `${validate_component(Entry, "Entry").$$render($$result, {
      name: data.name,
      onDoubleClick: () => {
        navigate(pushDirHist(data.path)).then((r) => goto(r));
      },
      onClick,
      selected
    }, {
      selected: ($$value) => {
        selected = $$value;
        $$settled = false;
      }
    }, {
      default: () => `${validate_component(MdFolder, "FolderIcon").$$render($$result, {}, {}, {})}`
    })}`;
  } while (!$$settled);
  return $$rendered;
});
var FileView_svelte_svelte_type_style_lang = "";
const css$1 = {
  code: "#file-view.svelte-1bxbsf6{grid-template-columns:repeat(auto-fill, minmax(10em, 1fr))}.grid.svelte-1bxbsf6{display:-ms-grid;display:grid}.place-items-start.svelte-1bxbsf6{place-items:start}.justify-items-start.svelte-1bxbsf6{justify-items:start}.h-full.svelte-1bxbsf6{height:100%}.min-w-84.svelte-1bxbsf6{min-width:21rem}.gap-4.svelte-1bxbsf6{grid-gap:1rem;gap:1rem}",
  map: null
};
const FileView = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { path = "/" } = $$props;
  let content;
  if ($$props.path === void 0 && $$bindings.path && path !== void 0)
    $$bindings.path(path);
  $$result.css.add(css$1);
  {
    {
      let refresh = function() {
        content = void 0;
        getContentOf(path).then((c) => content = c);
      };
      content = void 0;
      pushDirHist(path);
      currentPathStore.set(path);
      setRefreshFn(refresh);
      refresh();
    }
  }
  return `${content === void 0 ? `<div>Loading...</div>` : `<div class="${"grid gap-4 place-items-start justify-items-start min-w-84 h-full svelte-1bxbsf6"}" id="${"file-view"}">${each(content.folders, (folder) => `${validate_component(FolderEntry, "FolderEntry").$$render($$result, { data: folder }, {}, {})}`)}

    ${each(content.files, (file) => `${validate_component(FileEntry, "FileEntry").$$render($$result, { data: file }, {}, {})}`)}</div>`}`;
});
const ctx = {};
var Menu_svelte_svelte_type_style_lang = "";
const CustomMenu = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  return `${``}

`;
});
var MenuItem_svelte_svelte_type_style_lang = "";
const css = {
  code: "div.disabled.svelte-8hjxvl:hover{--tw-bg-opacity:1;background-color:rgba(253, 253, 253, var(--tw-bg-opacity))}div.disabled.svelte-8hjxvl:focus{--tw-bg-opacity:1;background-color:rgba(253, 253, 253, var(--tw-bg-opacity))}div.disabled.svelte-8hjxvl{cursor:default;--tw-text-opacity:1;color:rgba(107, 114, 128, var(--tw-text-opacity))}.hover\\:bg-gray-200.svelte-8hjxvl:hover{--tw-bg-opacity:1;background-color:rgba(229, 231, 235, var(--tw-bg-opacity))}.focus\\:bg-gray-200.svelte-8hjxvl:focus{--tw-bg-opacity:1;background-color:rgba(229, 231, 235, var(--tw-bg-opacity))}.cursor-pointer.svelte-8hjxvl{cursor:pointer}.flex.svelte-8hjxvl{display:-webkit-box;display:-ms-flexbox;display:-webkit-flex;display:flex}.h-10.svelte-8hjxvl{height:2.5rem}.px-6.svelte-8hjxvl{padding-left:1.5rem;padding-right:1.5rem}.py-2.svelte-8hjxvl{padding-top:0.5rem;padding-bottom:0.5rem}.gap-4.svelte-8hjxvl{grid-gap:1rem;gap:1rem}",
  map: null
};
const MenuItem = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $$slots = compute_slots(slots);
  let { text } = $$props;
  let { disabled = false } = $$props;
  createEventDispatcher();
  getContext(ctx);
  if ($$props.text === void 0 && $$bindings.text && text !== void 0)
    $$bindings.text(text);
  if ($$props.disabled === void 0 && $$bindings.disabled && disabled !== void 0)
    $$bindings.disabled(disabled);
  $$result.css.add(css);
  return `<div class="${[
    "px-6 py-2 flex gap-4 cursor-pointer hover:bg-gray-200 focus:bg-gray-200 h-10 svelte-8hjxvl",
    disabled ? "disabled" : ""
  ].join(" ").trim()}">${$$slots.icon ? `<span>${slots.icon ? slots.icon({}) : ``}</span>` : ``}
  <span>${text ? `${escape(text)}` : ``}</span>
</div>`;
});
const U5Bidu5D = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $selectedStore, $$unsubscribe_selectedStore;
  $$unsubscribe_selectedStore = subscribe(selectedStore, (value) => $selectedStore = value);
  let path = "/";
  page.subscribe(async (p) => {
    if (p.params.id)
      path = (await getFolderByID(parseInt(p.params.id))).path;
  });
  let showUploadOverlay;
  let closeUploadOverlay;
  let showDeleteOverlay;
  let closeDeleteOverlay;
  let showNewFolderOverlay;
  let closeNewFolderOverlay;
  let $$settled;
  let $$rendered;
  do {
    $$settled = true;
    $$rendered = `${validate_component(FileView, "FileView").$$render($$result, { path }, {
      path: ($$value) => {
        path = $$value;
        $$settled = false;
      }
    }, {})}

${validate_component(CustomMenu, "CustomMenu").$$render($$result, {}, {}, {
      default: () => `${$selectedStore.length === 0 ? `${validate_component(MenuItem, "MenuItem").$$render($$result, { text: "New folder" }, {}, {
        icon: () => `${validate_component(MdCreateNewFolder, "NewFolderIcon").$$render($$result, { slot: "icon" }, {}, {})}`
      })}
    ${validate_component(MenuItem, "MenuItem").$$render($$result, { text: "Upload file" }, {}, {
        icon: () => `${validate_component(MdCloudUpload, "UploadIcon").$$render($$result, { slot: "icon" }, {}, {})}`
      })}` : `${validate_component(MenuItem, "MenuItem").$$render($$result, { text: "Delete" }, {}, {
        icon: () => `${validate_component(IoMdTrash, "TrashIcon").$$render($$result, { slot: "icon" }, {}, {})}`
      })}`}`
    })}

${validate_component(Overlay, "Overlay").$$render($$result, {
      close: closeUploadOverlay,
      open: showUploadOverlay
    }, {
      close: ($$value) => {
        closeUploadOverlay = $$value;
        $$settled = false;
      },
      open: ($$value) => {
        showUploadOverlay = $$value;
        $$settled = false;
      }
    }, {
      default: () => `${validate_component(Upload, "Upload").$$render($$result, { close: closeUploadOverlay }, {}, {})}`
    })}

${validate_component(Overlay, "Overlay").$$render($$result, {
      close: closeDeleteOverlay,
      open: showDeleteOverlay
    }, {
      close: ($$value) => {
        closeDeleteOverlay = $$value;
        $$settled = false;
      },
      open: ($$value) => {
        showDeleteOverlay = $$value;
        $$settled = false;
      }
    }, {
      default: () => `${validate_component(Delete, "Delete").$$render($$result, { close: closeDeleteOverlay }, {}, {})}`
    })}

${validate_component(Overlay, "Overlay").$$render($$result, {
      close: closeNewFolderOverlay,
      open: showNewFolderOverlay
    }, {
      close: ($$value) => {
        closeNewFolderOverlay = $$value;
        $$settled = false;
      },
      open: ($$value) => {
        showNewFolderOverlay = $$value;
        $$settled = false;
      }
    }, {
      default: () => `${validate_component(CreateFolder, "CreateFolder").$$render($$result, { close: closeNewFolderOverlay }, {}, {})}`
    })}`;
  } while (!$$settled);
  $$unsubscribe_selectedStore();
  return $$rendered;
});
export { U5Bidu5D as default };
