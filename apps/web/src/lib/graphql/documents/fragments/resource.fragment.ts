import { gql } from "$lib/graphql/__generated__";

export const RESOURCE_FRAGMENT = gql(`
    fragment ResourceFragment on Resource {
        id
        owner {
            ...UserFragment
        }
        name
        sizeKb
        shortDescription
        previewUrl
        downloadUrl
        tags
        updatedAt
        createdAt
    }
`);
