/* eslint-disable */
import type { ID } from '@frcn/graphql-scalar-types';
import type { String } from '@frcn/graphql-scalar-types';
import type { Boolean } from '@frcn/graphql-scalar-types';
import type { Int } from '@frcn/graphql-scalar-types';
import type { Date } from '@frcn/graphql-scalar-types';
import type { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: ID['input']; output: ID['output']; }
  String: { input: String['input']; output: String['output']; }
  Boolean: { input: Boolean['input']; output: Boolean['output']; }
  Int: { input: Int['input']; output: Int['output']; }
  Float: { input: number; output: number; }
  Date: { input: Date['input']; output: Date['output']; }
};

export enum CacheControlScope {
  Private = 'PRIVATE',
  Public = 'PUBLIC'
}

export type DiscordChannel = {
  __typename?: 'DiscordChannel';
  id: Scalars['ID']['output'];
  name: Scalars['String']['output'];
  type?: Maybe<Scalars['String']['output']>;
};

export type Event = {
  __typename?: 'Event';
  accessRoles: Array<UserRole>;
  accessType: EventAccessType;
  channel: DiscordChannel;
  createdAt: Scalars['Date']['output'];
  description: Scalars['String']['output'];
  duration?: Maybe<Scalars['Int']['output']>;
  endedAt?: Maybe<Scalars['Date']['output']>;
  eventType?: Maybe<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  location?: Maybe<Array<Scalars['String']['output']>>;
  members: Array<EventMember>;
  name: Scalars['String']['output'];
  owner?: Maybe<PartialUser>;
  posted: Scalars['Boolean']['output'];
  roles: Array<EventRsvpRole>;
  settings: EventSettings;
  startAt?: Maybe<Scalars['Date']['output']>;
  summary: Scalars['String']['output'];
  updatedAt: Scalars['Date']['output'];
};

export enum EventAccessType {
  Channel = 'CHANNEL',
  PrimaryRole = 'PRIMARY_ROLE',
  SelectRoles = 'SELECT_ROLES'
}

export type EventEditInput = {
  channel: Scalars['ID']['input'];
  description: Scalars['String']['input'];
  duration: Scalars['Int']['input'];
  eventType: Scalars['String']['input'];
  location: Array<Scalars['String']['input']>;
  name: Scalars['String']['input'];
  roles: Array<EventRoleInput>;
  settings: EventSettingsInput;
  startAt: Scalars['Int']['input'];
  summary: Scalars['String']['input'];
};

export type EventFilterInput = {
  search?: InputMaybe<Scalars['String']['input']>;
};

export type EventMember = {
  __typename?: 'EventMember';
  id: Scalars['Int']['output'];
  pending: Scalars['Boolean']['output'];
  rsvp: Scalars['String']['output'];
  rsvpAt: Scalars['Date']['output'];
  user: PartialUser;
};

export type EventRoleInput = {
  id: Scalars['ID']['input'];
  limit: Scalars['Int']['input'];
  name: Scalars['String']['input'];
};

export type EventRsvp = {
  __typename?: 'EventRsvp';
  event: PartialEvent;
  invite: Scalars['Boolean']['output'];
  rsvp?: Maybe<PartialEventRsvpRole>;
  rsvpAt: Scalars['Date']['output'];
};

export type EventRsvpRole = {
  __typename?: 'EventRsvpRole';
  id: Scalars['ID']['output'];
  limit: Scalars['Int']['output'];
  members: Array<Scalars['Int']['output']>;
  name: Scalars['String']['output'];
};

export type EventSettings = {
  __typename?: 'EventSettings';
  allowCrewSwitching: Scalars['Boolean']['output'];
  allowTeamSwitching: Scalars['Boolean']['output'];
  hideLocation: Scalars['Boolean']['output'];
  inviteOnly: Scalars['Boolean']['output'];
  openToJoinRequests: Scalars['Boolean']['output'];
};

export type EventSettingsInput = {
  allowCrewSwitching: Scalars['Boolean']['input'];
  allowTeamSwitching: Scalars['Boolean']['input'];
  hideLocation: Scalars['Boolean']['input'];
  inviteOnly: Scalars['Boolean']['input'];
  openToJoinRequests: Scalars['Boolean']['input'];
};

