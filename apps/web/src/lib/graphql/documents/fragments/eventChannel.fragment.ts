import { gql } from "$lib/graphql/__generated__";

export const EVENT_CHANNEL_FRAGMENT = gql(`
    fragment EventChannelFragment on EventChannel {
        id
        discord {
            ...ChannelFragment
        }
    }
`);
