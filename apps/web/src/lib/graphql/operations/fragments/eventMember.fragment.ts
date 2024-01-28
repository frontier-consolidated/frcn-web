import { gql } from "$lib/graphql/__generated__";

export const EVENT_MEMBER_FRAGMENT = gql(`
    fragment EventMemberFragment on EventMember {
        id
        pending
        user {
            ...EventUserFragment
        }
        rsvp
        rsvpAt
    }
`);
