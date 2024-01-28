<script lang="ts">
    let clazz: string = ""
    export { clazz as class }

    export let spanClass = "text-lg font-semibold dark:text-primary-500"
    export let divClass = "w-full h-0.5 dark:bg-primary-500 mt-1"
</script>

<span class="{spanClass} {clazz}">
    <slot />
</span>
<div class={divClass}></div>