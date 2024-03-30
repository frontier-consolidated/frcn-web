import { gql } from "$lib/graphql/__generated__";

export const CONTENT_CONTAINER_FRAGMENT = gql(`
    fragment ContentContainerFragment on ContentContainer {
        id
        identifier
        type
        title
        content
        files {
            ...ContentContainerFileFragment
        }
        parent {
            id
        }
    }
`);
