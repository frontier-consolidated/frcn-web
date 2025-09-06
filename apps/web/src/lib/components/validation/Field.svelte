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

	const isEmpty =
		validateEmpty ??
		((v: T) =>
			v === undefined ||
			v === null ||
			((Array.isArray(v) ||
				typeof v === "string" ||
				(typeof FileList !== "undefined" && v instanceof FileList)) &&
				v.length === 0));

	let showMessage = false;
	let valid: boolean = true,
		msg: string | null = null;

	function internalValidate(val: T, ignoreRequired = false) {
		let newValid = true,
			newMsg: string | null = null;

		if (required && isEmpty(val) && !ignoreRequired) {
			newValid = false;
			newMsg = "Field is required";
		} else if (validate) {
			[newValid, newMsg] = validate(value);
		}

		valid = newValid;
		msg = newMsg;

		return valid;
	}

	$: {
		validate;
		validator.addField(`field-${reference}`, (ignoreRequired) => {
			showMessage = true;
			return internalValidate(value, ignoreRequired);
		});
	}

	$: {
		showMessage = false;
		internalValidate(value);
	}

	const offset = 8;
	const px = (n?: number | null) => (n != null ? `${n}px` : "");

	let contentEl: HTMLElement;
	let floatingEl: HTMLElement;
	let arrowEl: Element | null = null;
	let referenceEl: Element | null = null;

	$: middleware = [dom.shift(), dom.offset(+offset)];
	function updatePosition() {
		dom
			.computePosition(referenceEl!, floatingEl, {
				placement: "top-start",
				strategy: "absolute",
				middleware
			})
			.then(({ x, y, strategy }) => {
				floatingEl.style.position = strategy;
				floatingEl.style.left = px(x);
				floatingEl.style.top = px(y);
				if (arrowEl instanceof HTMLDivElement) {
					arrowEl.style.left = px(floatingEl.offsetWidth / 2 - 1 - (arrowEl.offsetWidth / 2 - 1));
					arrowEl.style.bottom = px(-arrowEl.offsetWidth / 2 - 1);
				}
			});
	}

	function init(node: HTMLElement, _referenceEl: Element) {
		floatingEl = node;
		let cleanup = dom.autoUpdate(_referenceEl, floatingEl, updatePosition);
		return {
			update(_referenceEl: Element) {
				cleanup();
				cleanup = dom.autoUpdate(_referenceEl, floatingEl, updatePosition);
			},
			destroy() {
				cleanup();
			}
		};
	}

	function initArrow(node: HTMLElement) {
		arrowEl = node;
		return {
			destroy() {
				arrowEl = null;
			}
		};
	}

	onMount(() => {
		referenceEl = document.querySelector(`#${reference}`) ?? contentEl!.previousElementSibling;
		if (!referenceEl) {
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
		{#if !referenceEl}
			<div bind:this={contentEl} />
		{:else if msg && showMessage}
			<Frame
				data-for={reference}
				use={init}
				border
				shadow
				rounded
				options={referenceEl}
				role="tooltip"
				tabindex={-1}
				class="dark:!border-gray-600"
			>
				<div class="flex items-center px-3 py-2 text-sm font-medium text-red-500">
					{#if !valid}
						<ExclamationCircleSolid class="me-2" tabindex="-1" />
					{:else}
						<CheckCircleSolid class="me-2" tabindex="-1" />
					{/if}
					{msg}
				</div>
				<div
					use:initArrow
					class="pointer-events-none absolute block h-[10px] w-[10px] rotate-45 border-b border-e border-inherit bg-inherit"
				/>
			</Frame>
		{/if}
	</slot>
</field>
