import { gql } from "$lib/graphql/__generated__";

export const CHANNEL_FRAGMENT = gql(`
    fragment ChannelFragment on DiscordChannel {
        id
        name
        type
        parentId
        sendMessages
    }
`);