export type Mutation = {
  __typename?: 'Mutation';
  createEvent: Scalars['ID']['output'];
  editEvent: Event;
  editEventChannels: Array<DiscordChannel>;
  editSystem: SystemSettings;
  editUserStatus: UserStatus;
  postEvent: Scalars['Boolean']['output'];
  reorderRoles: SystemSettings;
  setUserScName: User;
  verifyUserScName: User;
};


export type MutationEditEventArgs = {
  data: EventEditInput;
  id: Scalars['ID']['input'];
};


export type MutationEditEventChannelsArgs = {
  channels: Array<Scalars['String']['input']>;
};


export type MutationEditSystemArgs = {
  data: SystemEditInput;
};


export type MutationEditUserStatusArgs = {
  data: UserStatusEditInput;
};


export type MutationPostEventArgs = {
  id: Scalars['ID']['input'];
};


export type MutationReorderRolesArgs = {
  order: Array<Scalars['ID']['input']>;
};


export type MutationSetUserScNameArgs = {
  name: Scalars['String']['input'];
};


export type MutationVerifyUserScNameArgs = {
  code: Scalars['String']['input'];
};

export type PagedEvent = {
  __typename?: 'PagedEvent';
  items: Array<Event>;
  nextPage?: Maybe<Scalars['Int']['output']>;
  page: Scalars['Int']['output'];
  total: Scalars['Int']['output'];
};

export type PartialEvent = {
  __typename?: 'PartialEvent';
  channel: DiscordChannel;
  createdAt: Scalars['Date']['output'];
  description: Scalars['String']['output'];
  duration?: Maybe<Scalars['Int']['output']>;
  endedAt?: Maybe<Scalars['Date']['output']>;
  eventType: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  location: Array<Scalars['String']['output']>;
  name: Scalars['String']['output'];
  owner?: Maybe<PartialUser>;
  startAt?: Maybe<Scalars['Date']['output']>;
  summary: Scalars['String']['output'];
  updatedAt: Scalars['Date']['output'];
};

export type PartialEventRsvpRole = {
  __typename?: 'PartialEventRsvpRole';
  id: Scalars['ID']['output'];
  name: Scalars['String']['output'];
};

export type PartialUser = {
  __typename?: 'PartialUser';
  avatarUrl: Scalars['String']['output'];
  createdAt: Scalars['Date']['output'];
  discordName: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  name: Scalars['String']['output'];
  scName?: Maybe<Scalars['String']['output']>;
  updatedAt: Scalars['Date']['output'];
  verified: Scalars['Boolean']['output'];
};

export enum Permission {
  CreateEvents = 'CreateEvents',
  ManageRoles = 'ManageRoles',
  ManageSystem = 'ManageSystem'
}

export type Query = {
  __typename?: 'Query';
  getAllDiscordChannels: Array<DiscordChannel>;
  getAllEventChannels: Array<DiscordChannel>;
  getAllRoles: Array<UserRole>;
  getCurrentUser?: Maybe<User>;
  getEvent?: Maybe<Event>;
  getEvents?: Maybe<PagedEvent>;
  getPrimaryRoles: Array<UserRole>;
  getSystemSettings: SystemSettings;
  getUser?: Maybe<User>;
  getUserScVerifyCode?: Maybe<Scalars['String']['output']>;
};


export type QueryGetEventArgs = {
  id: Scalars['ID']['input'];
};


export type QueryGetEventsArgs = {
  filter?: InputMaybe<EventFilterInput>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  page?: InputMaybe<Scalars['Int']['input']>;
};


export type QueryGetUserArgs = {
  id: Scalars['ID']['input'];
};

export type SystemEditInput = {
  discordGuildId?: InputMaybe<Scalars['String']['input']>;
};

export type SystemSettings = {
  __typename?: 'SystemSettings';
  defaultEventChannel: DiscordChannel;
  discordGuildId: Scalars['String']['output'];
  roleOrder: Array<Scalars['ID']['output']>;
};

export type User = {
  __typename?: 'User';
  avatarUrl: Scalars['String']['output'];
  createdAt: Scalars['Date']['output'];
  discordName: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  name: Scalars['String']['output'];
  permissions: Scalars['Int']['output'];
  primaryRole: UserRole;
  roles: Array<UserRole>;
  rsvps: Array<EventRsvp>;
  scName?: Maybe<Scalars['String']['output']>;
  settings: UserSettings;
  status: UserStatus;
  updatedAt: Scalars['Date']['output'];
  verified: Scalars['Boolean']['output'];
};

