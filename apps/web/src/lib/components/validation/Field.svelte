<script lang="ts">
    import * as dom from "@floating-ui/dom";
	import { Frame } from "flowbite-svelte";
	import { CheckCircleSolid, ExclamationCircleSolid } from "flowbite-svelte-icons";
    import { onMount } from "svelte";

	import type { FieldValidator, ValidateFn } from "./FieldValidator";

    // eslint-disable-next-line no-undef
	type T = $$Generic;

    let reference: string;
    export { reference as for };
    export let validator: FieldValidator;
    export let value: T;
    export let required = false;
    export let validate: ValidateFn<T> | undefined = undefined;
    export let validateEmpty: ((value: T) => boolean) | undefined = undefined;

    const is_empty =
        validateEmpty ??
		((v: T) => v === undefined || v === null || ((Array.isArray(v) || typeof v === "string" || (typeof FileList !== "undefined" && v instanceof FileList)) && v.length === 0));

    let show_message = false;
    let valid: boolean = true, msg: string | null = null;

    function internal_validate(val: T, ignore_required = false) {
        let new_valid = true, new_msg: string | null = null;

        if (required && is_empty(val) && !ignore_required) {
            new_valid = false;
            new_msg = "Field is required";
        } else if (validate) {
            [new_valid, new_msg] = validate(value);
        }

        valid = new_valid;
        msg = new_msg;

        return valid;
    }

    $: {
        validate;
        validator.addField(`field-${reference}`, (ignore_required) => {
            show_message = true;
            return internal_validate(value, ignore_required);
        });
    }

    $: {
        show_message = false;
        internal_validate(value);
    }

    const offset = 8;
    const px = (n?: number | null) => (n != null ? `${n}px` : "");

    let content_el: HTMLElement;
    let floating_el: HTMLElement;
    let arrow_el: Element | null = null;
    let reference_el: Element | null = null;

    $: middleware = [dom.shift(), dom.offset(+offset)];
    function update_position() {
        dom.computePosition(reference_el!, floating_el, { placement: "top-start", strategy: "absolute", middleware }).then(({ x, y, strategy }) => {
            floating_el.style.position = strategy;
            floating_el.style.left = px(x);
            floating_el.style.top = px(y);
            if (arrow_el instanceof HTMLDivElement) {
                arrow_el.style.left = px((floating_el.offsetWidth / 2 - 1) - (arrow_el.offsetWidth / 2 - 1));
                arrow_el.style.bottom = px(-arrow_el.offsetWidth / 2 - 1);
            }
        });
    }

    function init(node: HTMLElement, _reference_el: Element) {
        floating_el = node;
        let cleanup = dom.autoUpdate(_reference_el, floating_el, update_position);
        return {
            update(_reference_el: Element) {
                cleanup();
                cleanup = dom.autoUpdate(_reference_el, floating_el, update_position);
            },
            destroy() {
                cleanup();
            }
        };
    }

    function init_arrow(node: HTMLElement) {
        arrow_el = node;
        return {
            destroy() {
                arrow_el = null;
            }
        };
    }
    
    onMount(() => {
        reference_el = document.querySelector(`#${reference}`) ?? content_el!.previousElementSibling;
        if (!reference_el) {
            console.error(`Popup reference not found: '#${reference}'`);
        }

        return () => {
            validator.removeField(`field-${reference}`);
        };
    });
</script>

<field for={reference}>
    <slot {valid} {msg} />
    <slot name="popover" {valid} {msg}>
        {#if !reference_el}
            <div bind:this={content_el} />
        {:else if msg && show_message}
            <Frame data-for={reference} use={init} border shadow rounded options={reference_el} role="tooltip" tabindex={-1} class="dark:!border-gray-600">
                <div class="flex items-center py-2 px-3 text-sm font-medium text-red-500">
                    {#if !valid}
                        <ExclamationCircleSolid class="me-2" tabindex="-1" />
                    {:else}
                        <CheckCircleSolid class="me-2" tabindex="-1" />
                    {/if}
                    {msg}
                </div>
                <div use:init_arrow class="absolute pointer-events-none block w-[10px] h-[10px] rotate-45 bg-inherit border-inherit border-b border-e" />
            </Frame>
        {/if}
    </slot>
</field>