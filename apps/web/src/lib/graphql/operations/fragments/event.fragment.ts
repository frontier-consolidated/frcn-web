import { gql } from "$lib/graphql/__generated__";

export const EVENT_FRAGMENT = gql(`
    fragment EventFragment on Event {
        id
        channel {
            ...ChannelFragment
        }
        owner {
            ...EventUserFragment
        }
        name
        summary
        description
        eventType
        location
        roles {
            id
            name
            limit
        }
        members {
            id
            pending
            rsvp
            user {
                ...EventUserFragment
            }
            rsvpAt
        }
        posted
        duration
        startAt
        endedAt
        updatedAt
        createdAt
    }
`);
