<script lang="ts">
	import { Button, Search } from "flowbite-svelte";

	import SectionHeading from "$lib/components/SectionHeading.svelte";

    // import type { PageData } from './$types';
    
    // export let data: PageData;
</script>

<SectionHeading>
    User Roles
</SectionHeading>
<div class="flex gap-2 px-2 mt-4">
    <Search size="md" />
    <Button class="shrink-0">
        Create Role
    </Button>
</div>