export type UserRole = {
  __typename?: 'UserRole';
  createdAt: Scalars['Date']['output'];
  discordId: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  name: Scalars['String']['output'];
  permissions: Scalars['Int']['output'];
  primary: Scalars['Boolean']['output'];
  updatedAt: Scalars['Date']['output'];
  users: Array<PartialUser>;
};

export type UserSettings = {
  __typename?: 'UserSettings';
  updatedAt: Scalars['Date']['output'];
};

export type UserStatus = {
  __typename?: 'UserStatus';
  activity?: Maybe<Scalars['String']['output']>;
  ship?: Maybe<Scalars['String']['output']>;
  updatedAt: Scalars['Date']['output'];
};

export type UserStatusEditInput = {
  activity?: InputMaybe<Scalars['String']['input']>;
  ship?: InputMaybe<Scalars['String']['input']>;
};

export type CreateEventMutationVariables = Exact<{ [key: string]: never; }>;


export type CreateEventMutation = { __typename?: 'Mutation', event: ID['output'] };

export type GetCurrentRsvpsQueryVariables = Exact<{ [key: string]: never; }>;


export type GetCurrentRsvpsQuery = { __typename?: 'Query', rsvps?: { __typename?: 'User', rsvps: Array<{ __typename?: 'EventRsvp', invite: Boolean['output'], rsvpAt: Date['output'], rsvp?: { __typename?: 'PartialEventRsvpRole', id: ID['output'], name: String['output'] } | null, event: { __typename?: 'PartialEvent', id: ID['output'], name: String['output'], summary: String['output'], description: String['output'], eventType: String['output'], location: Array<String['output']>, duration?: Int['output'] | null, startAt?: Date['output'] | null, endedAt?: Date['output'] | null, updatedAt: Date['output'], createdAt: Date['output'], owner?: { __typename?: 'PartialUser', id: ID['output'], name: String['output'], scName?: String['output'] | null, avatarUrl: String['output'], verified: Boolean['output'], updatedAt: Date['output'], createdAt: Date['output'] } | null } }> } | null };

export type GetCurrentUserQueryVariables = Exact<{ [key: string]: never; }>;


export type GetCurrentUserQuery = { __typename?: 'Query', user?: { __typename?: 'User', id: ID['output'], name: String['output'], scName?: String['output'] | null, avatarUrl: String['output'], verified: Boolean['output'], permissions: Int['output'], updatedAt: Date['output'], createdAt: Date['output'], primaryRole: { __typename?: 'UserRole', id: ID['output'], name: String['output'] }, roles: Array<{ __typename?: 'UserRole', id: ID['output'], name: String['output'] }>, settings: { __typename?: 'UserSettings', updatedAt: Date['output'] }, status: { __typename?: 'UserStatus', activity?: String['output'] | null, ship?: String['output'] | null, updatedAt: Date['output'] } } | null };

export type EditEventMutationVariables = Exact<{
  editEventId: Scalars['ID']['input'];
  data: EventEditInput;
}>;


export type EditEventMutation = { __typename?: 'Mutation', event: { __typename?: 'Event', id: ID['output'], name: String['output'], summary: String['output'], description: String['output'], eventType?: String['output'] | null, location?: Array<String['output']> | null, posted: Boolean['output'], duration?: Int['output'] | null, startAt?: Date['output'] | null, endedAt?: Date['output'] | null, updatedAt: Date['output'], createdAt: Date['output'], accessType: EventAccessType, channel: { __typename?: 'DiscordChannel', id: ID['output'], name: String['output'], type?: String['output'] | null }, owner?: { __typename?: 'PartialUser', id: ID['output'], name: String['output'], discordName: String['output'], avatarUrl: String['output'], verified: Boolean['output'] } | null, roles: Array<{ __typename?: 'EventRsvpRole', id: ID['output'], name: String['output'], limit: Int['output'] }>, members: Array<{ __typename?: 'EventMember', id: Int['output'], pending: Boolean['output'], rsvp: String['output'], rsvpAt: Date['output'], user: { __typename?: 'PartialUser', id: ID['output'], name: String['output'], discordName: String['output'], avatarUrl: String['output'], verified: Boolean['output'] } }>, accessRoles: Array<{ __typename?: 'UserRole', id: ID['output'], name: String['output'] }>, settings: { __typename?: 'EventSettings', hideLocation: Boolean['output'], inviteOnly: Boolean['output'], openToJoinRequests: Boolean['output'], allowTeamSwitching: Boolean['output'], allowCrewSwitching: Boolean['output'] } } };

