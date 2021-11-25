import { c as create_ssr_component, v as validate_component, d as add_attribute, b as each, e as escape, s as subscribe } from "./app-b77152d3.js";
import { I as IconBase, M as MdCreateNewFolder, a as MdCloudUpload, g as getSelected, b as IoMdTrash, c as goto, U as Upload, D as Delete, C as CreateFolder, d as currentPathStore, n as navigate, e as dirStackBack, f as dirStackForward, r as refreshCurrentView } from "./CreateFolder-1af630c0.js";
import { O as Overlay } from "./displayError-15aadbc4.js";
import { l as logout, i as isAuthenticatedStore } from "./login-a9db068a.js";
import "./index-1636d17c.js";
const IoIosLogOut = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  return `${validate_component(IconBase, "IconBase").$$render($$result, Object.assign({ viewBox: "0 0 512 512" }, $$props), {}, {
    default: () => `<path d="${"M312 372c-7.7 0-14 6.3-14 14 0 9.9-8.1 18-18 18H94c-9.9 0-18-8.1-18-18V126c0-9.9 8.1-18 18-18h186c9.9 0 18 8.1 18 18 0 7.7 6.3 14 14 14s14-6.3 14-14c0-25.4-20.6-46-46-46H94c-25.4 0-46 20.6-46 46v260c0 25.4 20.6 46 46 46h186c25.4 0 46-20.6 46-46 0-7.7-6.3-14-14-14z"}"></path>
