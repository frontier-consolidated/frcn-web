<script lang="ts" context="module">
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	import type { FormPath, SuperForm } from "sveltekit-superforms";
</script>

<script lang="ts" generics="T extends Record<string, unknown>, U extends FormPath<T>">
	import * as FormSnap from "formsnap";
	import type { HTMLAttributes } from "svelte/elements";

	// eslint-disable-next-line no-undef, @typescript-eslint/no-unused-vars
	type $$Props = FormSnap.FieldProps<T, U> & HTMLAttributes<HTMLElement>;

	// eslint-disable-next-line no-undef
	export let form: SuperForm<T>;
	// eslint-disable-next-line no-undef
	export let name: U;
</script>

<FormSnap.Field {form} {name} let:constraints let:errors let:tainted let:value>
	<div class={$$restProps.class}>
		<slot {constraints} {errors} {tainted} {value} />
	</div>
</FormSnap.Field>
