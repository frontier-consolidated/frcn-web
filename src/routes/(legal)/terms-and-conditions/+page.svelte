<script lang="ts">
	import source from "./policy.md?raw";
	import LegalMarkdown from "../_components/legal-markdown.svelte";

	import Meta from "$lib/seo/meta.svelte";
</script>

<Meta title="Terms and Conditions" />

<LegalMarkdown {source} />
