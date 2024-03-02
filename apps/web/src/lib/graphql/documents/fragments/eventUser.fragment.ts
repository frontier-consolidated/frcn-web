import { gql } from "$lib/graphql/__generated__";

export const EVENT_USER_FRAGMENT = gql(`
    fragment EventUserFragment on User {
        id
        name
        discordName
        avatarUrl
        verified
        status {
            activity
            ship
        }
    }
`);
