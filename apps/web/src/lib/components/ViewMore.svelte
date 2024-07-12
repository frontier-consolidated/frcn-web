<script lang="ts">
	let has_more = false;
	let more = false;

	let div: HTMLElement;
	let observer: ResizeObserver;
	$: {
		if (div) {
			if (!observer) {
				observer = new ResizeObserver(() => {
					if (!div) return;
					has_more = more || div.scrollHeight > div.clientHeight;
				});
				observer.observe(div);
			}
			has_more = div.scrollHeight > div.clientHeight;
		}
	}
</script>

<div bind:this={div} class={more ? "" : "line-clamp-5"}>
	<slot />
</div>
{#if has_more}
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
