import type { EventType } from "./enums";
import type { AnyLocation } from "./locations/types";

export type User = {
	id: string;
	scName: string;
	discordNickname: string;
	status?: string;
};

export type RSVPRole = {
	id: string;
	name: string;
	limit: number;
};

export type EventUser = {
	user: User;
	rsvpId?: string;
	pending: boolean;
};

export type Event = {
	name: string;
	owner: User;
	summary: string;
	description: string;
	eventType: EventType;
	location: AnyLocation[];
	roles: RSVPRole[];
	members: EventUser[];
	settings: {
		hideLocation: boolean;
		inviteOnly: boolean;
		openToJoinRequests: boolean;
		allowTeamSwitching: boolean;
		allowCrewSwitching: boolean;
	};
	startAt: number | null;
	endedAt: number | null;
	duration: number | null;
	posted: boolean;
};
