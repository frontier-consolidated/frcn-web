<script lang="ts">
	let hasMore = false;
	let more = false;

	let div: HTMLElement;
	let observer: ResizeObserver;
	$: {
		if (div) {
			if (!observer) {
				observer = new ResizeObserver(() => {
					hasMore = more || div.scrollHeight > div.clientHeight;
				});
				observer.observe(div);
			}
			hasMore = div.scrollHeight > div.clientHeight;
		}
	}
</script>

<div bind:this={div} class={more ? "" : "line-clamp-5"}>
	<slot />
</div>
{#if hasMore}
	<span
		role="button"
		tabindex="0"
		class="dark:text-primary-500 hover:underline cursor-pointer"
		on:click={() => (more = !more)}
		on:keydown={(ev) => {
			if (ev.key == "Enter") more = !more;
		}}
	>
		{#if more}
			View less
		{:else}
			View more
		{/if}
	</span>
{/if}
