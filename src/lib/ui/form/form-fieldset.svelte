<script lang="ts" context="module">
	import type { FormPath, SuperForm } from "sveltekit-superforms";
	type T = Record<string, unknown>;
	type U = FormPath<T>;
</script>

<script lang="ts" generics="T extends Record<string, unknown>, U extends FormPath<T>">
	import * as FormSnap from "formsnap";

	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	type $$Props = FormSnap.FieldsetProps<T, U>;

	export let form: SuperForm<T>;
	export let name: U;
</script>

<FormSnap.Fieldset
	{form}
	{name}
	let:constraints
	let:errors
	let:tainted
	let:value
	class={$$restProps.class}
>
	<slot {constraints} {errors} {tainted} {value} />
</FormSnap.Fieldset>
