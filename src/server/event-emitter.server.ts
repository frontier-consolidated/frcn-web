import { EventEmitter } from "events";

import type { User, UserMemberCard } from "@prisma/client";

type EventMap = {
	user_created: [User];
	user_updated: [User];
	user_deleted: [User];
	user_member_card_updated: [UserMemberCard];
};

export const event_emitter = new EventEmitter<EventMap>();
