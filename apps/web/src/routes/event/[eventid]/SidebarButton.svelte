<script lang="ts">
	import { twMerge } from "tailwind-merge";

    export let spanClass = "ms-2";
</script>

<li>
    <button
        {...$$restProps}
        class={twMerge("w-full flex items-center px-4 py-1 text-base font-normal rounded clip-opposite-4 text-gray-900 dark:text-white bg-white hover:bg-gray-100 dark:bg-gray-800 dark:hover:bg-gray-700", $$restProps.class)}
        on:blur on:click on:focus on:keydown on:keypress on:keyup on:mouseenter on:mouseleave on:mouseover
    >
        <slot name="icon" />
        <span class={spanClass}><slot /></span>
    </button>
</li>