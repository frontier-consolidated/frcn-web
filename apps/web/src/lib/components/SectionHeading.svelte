<script lang="ts">
	import { twMerge } from "tailwind-merge";

    let clazz: string = ""
    export { clazz as class }

    export let spanClass = "text-lg font-semibold text-primary-600 dark:text-primary-500"
    export let divClass = "w-full h-px bg-primary-600 dark:bg-primary-500 mt-1"
</script>

<span class={twMerge(spanClass, clazz)}>
    <slot />
</span>
<div class={divClass}></div>