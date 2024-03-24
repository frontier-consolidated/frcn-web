import { gql } from "$lib/graphql/__generated__";

export const CONTENT_CONTAINER_FRAGMENT = gql(`
    fragment ContentContainerFragment on ContentContainer {
        id
        identifier
        type
        title
        content
        files {
            id
            identifier
            fileName
            fileSizeKb
            previewUrl
        }
        children {
            id
            identifier
            type
            title
            content
            files {
                id
                identifier
                fileName
                fileSizeKb
                previewUrl
            }
            parent {
                id
            }
        }
        parent {
            id
        }
    }
`);
