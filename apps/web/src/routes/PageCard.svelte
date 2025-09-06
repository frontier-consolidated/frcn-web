<script lang="ts">
	export let src: string;
	export let href: string;
	export let alt: string = "";
</script>

<a {href} class="clip-tr-8 overflow-hidden rounded">
	<figure
		class="relative h-36 cursor-pointer filter transition duration-300 hover:grayscale min-[480px]:h-48 sm:h-60"
	>
		<img class="h-full w-full object-cover" {src} {alt} />
		<figcaption
			class="text-md absolute bottom-0 flex w-full items-center bg-black bg-opacity-70 p-2 font-semibold text-white sm:p-4"
		>
			<slot />
		</figcaption>
	</figure>
</a>
