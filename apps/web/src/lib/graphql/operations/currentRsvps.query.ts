import { gql } from "../__generated__";

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
					name
					summary
					description
					eventType
					location
					owner {
						id
						name
						scName
						avatarUrl
						verified
						updatedAt
						createdAt
					}
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
