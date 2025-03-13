<script lang="ts">
	import * as FormSnap from "formsnap";
	import { twMerge } from "tailwind-merge";

	type $$Props = FormSnap.FieldErrorsProps & {
		errorClass?: string | undefined | null;
	};

	export let errorClass: $$Props["errorClass"] = undefined;
</script>

<FormSnap.FieldErrors
	{...$$restProps}
	class={twMerge("text-[12px] text-text-destructive", $$restProps.class)}
	let:errors
	let:fieldErrorsAttrs
	let:errorAttrs
>
	<slot {errors} {fieldErrorsAttrs} {errorAttrs}>
		{#each errors as error}
			<div {...errorAttrs} class={errorClass}>{error}</div>
		{/each}
	</slot>
</FormSnap.FieldErrors>
