import { gql } from "../../__generated__";

export const KICK_EVENT_MEMBER = gql(`
	mutation KickEventMember($id: ID!) {
		kicked: kickEventMember(member: $id)
	}
`);