export type ChannelFragmentFragment = { __typename?: 'DiscordChannel', id: ID['output'], name: String['output'], type?: String['output'] | null };

export type EventFragmentFragment = { __typename?: 'Event', id: ID['output'], name: String['output'], summary: String['output'], description: String['output'], eventType?: String['output'] | null, location?: Array<String['output']> | null, posted: Boolean['output'], duration?: Int['output'] | null, startAt?: Date['output'] | null, endedAt?: Date['output'] | null, updatedAt: Date['output'], createdAt: Date['output'], channel: { __typename?: 'DiscordChannel', id: ID['output'], name: String['output'], type?: String['output'] | null }, owner?: { __typename?: 'PartialUser', id: ID['output'], name: String['output'], discordName: String['output'], avatarUrl: String['output'], verified: Boolean['output'] } | null, roles: Array<{ __typename?: 'EventRsvpRole', id: ID['output'], name: String['output'], limit: Int['output'] }>, members: Array<{ __typename?: 'EventMember', id: Int['output'], pending: Boolean['output'], rsvp: String['output'], rsvpAt: Date['output'], user: { __typename?: 'PartialUser', id: ID['output'], name: String['output'], discordName: String['output'], avatarUrl: String['output'], verified: Boolean['output'] } }> };

export type EventSettingsFragmentFragment = { __typename?: 'Event', accessType: EventAccessType, accessRoles: Array<{ __typename?: 'UserRole', id: ID['output'], name: String['output'] }>, settings: { __typename?: 'EventSettings', hideLocation: Boolean['output'], inviteOnly: Boolean['output'], openToJoinRequests: Boolean['output'], allowTeamSwitching: Boolean['output'], allowCrewSwitching: Boolean['output'] } };

export type EventUserFragmentFragment = { __typename?: 'PartialUser', id: ID['output'], name: String['output'], discordName: String['output'], avatarUrl: String['output'], verified: Boolean['output'] };

export type GetEventQueryVariables = Exact<{
  eventId: Scalars['ID']['input'];
}>;


export type GetEventQuery = { __typename?: 'Query', event?: { __typename?: 'Event', id: ID['output'], name: String['output'], summary: String['output'], description: String['output'], eventType?: String['output'] | null, location?: Array<String['output']> | null, posted: Boolean['output'], duration?: Int['output'] | null, startAt?: Date['output'] | null, endedAt?: Date['output'] | null, updatedAt: Date['output'], createdAt: Date['output'], channel: { __typename?: 'DiscordChannel', id: ID['output'], name: String['output'], type?: String['output'] | null }, owner?: { __typename?: 'PartialUser', id: ID['output'], name: String['output'], discordName: String['output'], avatarUrl: String['output'], verified: Boolean['output'] } | null, roles: Array<{ __typename?: 'EventRsvpRole', id: ID['output'], name: String['output'], limit: Int['output'] }>, members: Array<{ __typename?: 'EventMember', id: Int['output'], pending: Boolean['output'], rsvp: String['output'], rsvpAt: Date['output'], user: { __typename?: 'PartialUser', id: ID['output'], name: String['output'], discordName: String['output'], avatarUrl: String['output'], verified: Boolean['output'] } }> } | null };

export type GetEventSettingsQueryVariables = Exact<{
  eventId: Scalars['ID']['input'];
}>;


export type GetEventSettingsQuery = { __typename?: 'Query', event?: { __typename?: 'Event', accessType: EventAccessType, accessRoles: Array<{ __typename?: 'UserRole', id: ID['output'], name: String['output'] }>, settings: { __typename?: 'EventSettings', hideLocation: Boolean['output'], inviteOnly: Boolean['output'], openToJoinRequests: Boolean['output'], allowTeamSwitching: Boolean['output'], allowCrewSwitching: Boolean['output'] } } | null };

