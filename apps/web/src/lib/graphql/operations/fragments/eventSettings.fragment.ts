import { gql } from "$lib/graphql/__generated__";

export const EVENT_SETTINGS_FRAGMENT = gql(`
    fragment EventSettingsFragment on Event {
        accessType
        accessRoles {
            id
            name
        }
        settings {
            hideLocation
            inviteOnly
            openToJoinRequests
            allowTeamSwitching
            allowCrewSwitching
        }
    }
`);
