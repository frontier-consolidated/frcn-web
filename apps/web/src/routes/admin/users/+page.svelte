<script lang="ts">
	import { goto } from "$app/navigation";
	import { page } from "$app/stores";
	import { Avatar, Pagination, Search } from "flowbite-svelte";
	import { queryParam } from "sveltekit-search-params";

	import { Head, SectionHeading } from "$lib/components";
	import { getCurrentPage, getPageUrl, getPages } from "$lib/pageHelpers";
	import { viewUserProfile } from "$lib/stores/UserProfileViewStore";

    import type { PageData } from "./$types";
    
    export let data: PageData;

    const search = queryParam("q");
    let searchInput = $search;

    $: currentPage = getCurrentPage($page.url.searchParams);
	$: pages = getPages($page.url, currentPage, data.itemsPerPage, data.total);
</script>

<Head
	title="Users - Admin"
/>

<SectionHeading>
    Users
</SectionHeading>
<div class="flex items-center gap-2 px-2 my-4">
    <Search size="md" class="rounded" 
        bind:value={searchInput}
        on:keydown={(e) => {
            if (e.key === "Enter") search.set(searchInput);
        }} 
        on:blur={() => {
            search.set(searchInput);
        }} 
    />
    <Pagination
        {pages}
        on:previous={() => { if (data.prevPage != null) goto(getPageUrl($page.url, data.prevPage + 1)); }}
        on:next={() => { if (data.nextPage != null) goto(getPageUrl($page.url, data.nextPage + 1)); }}
    />
</div>
<div class="flex flex-col gap-1 px-4 max-h-screen overflow-y-auto">
    {#each data.users as user}
        <button class="flex justify-between items-center p-2 pe-4 rounded cursor-pointer dark:hover:bg-gray-800" on:click={() => {
            viewUserProfile(user.id);
        }}>
            <div class="flex items-center gap-2">
                <Avatar rounded size="sm" src={user.avatarUrl} />
                <span class="text-md font-semibold dark:text-white">{user.name}</span>
            </div>
        </button>
    {/each}
</div>