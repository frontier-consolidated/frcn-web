<script lang="ts">
	import { Button } from "flowbite-svelte";
	import { getContext } from "svelte";
	import { twMerge } from "tailwind-merge";

    const size_classes = {
        xs: "px-3 py-2 text-xs",
        sm: "px-4 py-2 text-sm",
        md: "px-5 py-2.5 text-sm",
        lg: "px-5 py-3 text-base",
        xl: "px-6 py-3.5 text-base"
    };

    const outline_classes = {
        alternative: "bg-gray-800 dark:bg-gray-600",
        blue: "bg-blue-700 dark:bg-blue-500",
        dark: "bg-gray-800 dark:bg-gray-600",
        green: "bg-green-700 dark:bg-green-500",
        light: "bg-gray-200 dark:bg-gray-600",
        primary: "bg-primary-700 dark:bg-primary-500",
        purple: "bg-purple-700 dark:bg-purple-400",
        red: "bg-red-700 dark:bg-red-500",
        yellow: "bg-yellow-400 dark:bg-yellow-300",
        none: ""
    };

    const border_classes = {
        alternative: "bg-gray-200 hover:bg-gray-200 dark:bg-gray-600 dark:hover:bg-gray-700",
        blue: "",
        dark: "",
        green: "",
        light: "bg-gray-300 hover:bg-gray-300 dark:bg-gray-600 dark:hover:bg-gray-600",
        primary: "",
        purple: "",
        red: "",
        yellow: "",
        none: ""
    };

    const inner_border_classes = {
        alternative: "bg-white group-hover:bg-gray-100 dark:bg-gray-950 dark:group-hover:bg-gray-950",
        blue: "",
        dark: "",
        green: "",
        light: "bg-white group-hover:bg-gray-100 dark:bg-gray-800 dark:group-hover:bg-gray-700",
        primary: "",
        purple: "",
        red: "",
        yellow: "",
        none: ""
    };

    const outline_bg_classes = {
        alternative: "",
        blue: "",
        dark: "",
        green: "",
        light: "bg-white dark:bg-gray-700",
        primary: "",
        purple: "",
        red: "",
        yellow: "",
        none: "bg-transparent dark:bg-transparent"
    };

    const group = getContext("group");

    export let size: keyof typeof size_classes = group ? "sm" : "md";
    export let outline: boolean = false;
    export let color: "red" | "yellow" | "green" | "purple" | "blue" | "light" | "dark" | "primary" | "none" | "alternative" = group ? (outline ? "dark" : "alternative") : "primary";
    export let clip: string = "clip-opposite-4";
    export let outlineBgColor: string = "bg-neutral-200 dark:bg-gray-950";

    export let classInner = "";

    $: classRounded = ($$restProps.class as string ?? "").split(" ").filter(clazz => clazz.includes("rounded")).join(" ");
</script>

<Button {...$$restProps} class={twMerge("group rounded", clip, (outline || border_classes[color]) && "border-none p-px", outline && outline_classes[color], !outline && border_classes[color], $$restProps.class)} {outline} {color} {size}  on:click on:change on:keydown on:keyup on:touchstart on:touchend on:touchcancel on:mouseenter on:mouseleave>
    {#if outline}
        <div class={twMerge("w-full h-full inline-flex items-center justify-center group-hover:bg-transparent", outlineBgColor, outline_bg_classes[color], clip, size_classes[size], classRounded || "rounded", classInner)}>
            <slot />
        </div>
    {:else if border_classes[color]}
        <div class={twMerge("w-full h-full inline-flex items-center justify-center", clip, size_classes[size], inner_border_classes[color], classRounded || "rounded", classInner)}>
            <slot />
        </div>
    {:else}
        <slot />
    {/if}
</Button>