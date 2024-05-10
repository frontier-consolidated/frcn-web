import type { Context, RouteConfig } from "../context";
import { logger } from "../logger";
import { $icsExport } from "../services/eventIcsExports";
import { $events } from "../services/events"
import { EventType } from "@frcn/shared";


export default function route(context: Context, config: RouteConfig) {
	context.expressApp.post("/events_export", (req, res) => {
		// create new export link
		if (!req.user) {
			return res.status(401).send({
				message: "Must be authenticated"
			});
		}

		const data = req.body as {
			name: string,
			onlyMyEvents: boolean,
			eventTypes: EventType[]
		};

		$icsExport.createIcsExport(req.user, data.name, data.onlyMyEvents, data.eventTypes).then(r => {
			res.send({
				"id": r.id,
				"accessKey": r.accessKey
			});
		});

	});
	
	context.expressApp.put("/events_export/:exportId", (req, res) => {
		// edit export link
		if (!req.user) {
			return res.status(401).send({
				message: "Must be authenticated"
			});
		}

		// if user id = ics Export user id save the edit

		res.sendStatus(200);
	});
	
	context.expressApp.delete("/events_export/:exportId", (req, res) => {
		// delete export link
		if (!req.user) {
			return res.status(401).send({
				message: "Must be authenticated"
			});
		}

		// if user id = ics Export user id delete the export
		
		res.sendStatus(200);
	});
	
	context.expressApp.get("/events_export/:exportId", (req, res) => {
		// get ICS export
		const exportId: number = parseInt(req.params.exportId);
		const accessKey: string = req.query["access_key"]+"";

		$icsExport.getIcsExport(exportId, accessKey).then((events) => {
			res.status(200);
			res.header({
				"Content-type" : "text/calendar",

			});
			res.send(events);
		});
	});
}
