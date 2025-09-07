<script lang="ts">
	import { Alert } from "flowbite-svelte";

	import { page } from "$app/stores";
</script>

<Alert color="red">
	{$page.status}: {$page.error?.message}
</Alert>
