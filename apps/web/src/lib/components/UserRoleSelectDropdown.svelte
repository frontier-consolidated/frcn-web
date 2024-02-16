<script lang="ts">
	import { Dropdown } from "flowbite-svelte";

	import type { RoleFragmentFragment } from "$lib/graphql/__generated__/graphql";

    export let filter: (role: RoleFragmentFragment) => boolean = () => true;
</script>

<Dropdown>

</Dropdown>