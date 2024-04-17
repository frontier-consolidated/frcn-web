<script lang="ts">
	import { List, Modal, A, Heading, Checkbox, Button, Toggle, Input, Label } from "flowbite-svelte";
	import { Hr } from "$lib/components";
	import { EventTypeOptions } from "@frcn/shared";
	import { Routes, api } from "$lib/api";
	import { ClipboardButton } from "$lib/components";
    export let open: boolean = false;

	let eventTypes = EventTypeOptions;

	const eventTypes1 = eventTypes.slice(0, Math.ceil(eventTypes.length/2));
	const eventTypes2 = eventTypes.slice(Math.ceil(eventTypes.length/2));

	const linkData = { "id": 0, "accessKey": "" };
	let showLink: boolean = false;
</script>

<Modal size="md" title="Event ICS Export" placement="center" bind:open bodyClass="overflow-y-visible" on:close={async () => { showLink = false; }}>
	<div>
		<p>You can create an ICS export link to import events into your personal calender.</p>
		<p>after you configured your calender with the ICS link your calendar will automatically import new Events.</p>
		<p>For an explanation on how pleas refer to the documentation of your personal calender:</p>
		<List tag="ul">
			<li><A target="_blank" href="https://support.google.com/calendar/answer/37648?hl=en#zippy=%2Cget-your-calendar-view-only">Google Calender</A></li>
			<li><A target="_blank" href="https://support.microsoft.com/de-de/office/importieren-oder-abonnieren-eines-kalenders-in-outlook-com-oder-outlook-im-web-cff1429c-5af6-41ec-a5b4-74f2c278e98c">Outlook Calender</A></li>
			<li>For other Calenders there should be a Support page on the topic</li>
		</List>
	</div>
	<Hr />
	<Heading tag="h4">Configuration</Heading>
	{#if !showLink}
		<form on:submit|preventDefault={async (event) => {
						const formData = new FormData(event.target);
						let onlyMyEvents = !!(formData.get("only_my_events"));
						const response = await api.post(Routes.createIcsExport(), {
							name: formData.get("conf_name"),
							onlyMyEvents: onlyMyEvents,
							eventTypes: formData.getAll("event_types"),
						});
						linkData.id = response.data.id;
						linkData.accessKey = response.data.accessKey;
						showLink = true;
				}}>
			<div class="mb-5 pr-5">
				<div class="grid grid-cols-3 gap-4">
					<div class="col-span-2">
						<Label for="conf_name" class="mb-2">Configuration Name</Label>
						<Input type="text" id="conf_name" name="conf_name" placeholder="Give your Config a name" required />
					</div>
					<div class="pt-5">
						<Toggle name="only_my_events" value="true" class="p-3">Only my Events</Toggle>
					</div>
				</div>
			</div>
			<div class="grid grid-cols-2 gap-4 mb-11">
				<div>
					{#each eventTypes1 as eventType1}
						<div class="rounded border border-gray-200 dark:border-gray-700">
							<Checkbox name="event_types" value="{eventType1.value}" class="p-3">{eventType1.name}</Checkbox>
						</div>
					{/each}
				</div>
				<div>
					{#each eventTypes2 as eventType2}
						<div class="rounded border border-gray-200 dark:border-gray-700">
							<Checkbox name="event_types" value="{eventType2.value}" class="p-3">{eventType2.name}</Checkbox>
						</div>
					{/each}
				</div>
			</div>
			<Button type="submit">Create Link
			</Button>
		</form>
	{:else }
		<div>
			{api.getUri()+Routes.getIcsExport(linkData.id, linkData.accessKey)}
			<br/>
			<ClipboardButton copyText={api.getUri()+Routes.getIcsExport(linkData.id, linkData.accessKey)} />
		</div>
	{/if}
</Modal>