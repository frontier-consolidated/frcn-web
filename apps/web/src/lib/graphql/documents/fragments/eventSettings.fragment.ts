import { gql } from "$lib/graphql/__generated__";

export const EVENT_SETTINGS_FRAGMENT = gql(`
    fragment EventSettingsFragment on Event {
        mentions
        settings {
            createEventThread
            hideLocation
            inviteOnly
            openToJoinRequests
        }
        accessType
        accessRoles {
            id
            name
        }
    }
`);