<path d="${"M372.9 158.1c-2.6-2.6-6.1-4.1-9.9-4.1-3.7 0-7.3 1.4-9.9 4.1-5.5 5.5-5.5 14.3 0 19.8l65.2 64.2H162c-7.7 0-14 6.3-14 14s6.3 14 14 14h256.6L355 334.2c-5.4 5.4-5.4 14.3 0 19.8l.1.1c2.7 2.5 6.2 3.9 9.8 3.9 3.8 0 7.3-1.4 9.9-4.1l82.6-82.4c4.3-4.3 6.5-9.3 6.5-14.7 0-5.3-2.3-10.3-6.5-14.5l-84.5-84.2z"}"></path>`
  })}`;
});
var NavButton_svelte_svelte_type_style_lang = "";
const css$5 = {
  code: ".bg-blue-500.svelte-fypl2r{--tw-bg-opacity:1;background-color:rgba(59, 130, 246, var(--tw-bg-opacity))}.focus\\:bg-blue-400.svelte-fypl2r:focus{--tw-bg-opacity:1;background-color:rgba(96, 165, 250, var(--tw-bg-opacity))}.hover\\:bg-blue-400.svelte-fypl2r:hover{--tw-bg-opacity:1;background-color:rgba(96, 165, 250, var(--tw-bg-opacity))}.rounded-2xl.svelte-fypl2r{border-radius:1rem}.m-2.svelte-fypl2r{margin:0.5rem}.p-3.svelte-fypl2r{padding:0.75rem}.shadow.svelte-fypl2r{--tw-shadow-color:0, 0, 0;--tw-shadow:0 1px 3px 0 rgba(var(--tw-shadow-color), 0.1), 0 1px 2px 0 rgba(var(--tw-shadow-color), 0.06);-webkit-box-shadow:var(--tw-ring-offset-shadow, 0 0 #0000), var(--tw-ring-shadow, 0 0 #0000), var(--tw-shadow);box-shadow:var(--tw-ring-offset-shadow, 0 0 #0000), var(--tw-ring-shadow, 0 0 #0000), var(--tw-shadow)}.text-light-50.svelte-fypl2r{--tw-text-opacity:1;color:rgba(253, 253, 253, var(--tw-text-opacity))}",
  map: null
};
const NavButton = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { callback = () => {
  } } = $$props;
  let { overlayHint = "" } = $$props;
  if ($$props.callback === void 0 && $$bindings.callback && callback !== void 0)
    $$bindings.callback(callback);
  if ($$props.overlayHint === void 0 && $$bindings.overlayHint && overlayHint !== void 0)
    $$bindings.overlayHint(overlayHint);
  $$result.css.add(css$5);
  return `<button${add_attribute("title", overlayHint, 0)} class="${"m-2 bg-blue-500 rounded-2xl p-3 text-light-50 shadow focus:bg-blue-400 hover:bg-blue-400 svelte-fypl2r"}">${slots.default ? slots.default({}) : ``}
</button>`;
});
var Sidebar_svelte_svelte_type_style_lang = "";
const css$4 = {
  code: ".bg-blue-400.svelte-1evki62{--tw-bg-opacity:1;background-color:rgba(96, 165, 250, var(--tw-bg-opacity))}.flex.svelte-1evki62{display:-webkit-box;display:-ms-flexbox;display:-webkit-flex;display:flex}.flex-col.svelte-1evki62{-webkit-box-orient:vertical;-webkit-box-direction:normal;-ms-flex-direction:column;-webkit-flex-direction:column;flex-direction:column}.h-screen.svelte-1evki62{height:100vh}.mt-auto.svelte-1evki62{margin-top:auto}.fixed.svelte-1evki62{position:fixed}.top-0.svelte-1evki62{top:0px}.left-0.svelte-1evki62{left:0px}.w-20.svelte-1evki62{width:5rem}",
  map: null
};
const Sidebar = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let showUploadOverlay;
  let closeUploadOverlay;
  let showDeleteOverlay;
  let closeDeleteOverlay;
  let showNewFolderOverlay;
  let closeNewFolderOverlay;
  $$result.css.add(css$4);
  let $$settled;
  let $$rendered;
  do {
    $$settled = true;
    $$rendered = `<nav class="${"flex flex-col bg-blue-400 fixed top-0 left-0 h-screen w-20 svelte-1evki62"}">${validate_component(NavButton, "NavButton").$$render($$result, {
      overlayHint: "New Folder",
      callback: showNewFolderOverlay
    }, {}, {
      default: () => `${validate_component(MdCreateNewFolder, "NewFolderIcon").$$render($$result, {}, {}, {})}`
    })}
  ${validate_component(NavButton, "NavButton").$$render($$result, {
      overlayHint: "Upload",
      callback: showUploadOverlay
    }, {}, {
      default: () => `${validate_component(MdCloudUpload, "UploadIcon").$$render($$result, {}, {}, {})}`
    })}
  ${validate_component(NavButton, "NavButton").$$render($$result, {
      overlayHint: "Delete",
      callback: () => {
        if (getSelected().length !== 0)
          showDeleteOverlay();
      }
    }, {}, {
      default: () => `${validate_component(IoMdTrash, "TrashIcon").$$render($$result, {}, {}, {})}`
    })}
  <div class="${"mt-auto svelte-1evki62"}">${validate_component(NavButton, "NavButton").$$render($$result, {
      overlayHint: "Logout",
      callback: async () => {
        await goto("/login");
        logout();
      }
    }, {}, {
      default: () => `${validate_component(IoIosLogOut, "LogoutIcon").$$render($$result, {}, {}, {})}`
    })}</div></nav>

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
  return $$rendered;
});
const MdHome = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  return `${validate_component(IconBase, "IconBase").$$render($$result, Object.assign({ viewBox: "0 0 24 24" }, $$props), {}, {
    default: () => `<path d="${"M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"}"></path>`
  })}`;
});
const MdArrowForward = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  return `${validate_component(IconBase, "IconBase").$$render($$result, Object.assign({ viewBox: "0 0 24 24" }, $$props), {}, {
    default: () => `<path d="${"M12 4l-1.41 1.41L16.17 11H4v2h12.17l-5.58 5.59L12 20l8-8z"}"></path>`
  })}`;
});
const MdArrowBack = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  return `${validate_component(IconBase, "IconBase").$$render($$result, Object.assign({ viewBox: "0 0 24 24" }, $$props), {}, {
    default: () => `<path d="${"M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"}"></path>`
  })}`;
});
const MdRefresh = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  return `${validate_component(IconBase, "IconBase").$$render($$result, Object.assign({ viewBox: "0 0 24 24" }, $$props), {}, {
    default: () => `<path d="${"M17.65 6.35C16.2 4.9 14.21 4 12 4c-4.42 0-7.99 3.58-7.99 8s3.57 8 7.99 8c3.73 0 6.84-2.55 7.73-6h-2.08c-.82 2.33-3.04 4-5.65 4-3.31 0-6-2.69-6-6s2.69-6 6-6c1.66 0 3.14.69 4.22 1.78L13 11h7V4l-2.35 2.35z"}"></path>`
  })}`;
});
var Path_svelte_svelte_type_style_lang = "";
const css$3 = {
  code: ".bg-light-50.svelte-15hz0jx{--tw-bg-opacity:1;background-color:rgba(253, 253, 253, var(--tw-bg-opacity))}.rounded.svelte-15hz0jx{border-radius:0.25rem}.border.svelte-15hz0jx{border-width:1px}.flex.svelte-15hz0jx{display:-webkit-box;display:-ms-flexbox;display:-webkit-flex;display:flex}.place-items-center.svelte-15hz0jx{place-items:center}.text-2xl.svelte-15hz0jx{font-size:1.5rem;line-height:2rem}.px-2.svelte-15hz0jx{padding-left:0.5rem;padding-right:0.5rem}.hover\\:underline.svelte-15hz0jx:hover{-webkit-text-decoration-line:underline;text-decoration-line:underline}",
  map: null
};
const Path = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let path = "/";
  let dirs = ["/", ...path.split("/").filter((v) => v != "")];
  currentPathStore.subscribe((v) => {
    path = v;
    dirs = ["/", ...path.split("/").filter((v2) => v2 != "")];
  });
  $$result.css.add(css$3);
  return `<ol class="${"flex bg-light-50 px-2 rounded border text-2xl place-items-center svelte-15hz0jx"}">${each(dirs, (dir, i) => `<li><button class="${"hover:underline svelte-15hz0jx"}">${i != 0 && i != dirs.length - 1 ? `${escape(dir)}/` : `${escape(dir)}`}</button>
    </li>`)}
</ol>`;
});
var TopBarButton_svelte_svelte_type_style_lang = "";
const css$2 = {
  code: "button.svelte-lwiprw{aspect-ratio:1}.bg-light-50.svelte-lwiprw{--tw-bg-opacity:1;background-color:rgba(253, 253, 253, var(--tw-bg-opacity))}.rounded.svelte-lwiprw{border-radius:0.25rem}.border.svelte-lwiprw{border-width:1px}.py-1.svelte-lwiprw{padding-top:0.25rem;padding-bottom:0.25rem}.px-2.svelte-lwiprw{padding-left:0.5rem;padding-right:0.5rem}.w-12.svelte-lwiprw{width:3rem}",
  map: null
};
const TopBarButton = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { onClick } = $$props;
  if ($$props.onClick === void 0 && $$bindings.onClick && onClick !== void 0)
    $$bindings.onClick(onClick);
  $$result.css.add(css$2);
  return `<button class="${"bg-light-50 py-1 px-2 rounded border w-12 svelte-lwiprw"}">${slots.default ? slots.default({}) : ``}
</button>`;
});
var TopBar_svelte_svelte_type_style_lang = "";
const css$1 = {
  code: ".bg-gray-100.svelte-1d0u8lk{--tw-bg-opacity:1;background-color:rgba(243, 244, 246, var(--tw-bg-opacity))}.rounded.svelte-1d0u8lk{border-radius:0.25rem}.flex.svelte-1d0u8lk{display:-webkit-box;display:-ms-flexbox;display:-webkit-flex;display:flex}.h-14.svelte-1d0u8lk{height:3.5rem}.mb-5.svelte-1d0u8lk{margin-bottom:1.25rem}.py-1.svelte-1d0u8lk{padding-top:0.25rem;padding-bottom:0.25rem}.px-2.svelte-1d0u8lk{padding-left:0.5rem;padding-right:0.5rem}.shadow.svelte-1d0u8lk{--tw-shadow-color:0, 0, 0;--tw-shadow:0 1px 3px 0 rgba(var(--tw-shadow-color), 0.1), 0 1px 2px 0 rgba(var(--tw-shadow-color), 0.06);-webkit-box-shadow:var(--tw-ring-offset-shadow, 0 0 #0000), var(--tw-ring-shadow, 0 0 #0000), var(--tw-shadow);box-shadow:var(--tw-ring-offset-shadow, 0 0 #0000), var(--tw-ring-shadow, 0 0 #0000), var(--tw-shadow)}.gap-2.svelte-1d0u8lk{grid-gap:0.5rem;gap:0.5rem}",
  map: null
};
const TopBar = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  $$result.css.add(css$1);
  return `<nav class="${"flex bg-gray-100 rounded shadow py-1 px-2 mb-5 h-14 gap-2 svelte-1d0u8lk"}">${validate_component(TopBarButton, "TopBarButton").$$render($$result, {
    onClick: () => {
      navigate(dirStackBack()).then((r) => goto(r));
    }
  }, {}, {
    default: () => `${validate_component(MdArrowBack, "ArrowBackIcon").$$render($$result, {}, {}, {})}`
  })}

  
  ${validate_component(TopBarButton, "TopBarButton").$$render($$result, {
    onClick: () => {
      navigate(dirStackForward()).then((r) => goto(r));
    }
  }, {}, {
    default: () => `${validate_component(MdArrowForward, "ArrowForwardIcon").$$render($$result, {}, {}, {})}`
  })}

  ${validate_component(TopBarButton, "TopBarButton").$$render($$result, { onClick: refreshCurrentView }, {}, {
    default: () => `${validate_component(MdRefresh, "RefreshIcon").$$render($$result, {}, {}, {})}`
  })}

  
  ${validate_component(TopBarButton, "TopBarButton").$$render($$result, {
    onClick: () => {
      navigate("/").then((r) => goto(r));
    }
  }, {}, {
    default: () => `${validate_component(MdHome, "HomeIcon").$$render($$result, {}, {}, {})}`
  })}

  
  ${validate_component(Path, "Path").$$render($$result, {}, {}, {})}
</nav>`;
});
var __layout_svelte_svelte_type_style_lang = "";
const css = {
  code: ".h-screen.svelte-1hexx9f{height:100vh}.ml-25.svelte-1hexx9f{margin-left:6.25rem}.mr-5.svelte-1hexx9f{margin-right:1.25rem}.mt-5.svelte-1hexx9f{margin-top:1.25rem}",
  map: null
};
const _layout = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $isAuthenticatedStore, $$unsubscribe_isAuthenticatedStore;
  $$unsubscribe_isAuthenticatedStore = subscribe(isAuthenticatedStore, (value) => $isAuthenticatedStore = value);
  $$result.css.add(css);
  $$unsubscribe_isAuthenticatedStore();
  return `${$isAuthenticatedStore ? `${validate_component(Sidebar, "Sidebar").$$render($$result, {}, {}, {})}

  <main class="${"ml-25 mr-5 mt-5 h-screen svelte-1hexx9f"}">${validate_component(TopBar, "TopBar").$$render($$result, {}, {}, {})}
    ${slots.default ? slots.default({}) : ``}</main>` : ``}`;
});
export { _layout as default };
