<script lang="ts">
	import type { Tokens } from "marked";
	import BreakFix from "./BreakFix.svelte";

	export let token: Tokens.Hr | Tokens.Generic;
</script>

<slot />
<BreakFix {token} slice={0} />
