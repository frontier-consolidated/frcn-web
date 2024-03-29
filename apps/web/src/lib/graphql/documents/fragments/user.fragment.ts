import { gql } from "$lib/graphql/__generated__";

export const USER_FRAGMENT = gql(`
    fragment UserFragment on User {
        id
        name
        scName
        discordName
        verified
        avatarUrl
        primaryRole {
            id
            name
        }
        roles {
            id
            name
        }
        updatedAt
        createdAt
    }
`);