export const ChannelFragmentFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"ChannelFragment"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"DiscordChannel"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"type"}}]}}]} as unknown as DocumentNode<ChannelFragmentFragment, unknown>;
export const EventUserFragmentFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"EventUserFragment"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"PartialUser"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"discordName"}},{"kind":"Field","name":{"kind":"Name","value":"avatarUrl"}},{"kind":"Field","name":{"kind":"Name","value":"verified"}}]}}]} as unknown as DocumentNode<EventUserFragmentFragment, unknown>;
export const EventFragmentFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"EventFragment"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Event"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"channel"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"ChannelFragment"}}]}},{"kind":"Field","name":{"kind":"Name","value":"owner"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"EventUserFragment"}}]}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"summary"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"eventType"}},{"kind":"Field","name":{"kind":"Name","value":"location"}},{"kind":"Field","name":{"kind":"Name","value":"roles"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"limit"}}]}},{"kind":"Field","name":{"kind":"Name","value":"members"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"pending"}},{"kind":"Field","name":{"kind":"Name","value":"rsvp"}},{"kind":"Field","name":{"kind":"Name","value":"user"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"EventUserFragment"}}]}},{"kind":"Field","name":{"kind":"Name","value":"rsvpAt"}}]}},{"kind":"Field","name":{"kind":"Name","value":"posted"}},{"kind":"Field","name":{"kind":"Name","value":"duration"}},{"kind":"Field","name":{"kind":"Name","value":"startAt"}},{"kind":"Field","name":{"kind":"Name","value":"endedAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"ChannelFragment"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"DiscordChannel"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"type"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"EventUserFragment"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"PartialUser"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"discordName"}},{"kind":"Field","name":{"kind":"Name","value":"avatarUrl"}},{"kind":"Field","name":{"kind":"Name","value":"verified"}}]}}]} as unknown as DocumentNode<EventFragmentFragment, unknown>;
export const EventSettingsFragmentFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"EventSettingsFragment"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Event"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"accessType"}},{"kind":"Field","name":{"kind":"Name","value":"accessRoles"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"settings"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"hideLocation"}},{"kind":"Field","name":{"kind":"Name","value":"inviteOnly"}},{"kind":"Field","name":{"kind":"Name","value":"openToJoinRequests"}},{"kind":"Field","name":{"kind":"Name","value":"allowTeamSwitching"}},{"kind":"Field","name":{"kind":"Name","value":"allowCrewSwitching"}}]}}]}}]} as unknown as DocumentNode<EventSettingsFragmentFragment, unknown>;
export const CreateEventDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CreateEvent"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","alias":{"kind":"Name","value":"event"},"name":{"kind":"Name","value":"createEvent"}}]}}]} as unknown as DocumentNode<CreateEventMutation, CreateEventMutationVariables>;
export const GetCurrentRsvpsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetCurrentRsvps"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","alias":{"kind":"Name","value":"rsvps"},"name":{"kind":"Name","value":"getCurrentUser"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"rsvps"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"invite"}},{"kind":"Field","name":{"kind":"Name","value":"rsvpAt"}},{"kind":"Field","name":{"kind":"Name","value":"rsvp"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"event"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"summary"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"eventType"}},{"kind":"Field","name":{"kind":"Name","value":"location"}},{"kind":"Field","name":{"kind":"Name","value":"owner"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"scName"}},{"kind":"Field","name":{"kind":"Name","value":"avatarUrl"}},{"kind":"Field","name":{"kind":"Name","value":"verified"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}}]}},{"kind":"Field","name":{"kind":"Name","value":"duration"}},{"kind":"Field","name":{"kind":"Name","value":"startAt"}},{"kind":"Field","name":{"kind":"Name","value":"endedAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}}]}}]}}]}}]}}]} as unknown as DocumentNode<GetCurrentRsvpsQuery, GetCurrentRsvpsQueryVariables>;
export const GetCurrentUserDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetCurrentUser"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","alias":{"kind":"Name","value":"user"},"name":{"kind":"Name","value":"getCurrentUser"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"scName"}},{"kind":"Field","name":{"kind":"Name","value":"avatarUrl"}},{"kind":"Field","name":{"kind":"Name","value":"verified"}},{"kind":"Field","name":{"kind":"Name","value":"permissions"}},{"kind":"Field","name":{"kind":"Name","value":"primaryRole"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"roles"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"settings"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}}]}},{"kind":"Field","name":{"kind":"Name","value":"status"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"activity"}},{"kind":"Field","name":{"kind":"Name","value":"ship"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}}]}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}}]}}]}}]} as unknown as DocumentNode<GetCurrentUserQuery, GetCurrentUserQueryVariables>;
export const EditEventDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"EditEvent"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"editEventId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"data"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"EventEditInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","alias":{"kind":"Name","value":"event"},"name":{"kind":"Name","value":"editEvent"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"editEventId"}}},{"kind":"Argument","name":{"kind":"Name","value":"data"},"value":{"kind":"Variable","name":{"kind":"Name","value":"data"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"EventFragment"}},{"kind":"FragmentSpread","name":{"kind":"Name","value":"EventSettingsFragment"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"ChannelFragment"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"DiscordChannel"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"type"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"EventUserFragment"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"PartialUser"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"discordName"}},{"kind":"Field","name":{"kind":"Name","value":"avatarUrl"}},{"kind":"Field","name":{"kind":"Name","value":"verified"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"EventFragment"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Event"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"channel"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"ChannelFragment"}}]}},{"kind":"Field","name":{"kind":"Name","value":"owner"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"EventUserFragment"}}]}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"summary"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"eventType"}},{"kind":"Field","name":{"kind":"Name","value":"location"}},{"kind":"Field","name":{"kind":"Name","value":"roles"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"limit"}}]}},{"kind":"Field","name":{"kind":"Name","value":"members"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"pending"}},{"kind":"Field","name":{"kind":"Name","value":"rsvp"}},{"kind":"Field","name":{"kind":"Name","value":"user"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"EventUserFragment"}}]}},{"kind":"Field","name":{"kind":"Name","value":"rsvpAt"}}]}},{"kind":"Field","name":{"kind":"Name","value":"posted"}},{"kind":"Field","name":{"kind":"Name","value":"duration"}},{"kind":"Field","name":{"kind":"Name","value":"startAt"}},{"kind":"Field","name":{"kind":"Name","value":"endedAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"EventSettingsFragment"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Event"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"accessType"}},{"kind":"Field","name":{"kind":"Name","value":"accessRoles"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"settings"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"hideLocation"}},{"kind":"Field","name":{"kind":"Name","value":"inviteOnly"}},{"kind":"Field","name":{"kind":"Name","value":"openToJoinRequests"}},{"kind":"Field","name":{"kind":"Name","value":"allowTeamSwitching"}},{"kind":"Field","name":{"kind":"Name","value":"allowCrewSwitching"}}]}}]}}]} as unknown as DocumentNode<EditEventMutation, EditEventMutationVariables>;
export const GetEventDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetEvent"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"eventId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","alias":{"kind":"Name","value":"event"},"name":{"kind":"Name","value":"getEvent"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"eventId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"EventFragment"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"ChannelFragment"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"DiscordChannel"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"type"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"EventUserFragment"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"PartialUser"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"discordName"}},{"kind":"Field","name":{"kind":"Name","value":"avatarUrl"}},{"kind":"Field","name":{"kind":"Name","value":"verified"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"EventFragment"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Event"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"channel"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"ChannelFragment"}}]}},{"kind":"Field","name":{"kind":"Name","value":"owner"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"EventUserFragment"}}]}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"summary"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"eventType"}},{"kind":"Field","name":{"kind":"Name","value":"location"}},{"kind":"Field","name":{"kind":"Name","value":"roles"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"limit"}}]}},{"kind":"Field","name":{"kind":"Name","value":"members"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"pending"}},{"kind":"Field","name":{"kind":"Name","value":"rsvp"}},{"kind":"Field","name":{"kind":"Name","value":"user"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"EventUserFragment"}}]}},{"kind":"Field","name":{"kind":"Name","value":"rsvpAt"}}]}},{"kind":"Field","name":{"kind":"Name","value":"posted"}},{"kind":"Field","name":{"kind":"Name","value":"duration"}},{"kind":"Field","name":{"kind":"Name","value":"startAt"}},{"kind":"Field","name":{"kind":"Name","value":"endedAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}}]}}]} as unknown as DocumentNode<GetEventQuery, GetEventQueryVariables>;
export const GetEventSettingsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetEventSettings"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"eventId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","alias":{"kind":"Name","value":"event"},"name":{"kind":"Name","value":"getEvent"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"eventId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"EventSettingsFragment"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"EventSettingsFragment"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Event"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"accessType"}},{"kind":"Field","name":{"kind":"Name","value":"accessRoles"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"settings"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"hideLocation"}},{"kind":"Field","name":{"kind":"Name","value":"inviteOnly"}},{"kind":"Field","name":{"kind":"Name","value":"openToJoinRequests"}},{"kind":"Field","name":{"kind":"Name","value":"allowTeamSwitching"}},{"kind":"Field","name":{"kind":"Name","value":"allowCrewSwitching"}}]}}]}}]} as unknown as DocumentNode<GetEventSettingsQuery, GetEventSettingsQueryVariables>;