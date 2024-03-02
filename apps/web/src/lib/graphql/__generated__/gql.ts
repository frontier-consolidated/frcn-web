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
    "\n    fragment ChannelFragment on DiscordChannel {\n        id\n        name\n        type\n    }\n": types.ChannelFragmentFragmentDoc,
    "\n    fragment EventFragment on Event {\n        id\n        channel {\n            ...ChannelFragment\n        }\n        owner {\n            id\n            name\n            discordName\n            avatarUrl\n            verified\n        }\n        name\n        summary\n        description\n        imageUrl\n        eventType\n        location\n        rsvp {\n            pending\n            rsvp\n        }\n        roles {\n            id\n            name\n            emoji {\n                id\n                name\n                image\n            }\n            limit\n        }\n        members {\n            ...EventMemberFragment\n        }\n        posted\n        duration\n        startAt\n        endedAt\n        updatedAt\n        createdAt\n    }\n": types.EventFragmentFragmentDoc,
    "\n    fragment EventMemberFragment on EventMember {\n        id\n        pending\n        user {\n            ...EventUserFragment\n        }\n        rsvp\n        rsvpAt\n    }\n": types.EventMemberFragmentFragmentDoc,
    "\n    fragment EventSettingsFragment on Event {\n        mentions\n        settings {\n            hideLocation\n            inviteOnly\n            openToJoinRequests\n            allowTeamSwitching\n            allowCrewSwitching\n        }\n        accessType\n        accessRoles {\n            id\n            name\n        }\n    }\n": types.EventSettingsFragmentFragmentDoc,
    "\n    fragment EventUserFragment on User {\n        id\n        name\n        discordName\n        avatarUrl\n        verified\n        status {\n            activity\n            ship\n        }\n    }\n": types.EventUserFragmentFragmentDoc,
    "\n    fragment ResourceFragment on Resource {\n        id\n        owner {\n            id\n            name\n            avatarUrl\n        }\n        name\n        sizeKb\n        shortDescription\n        previewUrl\n        downloadUrl\n        tags\n        updatedAt\n        createdAt\n    }\n": types.ResourceFragmentFragmentDoc,
    "\n    fragment RoleFragment on UserRole {\n        id\n        name\n        primary\n        discordId\n        permissions\n        updatedAt\n        createdAt\n    }\n": types.RoleFragmentFragmentDoc,
    "\n    fragment UserFragment on User {\n        id\n        name\n        scName\n        discordName\n        verified\n        avatarUrl\n        primaryRole {\n            id\n            name\n        }\n        roles {\n            id\n            name\n        }\n        updatedAt\n        createdAt\n    }\n": types.UserFragmentFragmentDoc,
    "\n\tmutation CreateEvent {\n\t\tevent: createEvent\n\t}\n": types.CreateEventDocument,
    "\n\tmutation CreateResource($data: ResourceCreateInput!) {\n\t\tresource: createResource(data: $data) {\n\t\t\t...ResourceFragment\n\t\t}\n\t}\n": types.CreateResourceDocument,
    "\n\tmutation CreateRole {\n\t\trole: createRole\n\t}\n": types.CreateRoleDocument,
    "\n\tmutation DeleteEvent($id: ID!) {\n\t\tdeleted: deleteEvent(id: $id)\n\t}\n": types.DeleteEventDocument,
    "\n\tmutation DeleteResource($id: ID!) {\n\t\tdeleted: deleteResource(id: $id)\n\t}\n": types.DeleteResourceDocument,
    "\n\tmutation DeleteRole($roleId: ID!) {\n\t\tdeleted: deleteRole(id: $roleId)\n\t}\n": types.DeleteRoleDocument,
    "\n\tmutation EditEvent($eventId: ID!, $data: EventEditInput!) {\n\t\tevent: editEvent(id: $eventId, data: $data) {\n\t\t\t...EventFragment\n\t\t\t...EventSettingsFragment\n\t\t}\n\t}\n": types.EditEventDocument,
    "\n\tmutation EditResource($id: ID!, $data: ResourceEditInput!) {\n\t\tresource: editResource(id: $id, data: $data) {\n\t\t\t...ResourceFragment\n\t\t}\n\t}\n": types.EditResourceDocument,
    "\n\tmutation EditRole($roleId: ID!, $data: RoleEditInput!) {\n\t\trole: editRole(id: $roleId, data: $data) {\n\t\t\tid\n\t\t\tname\n\t\t\tdiscordId\n\t\t\tprimary\n\t\t\tpermissions\n\t\t\tupdatedAt\n\t\t\tcreatedAt\n\t\t}\n\t}\n": types.EditRoleDocument,
    "\n\tmutation PostEvent($eventId: ID!) {\n\t\tsuccess: postEvent(id: $eventId)\n\t}\n": types.PostEventDocument,
    "\n\tmutation ReorderRoles($order: [ID!]!) {\n\t\torder: reorderRoles(order: $order)\n\t}\n": types.ReorderRolesDocument,
    "\n\tquery GetCurrentRsvps {\n\t\trsvps: getCurrentUser {\n\t\t\trsvps {\n\t\t\t\tinvite\n\t\t\t\trsvpAt\n\t\t\t\trsvp {\n\t\t\t\t\tid\n\t\t\t\t\tname\n\t\t\t\t}\n\t\t\t\tevent {\n\t\t\t\t\tid\n\t\t\t\t\towner {\n\t\t\t\t\t\tid\n\t\t\t\t\t\tname\n\t\t\t\t\t\tscName\n\t\t\t\t\t\tavatarUrl\n\t\t\t\t\t\tverified\n\t\t\t\t\t\tupdatedAt\n\t\t\t\t\t\tcreatedAt\n\t\t\t\t\t}\n\t\t\t\t\tname\n\t\t\t\t\tsummary\n\t\t\t\t\tdescription\n\t\t\t\t\timageUrl\n\t\t\t\t\teventType\n\t\t\t\t\tlocation\n\t\t\t\t\tduration\n\t\t\t\t\tstartAt\n\t\t\t\t\tendedAt\n\t\t\t\t\tupdatedAt\n\t\t\t\t\tcreatedAt\n\t\t\t\t}\n\t\t\t}\n\t\t}\n\t}\n": types.GetCurrentRsvpsDocument,
    "\n\tquery GetCurrentUser {\n\t\tuser: getCurrentUser {\n\t\t\t...UserFragment\n\t\t\tpermissions\n\t\t\tsettings {\n\t\t\t\tupdatedAt\n\t\t\t}\n\t\t\tstatus {\n\t\t\t\tactivity\n\t\t\t\tship\n\t\t\t\tupdatedAt\n\t\t\t}\n\t\t}\n\t}\n": types.GetCurrentUserDocument,
    "\n\tquery GetAllRoles {\n\t\troles: getRoles {\n\t\t\t...RoleFragment\n\t\t\tusers {\n\t\t\t\tid\n\t\t\t}\n\t\t}\n\t}\n": types.GetAllRolesDocument,
    "\n\tquery GetEvent($eventId: ID!) {\n\t\tevent: getEvent(id: $eventId) {\n\t\t\t...EventFragment\n\t\t}\n\t}\n": types.GetEventDocument,
    "\n\tquery GetEventSettings($eventId: ID!) {\n\t\tevent: getEvent(id: $eventId) {\n\t\t\t...EventSettingsFragment\n\t\t}\n\t\teventChannels: getAllEventChannels {\n\t\t\t...ChannelFragment\n\t\t}\n\t\tcustomEmojis: getAllDiscordEmojis {\n\t\t\tid\n\t\t\tname\n\t\t\timage\n\t\t}\n\t\tdiscordRoles: getAllDiscordRoles {\n\t\t\tid\n\t\t\tname\n\t\t\tcolor\n\t\t}\n\t}\n": types.GetEventSettingsDocument,
    "\n\tquery GetEvents($filter: EventFilterInput, $page: Int, $limit: Int) {\n\t\tevents: getEvents(filter: $filter, page: $page, limit: $limit) {\n\t\t\titems {\n\t\t\t\t...EventFragment\n\t\t\t}\n\t\t\titemsPerPage\n\t\t\tpage\n\t\t\tnextPage\n\t\t\tprevPage\n\t\t\ttotal\n\t\t}\n\t}\n": types.GetEventsDocument,
    "\n\tquery GetOwnedEvents {\n\t\tevents: getCurrentUser {\n\t\t\tevents {\n\t\t\t\t...EventFragment\n\t\t\t}\n\t\t}\n\t}\n": types.GetOwnedEventsDocument,
    "\n\tquery GetResources($filter: ResourceFilterInput, $page: Int, $limit: Int) {\n\t\tresources: getResources(filter: $filter, page: $page, limit: $limit) {\n\t\t\titems {\n\t\t\t\t...ResourceFragment\n\t\t\t}\n\t\t\titemsPerPage\n\t\t\tpage\n\t\t\tnextPage\n\t\t\tprevPage\n\t\t\ttotal\n\t\t}\n\t}\n": types.GetResourcesDocument,
    "\n\tquery GetRole($roleId: ID!) {\n\t\trole: getRole(id: $roleId) {\n\t\t\tid\n\t\t\tname\n\t\t\tdiscordId\n\t\t\tprimary\n\t\t\tpermissions\n\t\t\tusers {\n\t\t\t\tid\n\t\t\t\tname\n\t\t\t\tavatarUrl\n\t\t\t}\n\t\t}\n\t\tdiscordRoles: getAllDiscordRoles(everyone: false) {\n\t\t\tid\n\t\t\tname\n\t\t\tcolor\n\t\t}\n\t}\n": types.GetRoleDocument,
    "\n\tsubscription OnRolesUpdated($userId: ID!) {\n\t\troles: userRolesUpdated(userId: $userId) {\n\t\t\tpermissions\n\t\t\tprimaryRole {\n\t\t\t\tid\n\t\t\t\tname\n\t\t\t}\n\t\t\troles {\n\t\t\t\tid\n\t\t\t\tname\n\t\t\t}\n\t\t}\n\t}\n": types.OnRolesUpdatedDocument,
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
export function gql(source: "\n    fragment ChannelFragment on DiscordChannel {\n        id\n        name\n        type\n    }\n"): (typeof documents)["\n    fragment ChannelFragment on DiscordChannel {\n        id\n        name\n        type\n    }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n    fragment EventFragment on Event {\n        id\n        channel {\n            ...ChannelFragment\n        }\n        owner {\n            id\n            name\n            discordName\n            avatarUrl\n            verified\n        }\n        name\n        summary\n        description\n        imageUrl\n        eventType\n        location\n        rsvp {\n            pending\n            rsvp\n        }\n        roles {\n            id\n            name\n            emoji {\n                id\n                name\n                image\n            }\n            limit\n        }\n        members {\n            ...EventMemberFragment\n        }\n        posted\n        duration\n        startAt\n        endedAt\n        updatedAt\n        createdAt\n    }\n"): (typeof documents)["\n    fragment EventFragment on Event {\n        id\n        channel {\n            ...ChannelFragment\n        }\n        owner {\n            id\n            name\n            discordName\n            avatarUrl\n            verified\n        }\n        name\n        summary\n        description\n        imageUrl\n        eventType\n        location\n        rsvp {\n            pending\n            rsvp\n        }\n        roles {\n            id\n            name\n            emoji {\n                id\n                name\n                image\n            }\n            limit\n        }\n        members {\n            ...EventMemberFragment\n        }\n        posted\n        duration\n        startAt\n        endedAt\n        updatedAt\n        createdAt\n    }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n    fragment EventMemberFragment on EventMember {\n        id\n        pending\n        user {\n            ...EventUserFragment\n        }\n        rsvp\n        rsvpAt\n    }\n"): (typeof documents)["\n    fragment EventMemberFragment on EventMember {\n        id\n        pending\n        user {\n            ...EventUserFragment\n        }\n        rsvp\n        rsvpAt\n    }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n    fragment EventSettingsFragment on Event {\n        mentions\n        settings {\n            hideLocation\n            inviteOnly\n            openToJoinRequests\n            allowTeamSwitching\n            allowCrewSwitching\n        }\n        accessType\n        accessRoles {\n            id\n            name\n        }\n    }\n"): (typeof documents)["\n    fragment EventSettingsFragment on Event {\n        mentions\n        settings {\n            hideLocation\n            inviteOnly\n            openToJoinRequests\n            allowTeamSwitching\n            allowCrewSwitching\n        }\n        accessType\n        accessRoles {\n            id\n            name\n        }\n    }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n    fragment EventUserFragment on User {\n        id\n        name\n        discordName\n        avatarUrl\n        verified\n        status {\n            activity\n            ship\n        }\n    }\n"): (typeof documents)["\n    fragment EventUserFragment on User {\n        id\n        name\n        discordName\n        avatarUrl\n        verified\n        status {\n            activity\n            ship\n        }\n    }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n    fragment ResourceFragment on Resource {\n        id\n        owner {\n            id\n            name\n            avatarUrl\n        }\n        name\n        sizeKb\n        shortDescription\n        previewUrl\n        downloadUrl\n        tags\n        updatedAt\n        createdAt\n    }\n"): (typeof documents)["\n    fragment ResourceFragment on Resource {\n        id\n        owner {\n            id\n            name\n            avatarUrl\n        }\n        name\n        sizeKb\n        shortDescription\n        previewUrl\n        downloadUrl\n        tags\n        updatedAt\n        createdAt\n    }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n    fragment RoleFragment on UserRole {\n        id\n        name\n        primary\n        discordId\n        permissions\n        updatedAt\n        createdAt\n    }\n"): (typeof documents)["\n    fragment RoleFragment on UserRole {\n        id\n        name\n        primary\n        discordId\n        permissions\n        updatedAt\n        createdAt\n    }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n    fragment UserFragment on User {\n        id\n        name\n        scName\n        discordName\n        verified\n        avatarUrl\n        primaryRole {\n            id\n            name\n        }\n        roles {\n            id\n            name\n        }\n        updatedAt\n        createdAt\n    }\n"): (typeof documents)["\n    fragment UserFragment on User {\n        id\n        name\n        scName\n        discordName\n        verified\n        avatarUrl\n        primaryRole {\n            id\n            name\n        }\n        roles {\n            id\n            name\n        }\n        updatedAt\n        createdAt\n    }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n\tmutation CreateEvent {\n\t\tevent: createEvent\n\t}\n"): (typeof documents)["\n\tmutation CreateEvent {\n\t\tevent: createEvent\n\t}\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n\tmutation CreateResource($data: ResourceCreateInput!) {\n\t\tresource: createResource(data: $data) {\n\t\t\t...ResourceFragment\n\t\t}\n\t}\n"): (typeof documents)["\n\tmutation CreateResource($data: ResourceCreateInput!) {\n\t\tresource: createResource(data: $data) {\n\t\t\t...ResourceFragment\n\t\t}\n\t}\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n\tmutation CreateRole {\n\t\trole: createRole\n\t}\n"): (typeof documents)["\n\tmutation CreateRole {\n\t\trole: createRole\n\t}\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n\tmutation DeleteEvent($id: ID!) {\n\t\tdeleted: deleteEvent(id: $id)\n\t}\n"): (typeof documents)["\n\tmutation DeleteEvent($id: ID!) {\n\t\tdeleted: deleteEvent(id: $id)\n\t}\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n\tmutation DeleteResource($id: ID!) {\n\t\tdeleted: deleteResource(id: $id)\n\t}\n"): (typeof documents)["\n\tmutation DeleteResource($id: ID!) {\n\t\tdeleted: deleteResource(id: $id)\n\t}\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n\tmutation DeleteRole($roleId: ID!) {\n\t\tdeleted: deleteRole(id: $roleId)\n\t}\n"): (typeof documents)["\n\tmutation DeleteRole($roleId: ID!) {\n\t\tdeleted: deleteRole(id: $roleId)\n\t}\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n\tmutation EditEvent($eventId: ID!, $data: EventEditInput!) {\n\t\tevent: editEvent(id: $eventId, data: $data) {\n\t\t\t...EventFragment\n\t\t\t...EventSettingsFragment\n\t\t}\n\t}\n"): (typeof documents)["\n\tmutation EditEvent($eventId: ID!, $data: EventEditInput!) {\n\t\tevent: editEvent(id: $eventId, data: $data) {\n\t\t\t...EventFragment\n\t\t\t...EventSettingsFragment\n\t\t}\n\t}\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n\tmutation EditResource($id: ID!, $data: ResourceEditInput!) {\n\t\tresource: editResource(id: $id, data: $data) {\n\t\t\t...ResourceFragment\n\t\t}\n\t}\n"): (typeof documents)["\n\tmutation EditResource($id: ID!, $data: ResourceEditInput!) {\n\t\tresource: editResource(id: $id, data: $data) {\n\t\t\t...ResourceFragment\n\t\t}\n\t}\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n\tmutation EditRole($roleId: ID!, $data: RoleEditInput!) {\n\t\trole: editRole(id: $roleId, data: $data) {\n\t\t\tid\n\t\t\tname\n\t\t\tdiscordId\n\t\t\tprimary\n\t\t\tpermissions\n\t\t\tupdatedAt\n\t\t\tcreatedAt\n\t\t}\n\t}\n"): (typeof documents)["\n\tmutation EditRole($roleId: ID!, $data: RoleEditInput!) {\n\t\trole: editRole(id: $roleId, data: $data) {\n\t\t\tid\n\t\t\tname\n\t\t\tdiscordId\n\t\t\tprimary\n\t\t\tpermissions\n\t\t\tupdatedAt\n\t\t\tcreatedAt\n\t\t}\n\t}\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n\tmutation PostEvent($eventId: ID!) {\n\t\tsuccess: postEvent(id: $eventId)\n\t}\n"): (typeof documents)["\n\tmutation PostEvent($eventId: ID!) {\n\t\tsuccess: postEvent(id: $eventId)\n\t}\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n\tmutation ReorderRoles($order: [ID!]!) {\n\t\torder: reorderRoles(order: $order)\n\t}\n"): (typeof documents)["\n\tmutation ReorderRoles($order: [ID!]!) {\n\t\torder: reorderRoles(order: $order)\n\t}\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n\tquery GetCurrentRsvps {\n\t\trsvps: getCurrentUser {\n\t\t\trsvps {\n\t\t\t\tinvite\n\t\t\t\trsvpAt\n\t\t\t\trsvp {\n\t\t\t\t\tid\n\t\t\t\t\tname\n\t\t\t\t}\n\t\t\t\tevent {\n\t\t\t\t\tid\n\t\t\t\t\towner {\n\t\t\t\t\t\tid\n\t\t\t\t\t\tname\n\t\t\t\t\t\tscName\n\t\t\t\t\t\tavatarUrl\n\t\t\t\t\t\tverified\n\t\t\t\t\t\tupdatedAt\n\t\t\t\t\t\tcreatedAt\n\t\t\t\t\t}\n\t\t\t\t\tname\n\t\t\t\t\tsummary\n\t\t\t\t\tdescription\n\t\t\t\t\timageUrl\n\t\t\t\t\teventType\n\t\t\t\t\tlocation\n\t\t\t\t\tduration\n\t\t\t\t\tstartAt\n\t\t\t\t\tendedAt\n\t\t\t\t\tupdatedAt\n\t\t\t\t\tcreatedAt\n\t\t\t\t}\n\t\t\t}\n\t\t}\n\t}\n"): (typeof documents)["\n\tquery GetCurrentRsvps {\n\t\trsvps: getCurrentUser {\n\t\t\trsvps {\n\t\t\t\tinvite\n\t\t\t\trsvpAt\n\t\t\t\trsvp {\n\t\t\t\t\tid\n\t\t\t\t\tname\n\t\t\t\t}\n\t\t\t\tevent {\n\t\t\t\t\tid\n\t\t\t\t\towner {\n\t\t\t\t\t\tid\n\t\t\t\t\t\tname\n\t\t\t\t\t\tscName\n\t\t\t\t\t\tavatarUrl\n\t\t\t\t\t\tverified\n\t\t\t\t\t\tupdatedAt\n\t\t\t\t\t\tcreatedAt\n\t\t\t\t\t}\n\t\t\t\t\tname\n\t\t\t\t\tsummary\n\t\t\t\t\tdescription\n\t\t\t\t\timageUrl\n\t\t\t\t\teventType\n\t\t\t\t\tlocation\n\t\t\t\t\tduration\n\t\t\t\t\tstartAt\n\t\t\t\t\tendedAt\n\t\t\t\t\tupdatedAt\n\t\t\t\t\tcreatedAt\n\t\t\t\t}\n\t\t\t}\n\t\t}\n\t}\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n\tquery GetCurrentUser {\n\t\tuser: getCurrentUser {\n\t\t\t...UserFragment\n\t\t\tpermissions\n\t\t\tsettings {\n\t\t\t\tupdatedAt\n\t\t\t}\n\t\t\tstatus {\n\t\t\t\tactivity\n\t\t\t\tship\n\t\t\t\tupdatedAt\n\t\t\t}\n\t\t}\n\t}\n"): (typeof documents)["\n\tquery GetCurrentUser {\n\t\tuser: getCurrentUser {\n\t\t\t...UserFragment\n\t\t\tpermissions\n\t\t\tsettings {\n\t\t\t\tupdatedAt\n\t\t\t}\n\t\t\tstatus {\n\t\t\t\tactivity\n\t\t\t\tship\n\t\t\t\tupdatedAt\n\t\t\t}\n\t\t}\n\t}\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n\tquery GetAllRoles {\n\t\troles: getRoles {\n\t\t\t...RoleFragment\n\t\t\tusers {\n\t\t\t\tid\n\t\t\t}\n\t\t}\n\t}\n"): (typeof documents)["\n\tquery GetAllRoles {\n\t\troles: getRoles {\n\t\t\t...RoleFragment\n\t\t\tusers {\n\t\t\t\tid\n\t\t\t}\n\t\t}\n\t}\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n\tquery GetEvent($eventId: ID!) {\n\t\tevent: getEvent(id: $eventId) {\n\t\t\t...EventFragment\n\t\t}\n\t}\n"): (typeof documents)["\n\tquery GetEvent($eventId: ID!) {\n\t\tevent: getEvent(id: $eventId) {\n\t\t\t...EventFragment\n\t\t}\n\t}\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n\tquery GetEventSettings($eventId: ID!) {\n\t\tevent: getEvent(id: $eventId) {\n\t\t\t...EventSettingsFragment\n\t\t}\n\t\teventChannels: getAllEventChannels {\n\t\t\t...ChannelFragment\n\t\t}\n\t\tcustomEmojis: getAllDiscordEmojis {\n\t\t\tid\n\t\t\tname\n\t\t\timage\n\t\t}\n\t\tdiscordRoles: getAllDiscordRoles {\n\t\t\tid\n\t\t\tname\n\t\t\tcolor\n\t\t}\n\t}\n"): (typeof documents)["\n\tquery GetEventSettings($eventId: ID!) {\n\t\tevent: getEvent(id: $eventId) {\n\t\t\t...EventSettingsFragment\n\t\t}\n\t\teventChannels: getAllEventChannels {\n\t\t\t...ChannelFragment\n\t\t}\n\t\tcustomEmojis: getAllDiscordEmojis {\n\t\t\tid\n\t\t\tname\n\t\t\timage\n\t\t}\n\t\tdiscordRoles: getAllDiscordRoles {\n\t\t\tid\n\t\t\tname\n\t\t\tcolor\n\t\t}\n\t}\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n\tquery GetEvents($filter: EventFilterInput, $page: Int, $limit: Int) {\n\t\tevents: getEvents(filter: $filter, page: $page, limit: $limit) {\n\t\t\titems {\n\t\t\t\t...EventFragment\n\t\t\t}\n\t\t\titemsPerPage\n\t\t\tpage\n\t\t\tnextPage\n\t\t\tprevPage\n\t\t\ttotal\n\t\t}\n\t}\n"): (typeof documents)["\n\tquery GetEvents($filter: EventFilterInput, $page: Int, $limit: Int) {\n\t\tevents: getEvents(filter: $filter, page: $page, limit: $limit) {\n\t\t\titems {\n\t\t\t\t...EventFragment\n\t\t\t}\n\t\t\titemsPerPage\n\t\t\tpage\n\t\t\tnextPage\n\t\t\tprevPage\n\t\t\ttotal\n\t\t}\n\t}\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n\tquery GetOwnedEvents {\n\t\tevents: getCurrentUser {\n\t\t\tevents {\n\t\t\t\t...EventFragment\n\t\t\t}\n\t\t}\n\t}\n"): (typeof documents)["\n\tquery GetOwnedEvents {\n\t\tevents: getCurrentUser {\n\t\t\tevents {\n\t\t\t\t...EventFragment\n\t\t\t}\n\t\t}\n\t}\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n\tquery GetResources($filter: ResourceFilterInput, $page: Int, $limit: Int) {\n\t\tresources: getResources(filter: $filter, page: $page, limit: $limit) {\n\t\t\titems {\n\t\t\t\t...ResourceFragment\n\t\t\t}\n\t\t\titemsPerPage\n\t\t\tpage\n\t\t\tnextPage\n\t\t\tprevPage\n\t\t\ttotal\n\t\t}\n\t}\n"): (typeof documents)["\n\tquery GetResources($filter: ResourceFilterInput, $page: Int, $limit: Int) {\n\t\tresources: getResources(filter: $filter, page: $page, limit: $limit) {\n\t\t\titems {\n\t\t\t\t...ResourceFragment\n\t\t\t}\n\t\t\titemsPerPage\n\t\t\tpage\n\t\t\tnextPage\n\t\t\tprevPage\n\t\t\ttotal\n\t\t}\n\t}\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n\tquery GetRole($roleId: ID!) {\n\t\trole: getRole(id: $roleId) {\n\t\t\tid\n\t\t\tname\n\t\t\tdiscordId\n\t\t\tprimary\n\t\t\tpermissions\n\t\t\tusers {\n\t\t\t\tid\n\t\t\t\tname\n\t\t\t\tavatarUrl\n\t\t\t}\n\t\t}\n\t\tdiscordRoles: getAllDiscordRoles(everyone: false) {\n\t\t\tid\n\t\t\tname\n\t\t\tcolor\n\t\t}\n\t}\n"): (typeof documents)["\n\tquery GetRole($roleId: ID!) {\n\t\trole: getRole(id: $roleId) {\n\t\t\tid\n\t\t\tname\n\t\t\tdiscordId\n\t\t\tprimary\n\t\t\tpermissions\n\t\t\tusers {\n\t\t\t\tid\n\t\t\t\tname\n\t\t\t\tavatarUrl\n\t\t\t}\n\t\t}\n\t\tdiscordRoles: getAllDiscordRoles(everyone: false) {\n\t\t\tid\n\t\t\tname\n\t\t\tcolor\n\t\t}\n\t}\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n\tsubscription OnRolesUpdated($userId: ID!) {\n\t\troles: userRolesUpdated(userId: $userId) {\n\t\t\tpermissions\n\t\t\tprimaryRole {\n\t\t\t\tid\n\t\t\t\tname\n\t\t\t}\n\t\t\troles {\n\t\t\t\tid\n\t\t\t\tname\n\t\t\t}\n\t\t}\n\t}\n"): (typeof documents)["\n\tsubscription OnRolesUpdated($userId: ID!) {\n\t\troles: userRolesUpdated(userId: $userId) {\n\t\t\tpermissions\n\t\t\tprimaryRole {\n\t\t\t\tid\n\t\t\t\tname\n\t\t\t}\n\t\t\troles {\n\t\t\t\tid\n\t\t\t\tname\n\t\t\t}\n\t\t}\n\t}\n"];

export function gql(source: string) {
  return (documents as any)[source] ?? {};
}

export type DocumentType<TDocumentNode extends DocumentNode<any, any>> = TDocumentNode extends DocumentNode<  infer TType,  any>  ? TType  : never;