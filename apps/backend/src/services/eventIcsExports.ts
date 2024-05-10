import { EventType } from "@frcn/shared";
import type { EventsIcsExports, Prisma, User } from "@prisma/client";
import { v4 as uuidv4 } from "uuid";
import ics, { type EventAttributes } from "ics";

import { database } from "../database";
import { logger } from "../logger";


async function getIcsExport(id: number, accessKey: string): Promise<string> {
	const export_conf = await database.eventsIcsExports.findUnique({
		where: { id: id, accessKey: accessKey }
	});

	if(!export_conf) {
		return "";
	}

	const eventTypesOr: Prisma.EventWhereInput[] = [];

	export_conf.eventTypes.forEach((eventType) => {
		eventTypesOr.push({
			eventType: eventType
		});
	});

	const events = await database.event.findMany({
			where: {
				posted: true,
				ownerId: export_conf.onlyMyEvents ? export_conf.userId : undefined,
				OR: eventTypesOr.length > 0 ? eventTypesOr : undefined,
				NOT: {
					startAt: null
				}
			},
			include: {
				owner: true,
				channel: true
			}
	});

	logger.log(events);

	const eventConf: EventAttributes[]  = [];
	events.forEach((event) => {
		eventConf.push({
			start: event.startAt ? [event.startAt.getFullYear(), event.startAt.getMonth(), event.startAt.getDay(),
				event.startAt.getMinutes(), event.startAt.getSeconds()] : 0,
			duration: { seconds: event.duration ?? undefined },
			startInputType: "utc",
  			endInputType: "utc",
  			title: event.name,
			description: event.description,
			location: (event.channel ?
				"Discord Chanel: " +
					"https://discord.com/channels/" + event.channel.discordId + "/" + event.channel.id + "\n" : "") +
				(event.location ?
				"In PU: "+event.location.join(" -> ") : ""),
			url: "https://url-to-event-message.com",
			status: event.posted ? "CONFIRMED" : event.expired ? "CANCELLED" : undefined,
			categories: event.eventType ? [ event.eventType ] : undefined,
			alarms: [
				{ action: "display", description: "Reminder 1 Day", trigger: { days: 1, before: true } },
				{ action: "display", description: "Reminder 1 Hour", trigger: { hours: 1, before: true } },
				{ action: "display", description: "Reminder 30 Min", trigger: { minutes: 30, before: true } },
			]
		});
	});

	const { error, value } = ics.createEvents(eventConf);


	if (error) {
	  logger.error(error);
	  return "";
	}
	if (value === undefined) {
		logger.error("ics export value is undefined");
		return "";
	}

	logger.log(value);

	return value;
}

async function createIcsExport(owner: User, confName: string, only_my_events: boolean, eventTypes: EventType[], flags: Record<string, string> = {}) {
	const ics_export = await database.eventsIcsExports.create({
		data: {
			userId: owner.id,
			configName: confName,
			onlyMyEvents: only_my_events,
			eventTypes: generateEventTypes(eventTypes),
			flags: createFlags(flags),
			accessKey: createAccessKey(),
		},
	});

	return ics_export;
}

function generateEventTypes(eventTypes: EventType[]): string[] {
	const validatedEventTypes: EventType[] = [];
	eventTypes.forEach((eventType) => {
		if (Object.values(EventType).includes(eventType)) {
			validatedEventTypes.push(eventType);
		}
	});
	return validatedEventTypes;
}

function createFlags(flags: Record<string, string>): number {
		return 0;
}

function createAccessKey(): string {
		return uuidv4();
}


export const $icsExport = {
	getIcsExport,
	createIcsExport
};
