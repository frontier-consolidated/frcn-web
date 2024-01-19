<script lang="ts">
	import type { Tokens } from "marked";

	export let token: Tokens.Code | Tokens.Generic;
</script>

<pre class="language-{token.lang} block p-0">
    <code>
        {token.text}
    </code>
</pre>
