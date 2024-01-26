import { gql } from "$lib/graphql/__generated__";

export const EVENT_FRAGMENT = gql(`
    fragment EventFragment on Event {
        id
        channel {
            ...ChannelFragment
        }
        owner {
            id
            name
            discordName
            avatarUrl
            verified
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
        roles {
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
        updatedAt
        createdAt
    }
`);
