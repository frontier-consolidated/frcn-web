<script lang="ts">
    import { page } from "$app/stores";
	import { Alert } from "flowbite-svelte";
</script>

<Alert color="red">
    {$page.status}: {$page.error?.message}
</Alert>