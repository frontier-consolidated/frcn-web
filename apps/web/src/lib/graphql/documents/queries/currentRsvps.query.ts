import { gql } from "../../__generated__";

export const CURRENT_RSVPS = gql(`
	query GetCurrentRsvps {
		rsvps: getCurrentUser {
			rsvps {
				invite
				rsvpAt
				rsvp {
					id
					name
				}
				event {
					id
					owner {
						id
						name
						scName
						avatarUrl
						verified
						updatedAt
						createdAt
					}
					name
					summary
					description
					imageUrl
					eventType
					location
					duration
					startAt
					endedAt
					updatedAt
					createdAt
				}
			}
		}
	}
`);
