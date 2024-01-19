import { EventType } from "./enums";
import { getLocations } from "./locations";
import { testEventMembers, testUsers } from "./testUsers";
import type { Event } from "./types";

export const testEvents: Event[] = [
	{
		name: "Weekly Mining Event",
		owner: testUsers[0],
		summary: "Lorem ipsum, dolor sit amet consectetur adipisicing elit.",
		description:
			"Lorem ipsum dolor sit amet consectetur adipisicing elit. Quod quibusdam, exercitationem vero aliquid alias deserunt. Dolor quaerat pariatur eaque sapiente et a quo quas, cum necessitatibus nobis officiis suscipit consequuntur. Fuga, nisi delectus. Soluta temporibus, quasi fugiat in distinctio officiis eligendi dolores vitae. Molestias, laudantium iste at nam enim tempora harum accusamus reprehenderit qui temporibus assumenda dolorem a! Rerum, quos!",
		eventType: EventType.Mining,
		location: getLocations(["Stanton", "Crusader", "Yela"]),
		members: testEventMembers,
		roles: [
			{
				id: "3c90dbf0-bcfa-4f95-ac7a-280a7dcaa60b",
				name: "I am interested",
				limit: 0,
			},
		],
		settings: {
			hideLocation: false,
			inviteOnly: false,
			openToJoinRequests: true,
			allowTeamSwitching: false,
			allowCrewSwitching: false,
		},
		startAt: 1707559200000,
		endedAt: null,
		duration: 7200000,
		posted: false,
	},
	{
		name: "Combined Navy+Legion Op",
		owner: testUsers[0],
		summary: "Lorem ipsum, dolor sit amet consectetur adipisicing elit.",
		description:
			"Lorem ipsum dolor sit amet consectetur adipisicing elit. Quod quibusdam, exercitationem vero aliquid alias deserunt. Dolor quaerat pariatur eaque sapiente et a quo quas, cum necessitatibus nobis officiis suscipit consequuntur. Fuga, nisi delectus. Soluta temporibus, quasi fugiat in distinctio officiis eligendi dolores vitae. Molestias, laudantium iste at nam enim tempora harum accusamus reprehenderit qui temporibus assumenda dolorem a! Rerum, quos!",
		eventType: EventType.Combined,
		location: getLocations(["Stanton", "Hurston", "Everus Harbor"]),
		members: testEventMembers,
		roles: [
			{
				id: "a0358d68-6f00-4b93-b682-f90454fd46d2",
				name: "I am interested",
				limit: 0,
			},
		],
		settings: {
			hideLocation: false,
			inviteOnly: false,
			openToJoinRequests: true,
			allowTeamSwitching: false,
			allowCrewSwitching: false,
		},
		startAt: 1705697819000,
		endedAt: null,
		duration: 7200000,
		posted: true,
	},
];
