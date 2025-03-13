<script lang="ts">
	function extract_view_box(svg: string) {
		const regex = /viewBox="([\d\- .]+)"/;
		const res = regex.exec(svg);
		if (!res) return "0 0 20 20"; // default value
		return res[1];
	}

	export let svg = "";
	export let viewBox = extract_view_box(svg);

	export let size: string | number = "20px";
	export let width: string | number = size;
	export let height: string | number = size;

	export let color = "currentColor";
	export let stroke = "none";
	export let fill = color;

	export let title = "";

	$: elements = svg.replace(/<svg[ \n]([^>]*)>/, "").replace("</svg>", "");
</script>

<svg xmlns="http://www.w3.org/2000/svg" {width} {height} {viewBox} {stroke} {fill} {...$$restProps}>
	{#if title}
		<title>{title}</title>
	{/if}
	<!-- eslint-disable-next-line svelte/no-at-html-tags -->
	{@html elements}
</svg>
