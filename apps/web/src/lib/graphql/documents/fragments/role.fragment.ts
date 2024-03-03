import { gql } from "$lib/graphql/__generated__";

export const ROLE_FRAGMENT = gql(`
    fragment RoleFragment on UserRole {
        id
        name
        primary
        discordId
        permissions
        updatedAt
        createdAt
    }
`);
