import { Coda } from "coda-js";
import type { Event, EventUser, User } from "@prisma/client";

const legionCoda = new Coda(process.env.INTEGRATION_LEGION_CODA_TOKEN);

export async function insertEventIntoLegionCoda(
	legionEventId: string,
	event: Event & {
		owner: User | null;
		members: (EventUser & { user: { discordName: string } | null })[];
	}
) {
	const table = await legionCoda.getTable(
		process.env.INTEGRATION_LEGION_CODA_DOC_ID,
		process.env.INTEGRATION_LEGION_CODA_TABLE_ID
	);

	const startDate = event.startAt?.toISOString() ?? new Date().toISOString();

	await table.insertRows([
		{
			"Event ID": legionEventId,
			Date: startDate,
			"Event Name": event.name,
			Attending: "",
			Description: event.description,
			"Post-Op Feedback": "",
			"Certifications Assigned": "",
			"Start date and time": "",
			Maybe: "",
			Attended: "",
			Squad: "",
			Participants: event.members
				.filter((member) => member.user)
				.map((member) => member.user?.discordName.replace(/,/g, "_"))
				.join(","),
			"Start date": startDate,
			"End date": event.endedAt?.toISOString() ?? startDate,
			Person: event.owner?.discordName ?? "[Unknown]",
			"Time zone": "EU"
		}
	]);
}
