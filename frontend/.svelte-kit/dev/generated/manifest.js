const c = [
	() => import("../../../src/routes/__layout.svelte"),
	() => import("../components/error.svelte"),
	() => import("../../../src/routes/index.svelte"),
	() => import("../../../src/routes/register.svelte"),
	() => import("../../../src/routes/login.svelte"),
	() => import("../../../src/routes/a/index.svelte"),
	() => import("../../../src/routes/a/folder/__layout.svelte"),
	() => import("../../../src/routes/a/folder/index.svelte"),
	() => import("../../../src/routes/a/folder/[id].svelte")
];

const d = decodeURIComponent;

export const routes = [
	// src/routes/index.svelte
	[/^\/$/, [c[0], c[2]], [c[1]]],

	// src/routes/register.svelte
	[/^\/register\/?$/, [c[0], c[3]], [c[1]]],

	// src/routes/login.svelte
	[/^\/login\/?$/, [c[0], c[4]], [c[1]]],

	// src/routes/a/index.svelte
	[/^\/a\/?$/, [c[0], c[5]], [c[1]]],

	// src/routes/a/folder/index.svelte
	[/^\/a\/folder\/?$/, [c[0], c[6], c[7]], [c[1]]],

	// src/routes/a/folder/[id].svelte
	[/^\/a\/folder\/([^/]+?)\/?$/, [c[0], c[6], c[8]], [c[1]], (m) => ({ id: d(m[1])})]
];

// we import the root layout/error components eagerly, so that
// connectivity errors after initialisation don't nuke the app
export const fallback = [c[0](), c[1]()];