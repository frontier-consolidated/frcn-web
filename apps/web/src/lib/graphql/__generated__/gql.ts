/* eslint-disable */
import * as types from './graphql';
import type { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';

/**
 * Map of all GraphQL operations in the project.
 *
 * This map has several performance disadvantages:
 * 1. It is not tree-shakeable, so it will include all operations in the project.
 * 2. It is not minifiable, so the string of a GraphQL query will be multiple times inside the bundle.
 * 3. It does not support dead code elimination, so it will add unused operations.
 *
 * Therefore it is highly recommended to use the babel or swc plugin for production.
 */
const documents = {
    "\n\tmutation CreateEvent {\n\t\tevent: createEvent\n\t}\n": types.CreateEventDocument,
    "\n\tquery GetCurrentRsvps {\n\t\trsvps: getCurrentUser {\n\t\t\trsvps {\n\t\t\t\tinvite\n\t\t\t\trsvpAt\n\t\t\t\trsvp {\n\t\t\t\t\tid\n\t\t\t\t\tname\n\t\t\t\t}\n\t\t\t\tevent {\n\t\t\t\t\tid\n\t\t\t\t\tname\n\t\t\t\t\tsummary\n\t\t\t\t\tdescription\n\t\t\t\t\teventType\n\t\t\t\t\tlocation\n\t\t\t\t\towner {\n\t\t\t\t\t\tid\n\t\t\t\t\t\tname\n\t\t\t\t\t\tscName\n\t\t\t\t\t\tavatarUrl\n\t\t\t\t\t\tverified\n\t\t\t\t\t\tupdatedAt\n\t\t\t\t\t\tcreatedAt\n\t\t\t\t\t}\n\t\t\t\t\tduration\n\t\t\t\t\tstartAt\n\t\t\t\t\tendedAt\n\t\t\t\t\tupdatedAt\n\t\t\t\t\tcreatedAt\n\t\t\t\t}\n\t\t\t}\n\t\t}\n\t}\n": types.GetCurrentRsvpsDocument,
    "\n\tquery GetCurrentUser {\n\t\tuser: getCurrentUser {\n\t\t\tid\n\t\t\tname\n\t\t\tscName\n\t\t\tavatarUrl\n\t\t\tverified\n\t\t\tpermissions\n\t\t\tprimaryRole {\n\t\t\t\tid\n\t\t\t\tname\n\t\t\t}\n\t\t\troles {\n\t\t\t\tid\n\t\t\t\tname\n\t\t\t}\n\t\t\tsettings {\n\t\t\t\tupdatedAt\n\t\t\t}\n\t\t\tstatus {\n\t\t\t\tactivity\n\t\t\t\tship\n\t\t\t\tupdatedAt\n\t\t\t}\n\t\t\tupdatedAt\n\t\t\tcreatedAt\n\t\t}\n\t}\n": types.GetCurrentUserDocument,
    "\n\tmutation EditEvent($editEventId: ID!, $data: EventEditInput!) {\n\t\tevent: editEvent(id: $editEventId, data: $data) {\n\t\t\t...EventFragment\n\t\t\t...EventSettingsFragment\n\t\t}\n\t}\n": types.EditEventDocument,
    "\n    fragment ChannelFragment on DiscordChannel {\n        id\n        name\n        type\n    }\n": types.ChannelFragmentFragmentDoc,
    "\n    fragment EventFragment on Event {\n        id\n        channel {\n            ...ChannelFragment\n        }\n        owner {\n            ...EventUserFragment\n        }\n        name\n        summary\n        description\n        eventType\n        location\n        roles {\n            id\n            name\n            limit\n        }\n        members {\n            id\n            pending\n            rsvp\n            user {\n                ...EventUserFragment\n            }\n            rsvpAt\n        }\n        posted\n        duration\n        startAt\n        endedAt\n        updatedAt\n        createdAt\n    }\n": types.EventFragmentFragmentDoc,
    "\n    fragment EventSettingsFragment on Event {\n        accessType\n        accessRoles {\n            id\n            name\n        }\n        settings {\n            hideLocation\n            inviteOnly\n            openToJoinRequests\n            allowTeamSwitching\n            allowCrewSwitching\n        }\n    }\n": types.EventSettingsFragmentFragmentDoc,
    "\n    fragment EventUserFragment on PartialUser {\n        id\n        name\n        discordName\n        avatarUrl\n        verified\n    }\n": types.EventUserFragmentFragmentDoc,
    "\n\tquery GetEvent($eventId: ID!) {\n\t\tevent: getEvent(id: $eventId) {\n\t\t\t...EventFragment\n\t\t}\n\t}\n": types.GetEventDocument,
    "\n\tquery GetEventSettings($eventId: ID!) {\n\t\tevent: getEvent(id: $eventId) {\n\t\t\t...EventSettingsFragment\n\t\t}\n\t}\n": types.GetEventSettingsDocument,
};

/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 *
 *
 * @example
 * ```ts
 * const query = gql(`query GetUser($id: ID!) { user(id: $id) { name } }`);
 * ```
 *
 * The query argument is unknown!
 * Please regenerate the types.
 */
export function gql(source: string): unknown;

/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n\tmutation CreateEvent {\n\t\tevent: createEvent\n\t}\n"): (typeof documents)["\n\tmutation CreateEvent {\n\t\tevent: createEvent\n\t}\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n\tquery GetCurrentRsvps {\n\t\trsvps: getCurrentUser {\n\t\t\trsvps {\n\t\t\t\tinvite\n\t\t\t\trsvpAt\n\t\t\t\trsvp {\n\t\t\t\t\tid\n\t\t\t\t\tname\n\t\t\t\t}\n\t\t\t\tevent {\n\t\t\t\t\tid\n\t\t\t\t\tname\n\t\t\t\t\tsummary\n\t\t\t\t\tdescription\n\t\t\t\t\teventType\n\t\t\t\t\tlocation\n\t\t\t\t\towner {\n\t\t\t\t\t\tid\n\t\t\t\t\t\tname\n\t\t\t\t\t\tscName\n\t\t\t\t\t\tavatarUrl\n\t\t\t\t\t\tverified\n\t\t\t\t\t\tupdatedAt\n\t\t\t\t\t\tcreatedAt\n\t\t\t\t\t}\n\t\t\t\t\tduration\n\t\t\t\t\tstartAt\n\t\t\t\t\tendedAt\n\t\t\t\t\tupdatedAt\n\t\t\t\t\tcreatedAt\n\t\t\t\t}\n\t\t\t}\n\t\t}\n\t}\n"): (typeof documents)["\n\tquery GetCurrentRsvps {\n\t\trsvps: getCurrentUser {\n\t\t\trsvps {\n\t\t\t\tinvite\n\t\t\t\trsvpAt\n\t\t\t\trsvp {\n\t\t\t\t\tid\n\t\t\t\t\tname\n\t\t\t\t}\n\t\t\t\tevent {\n\t\t\t\t\tid\n\t\t\t\t\tname\n\t\t\t\t\tsummary\n\t\t\t\t\tdescription\n\t\t\t\t\teventType\n\t\t\t\t\tlocation\n\t\t\t\t\towner {\n\t\t\t\t\t\tid\n\t\t\t\t\t\tname\n\t\t\t\t\t\tscName\n\t\t\t\t\t\tavatarUrl\n\t\t\t\t\t\tverified\n\t\t\t\t\t\tupdatedAt\n\t\t\t\t\t\tcreatedAt\n\t\t\t\t\t}\n\t\t\t\t\tduration\n\t\t\t\t\tstartAt\n\t\t\t\t\tendedAt\n\t\t\t\t\tupdatedAt\n\t\t\t\t\tcreatedAt\n\t\t\t\t}\n\t\t\t}\n\t\t}\n\t}\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n\tquery GetCurrentUser {\n\t\tuser: getCurrentUser {\n\t\t\tid\n\t\t\tname\n\t\t\tscName\n\t\t\tavatarUrl\n\t\t\tverified\n\t\t\tpermissions\n\t\t\tprimaryRole {\n\t\t\t\tid\n\t\t\t\tname\n\t\t\t}\n\t\t\troles {\n\t\t\t\tid\n\t\t\t\tname\n\t\t\t}\n\t\t\tsettings {\n\t\t\t\tupdatedAt\n\t\t\t}\n\t\t\tstatus {\n\t\t\t\tactivity\n\t\t\t\tship\n\t\t\t\tupdatedAt\n\t\t\t}\n\t\t\tupdatedAt\n\t\t\tcreatedAt\n\t\t}\n\t}\n"): (typeof documents)["\n\tquery GetCurrentUser {\n\t\tuser: getCurrentUser {\n\t\t\tid\n\t\t\tname\n\t\t\tscName\n\t\t\tavatarUrl\n\t\t\tverified\n\t\t\tpermissions\n\t\t\tprimaryRole {\n\t\t\t\tid\n\t\t\t\tname\n\t\t\t}\n\t\t\troles {\n\t\t\t\tid\n\t\t\t\tname\n\t\t\t}\n\t\t\tsettings {\n\t\t\t\tupdatedAt\n\t\t\t}\n\t\t\tstatus {\n\t\t\t\tactivity\n\t\t\t\tship\n\t\t\t\tupdatedAt\n\t\t\t}\n\t\t\tupdatedAt\n\t\t\tcreatedAt\n\t\t}\n\t}\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n\tmutation EditEvent($editEventId: ID!, $data: EventEditInput!) {\n\t\tevent: editEvent(id: $editEventId, data: $data) {\n\t\t\t...EventFragment\n\t\t\t...EventSettingsFragment\n\t\t}\n\t}\n"): (typeof documents)["\n\tmutation EditEvent($editEventId: ID!, $data: EventEditInput!) {\n\t\tevent: editEvent(id: $editEventId, data: $data) {\n\t\t\t...EventFragment\n\t\t\t...EventSettingsFragment\n\t\t}\n\t}\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n    fragment ChannelFragment on DiscordChannel {\n        id\n        name\n        type\n    }\n"): (typeof documents)["\n    fragment ChannelFragment on DiscordChannel {\n        id\n        name\n        type\n    }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n    fragment EventFragment on Event {\n        id\n        channel {\n            ...ChannelFragment\n        }\n        owner {\n            ...EventUserFragment\n        }\n        name\n        summary\n        description\n        eventType\n        location\n        roles {\n            id\n            name\n            limit\n        }\n        members {\n            id\n            pending\n            rsvp\n            user {\n                ...EventUserFragment\n            }\n            rsvpAt\n        }\n        posted\n        duration\n        startAt\n        endedAt\n        updatedAt\n        createdAt\n    }\n"): (typeof documents)["\n    fragment EventFragment on Event {\n        id\n        channel {\n            ...ChannelFragment\n        }\n        owner {\n            ...EventUserFragment\n        }\n        name\n        summary\n        description\n        eventType\n        location\n        roles {\n            id\n            name\n            limit\n        }\n        members {\n            id\n            pending\n            rsvp\n            user {\n                ...EventUserFragment\n            }\n            rsvpAt\n        }\n        posted\n        duration\n        startAt\n        endedAt\n        updatedAt\n        createdAt\n    }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n    fragment EventSettingsFragment on Event {\n        accessType\n        accessRoles {\n            id\n            name\n        }\n        settings {\n            hideLocation\n            inviteOnly\n            openToJoinRequests\n            allowTeamSwitching\n            allowCrewSwitching\n        }\n    }\n"): (typeof documents)["\n    fragment EventSettingsFragment on Event {\n        accessType\n        accessRoles {\n            id\n            name\n        }\n        settings {\n            hideLocation\n            inviteOnly\n            openToJoinRequests\n            allowTeamSwitching\n            allowCrewSwitching\n        }\n    }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n    fragment EventUserFragment on PartialUser {\n        id\n        name\n        discordName\n        avatarUrl\n        verified\n    }\n"): (typeof documents)["\n    fragment EventUserFragment on PartialUser {\n        id\n        name\n        discordName\n        avatarUrl\n        verified\n    }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n\tquery GetEvent($eventId: ID!) {\n\t\tevent: getEvent(id: $eventId) {\n\t\t\t...EventFragment\n\t\t}\n\t}\n"): (typeof documents)["\n\tquery GetEvent($eventId: ID!) {\n\t\tevent: getEvent(id: $eventId) {\n\t\t\t...EventFragment\n\t\t}\n\t}\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n\tquery GetEventSettings($eventId: ID!) {\n\t\tevent: getEvent(id: $eventId) {\n\t\t\t...EventSettingsFragment\n\t\t}\n\t}\n"): (typeof documents)["\n\tquery GetEventSettings($eventId: ID!) {\n\t\tevent: getEvent(id: $eventId) {\n\t\t\t...EventSettingsFragment\n\t\t}\n\t}\n"];

export function gql(source: string) {
  return (documents as any)[source] ?? {};
}

export type DocumentType<TDocumentNode extends DocumentNode<any, any>> = TDocumentNode extends DocumentNode<  infer TType,  any>  ? TType  : never;