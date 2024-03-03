import { gql } from "$lib/graphql/__generated__";

export const EVENT_SETTINGS_FRAGMENT = gql(`
    fragment EventSettingsFragment on Event {
        mentions
        settings {
            hideLocation
            inviteOnly
            openToJoinRequests
            allowTeamSwitching
        }
        accessType
        accessRoles {
            id
            name
        }
    }
`);
