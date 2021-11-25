import { c as create_ssr_component, s as subscribe } from "./app-b77152d3.js";
import { i as isAuthenticatedStore } from "./login-a9db068a.js";
import "./index-1636d17c.js";
var index_svelte_svelte_type_style_lang = "";
const css = {
  code: ".flex.svelte-1c8zkjt{display:-webkit-box;display:-ms-flexbox;display:-webkit-flex;display:flex}.flex-col.svelte-1c8zkjt{-webkit-box-orient:vertical;-webkit-box-direction:normal;-ms-flex-direction:column;-webkit-flex-direction:column;flex-direction:column}.place-items-center.svelte-1c8zkjt{place-items:center}.justify-center.svelte-1c8zkjt{-webkit-box-pack:center;-ms-flex-pack:center;-webkit-justify-content:center;justify-content:center}.text-6xl.svelte-1c8zkjt{font-size:3.75rem;line-height:1}.mt-10.svelte-1c8zkjt{margin-top:2.5rem}.text-center.svelte-1c8zkjt{text-align:center}.w-2\\/3.svelte-1c8zkjt{width:66.666667%}",
  map: null
};
const Routes = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $isAuthenticatedStore, $$unsubscribe_isAuthenticatedStore;
  $$unsubscribe_isAuthenticatedStore = subscribe(isAuthenticatedStore, (value) => $isAuthenticatedStore = value);
  $$result.css.add(css);
  $$unsubscribe_isAuthenticatedStore();
  return `${!$isAuthenticatedStore ? `<h1 class="${"text-center text-6xl mt-10 svelte-1c8zkjt"}">Landing page</h1>

  <div class="${"flex justify-center place-items-center flex-col svelte-1c8zkjt"}"><p class="${"mt-10 w-2/3 text-center svelte-1c8zkjt"}">Lorem ipsum dolor sit amet consectetur adipisicing elit. Accusantium nam
      quod repudiandae consequuntur natus quo minus vitae voluptas temporibus
      itaque voluptate assumenda ratione, quibusdam quam cumque dolorem nobis
      aliquid omnis adipisci tempore veniam at? Officiis ad, delectus,
      accusantium nam corporis voluptates iusto saepe molestiae velit ipsum
      modi? Corporis, amet asperiores?
    </p>

    <div class="${"mt-10 svelte-1c8zkjt"}"><a href="${"/login"}" class="${"btn-good-light"}">Login</a>
      <a href="${"/register"}" class="${"btn-good"}">Register</a></div></div>` : ``}`;
});
export { Routes as default };
