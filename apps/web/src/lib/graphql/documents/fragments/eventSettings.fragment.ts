import { gql } from "$lib/graphql/__generated__";

export const EVENT_SETTINGS_FRAGMENT = gql(`
    fragment EventSettingsFragment on Event {
        mentions
        settings {
            hideLocation
            inviteOnly
            openToJoinRequests
            allowTeamSwitching
            allowCrewSwitching
        }
        accessType
        accessRoles {
            id
            name
        }
    }
`);