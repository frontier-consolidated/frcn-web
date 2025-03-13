<script lang="ts">
	import { Toaster as Sonner, type ToasterProps as SonnerProps } from "svelte-sonner";

	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	type $$Props = SonnerProps;
</script>

<Sonner
	toastOptions={{
		unstyled: true,
		classes: {
			toast:
				"flex items-center gap-[8px] w-[var(--width)] bg-card text-text text-[14px] px-[8px] pl-[12px] py-[4px] border border-[4px] border-border-solid font-sans [data-icon]:flex [data-icon]:items-center [data-icon]:size-[16px] [data-icon]:relative [data-icon]:shrink-0 [data-icon]:ml-[var(--toast-icon-margin-start)] [data-icon]:ml-[var(--toast-icon-margin-end)] [data-content]:flex [data-content]:flex-col [data-content]:gap-[4px]",
			title: "text-[16px]",
			description: "text-text-secondary",
			actionButton:
				"bg-button p-[4px] border border-b-[4px] border-border leading-none hover:opacity-80",
			cancelButton:
				"bg-button-secondary p-[4px] border border-b-[4px] border-border leading-none hover:opacity-80"
		}
	}}
	{...$$restProps}
/>
