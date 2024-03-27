import { gql } from "$lib/graphql/__generated__";

export const CONTENT_CONTAINER_FILE_FRAGMENT = gql(`
    fragment ContentContainerFileFragment on ContentContainerFile {
        id
        identifier
        fileName
        fileSizeKb
        contentType
        previewUrl
    }
`);
