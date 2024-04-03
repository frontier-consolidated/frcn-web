import { gql } from "$lib/graphql/__generated__";

export const EVENT_FRAGMENT = gql(`
    fragment EventFragment on Event {
        id
        channel {
            ...EventChannelFragment
        }
        owner {
            ...UserFragment
        }
        name
        summary
        description
        imageUrl
        eventType
        location
        rsvp {
            pending
            rsvp
        }
        rsvpRoles: roles {
            id
            name
            emoji {
                id
                name
                image
            }
            limit
        }
        members {
            ...EventMemberFragment
        }
        posted
        duration
        startAt
        endedAt
        archived
        archivedAt
        updatedAt
        createdAt
    }
`);
