<script lang="ts">
	import { onMount } from "svelte";

	export let query: string;

	let mql: MediaQueryList;
	let mql_listener: (ev: MediaQueryListEvent) => any;
	let was_mounted = false;
	let matches = false;

	onMount(() => {
		was_mounted = true;
		return () => {
			remove_active_listener();
		};
	});

	$: {
		if (was_mounted) {
			remove_active_listener();
			add_new_listener(query);
		}
	}

	function add_new_listener(query: string) {
		mql = window.matchMedia(query);
		mql_listener = (v) => (matches = v.matches);
		mql.addEventListener("change", mql_listener);
		matches = mql.matches;
	}

	function remove_active_listener() {
		if (mql && mql_listener) {
			mql.removeEventListener("change", mql_listener);
		}
	}
</script>

<slot {matches} />
