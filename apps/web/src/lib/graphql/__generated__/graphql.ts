/* eslint-disable */
import type { ID } from '@frcn/graphql-scalar-types/client';
import type { String } from '@frcn/graphql-scalar-types/client';
import type { Boolean } from '@frcn/graphql-scalar-types/client';
import type { Int } from '@frcn/graphql-scalar-types/client';
import type { Timestamp } from '@frcn/graphql-scalar-types/client';
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
  Timestamp: { input: Timestamp['input']; output: Timestamp['output']; }
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

export type DiscordEmoji = {
  __typename?: 'DiscordEmoji';
  id: Scalars['ID']['output'];
  image?: Maybe<Scalars['String']['output']>;
  name: Scalars['String']['output'];
};

export type DiscordRole = {
  __typename?: 'DiscordRole';
  color: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  name: Scalars['String']['output'];
};

export type Event = {
  __typename?: 'Event';
  accessRoles: Array<UserRole>;
  accessType: EventAccessType;
  channel: DiscordChannel;
  createdAt: Scalars['Timestamp']['output'];
  description: Scalars['String']['output'];
  duration?: Maybe<Scalars['Int']['output']>;
  endedAt?: Maybe<Scalars['Timestamp']['output']>;
  eventType?: Maybe<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  imageUrl?: Maybe<Scalars['String']['output']>;
  location: Array<Scalars['String']['output']>;
  members: Array<EventMember>;
  mentions: Array<DiscordRole>;
  name: Scalars['String']['output'];
  owner: User;
  posted: Scalars['Boolean']['output'];
  roles: Array<EventRsvpRole>;
  settings: EventSettings;
  startAt?: Maybe<Scalars['Timestamp']['output']>;
  summary: Scalars['String']['output'];
  updatedAt: Scalars['Timestamp']['output'];
};

export enum EventAccessType {
  Channel = 'CHANNEL',
  Everyone = 'EVERYONE',
  PrimaryRole = 'PRIMARY_ROLE',
  SelectRoles = 'SELECT_ROLES'
}

export type EventEditInput = {
  accessRoles?: InputMaybe<Array<Scalars['ID']['input']>>;
  accessType?: InputMaybe<EventAccessType>;
  channel?: InputMaybe<Scalars['ID']['input']>;
  description?: InputMaybe<Scalars['String']['input']>;
  duration?: InputMaybe<Scalars['Int']['input']>;
  eventType?: InputMaybe<Scalars['String']['input']>;
  imageUrl?: InputMaybe<Scalars['String']['input']>;
  location?: InputMaybe<Array<Scalars['String']['input']>>;
  mentions?: InputMaybe<Array<Scalars['ID']['input']>>;
  name?: InputMaybe<Scalars['String']['input']>;
  roles?: InputMaybe<Array<EventRoleInput>>;
  settings?: InputMaybe<EventSettingsInput>;
  startAt?: InputMaybe<Scalars['Timestamp']['input']>;
  summary?: InputMaybe<Scalars['String']['input']>;
};

export type EventFilterInput = {
  includeCompleted?: InputMaybe<Scalars['Boolean']['input']>;
  maxDuration?: InputMaybe<Scalars['Int']['input']>;
  minDuration?: InputMaybe<Scalars['Int']['input']>;
  search?: InputMaybe<Scalars['String']['input']>;
  startAt?: InputMaybe<Scalars['Timestamp']['input']>;
};

export type EventMember = {
  __typename?: 'EventMember';
  id: Scalars['ID']['output'];
  pending: Scalars['Boolean']['output'];
  rsvp: Scalars['ID']['output'];
  rsvpAt: Scalars['Timestamp']['output'];
  user: User;
};

export type EventRoleInput = {
  emoji: Scalars['String']['input'];
  emojiId: Scalars['String']['input'];
  id: Scalars['ID']['input'];
  limit: Scalars['Int']['input'];
  name: Scalars['String']['input'];
};

export type EventRsvp = {
  __typename?: 'EventRsvp';
  event: Event;
  invite: Scalars['Boolean']['output'];
  rsvp?: Maybe<EventRsvpRole>;
  rsvpAt: Scalars['Timestamp']['output'];
};

export type EventRsvpRole = {
  __typename?: 'EventRsvpRole';
  emoji: DiscordEmoji;
  id: Scalars['ID']['output'];
  limit: Scalars['Int']['output'];
  members: Array<Scalars['ID']['output']>;
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
  editEvent?: Maybe<Event>;
  editEventChannels: Array<DiscordChannel>;
  editSystemSettings: SystemSettings;
  editUserStatus: UserStatus;
  postEvent: Scalars['Boolean']['output'];
  reorderRoles: Array<Scalars['ID']['output']>;
  rsvpForEvent: Scalars['Boolean']['output'];
  setUserScName: User;
  verifyUserScName: User;
};


export type MutationEditEventArgs = {
  data: EventEditInput;
  id: Scalars['ID']['input'];
};


export type MutationEditEventChannelsArgs = {
  channels: Array<Scalars['ID']['input']>;
};


export type MutationEditSystemSettingsArgs = {
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


export type MutationRsvpForEventArgs = {
  id: Scalars['ID']['input'];
  rsvp: Scalars['ID']['input'];
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
  prevPage?: Maybe<Scalars['Int']['output']>;
  total: Scalars['Int']['output'];
};

export enum Permission {
  CreateEvents = 'CreateEvents',
  ManageRoles = 'ManageRoles',
  ManageSystem = 'ManageSystem'
}

export type Query = {
  __typename?: 'Query';
  getAllDiscordChannels: Array<DiscordChannel>;
  getAllDiscordEmojis: Array<DiscordEmoji>;
  getAllDiscordRoles: Array<DiscordRole>;
  getAllEventChannels: Array<Maybe<DiscordChannel>>;
  getCurrentUser?: Maybe<User>;
  getEvent?: Maybe<Event>;
  getEvents?: Maybe<PagedEvent>;
  getRoleOrder: Array<Scalars['ID']['output']>;
  getRoles: Array<UserRole>;
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
  discordGuildId?: InputMaybe<Scalars['ID']['input']>;
};

export type SystemSettings = {
  __typename?: 'SystemSettings';
  defaultEventChannel: DiscordChannel;
  discordGuildId: Scalars['String']['output'];
};

export type User = {
  __typename?: 'User';
  avatarUrl: Scalars['String']['output'];
  createdAt: Scalars['Timestamp']['output'];
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
  updatedAt: Scalars['Timestamp']['output'];
  verified: Scalars['Boolean']['output'];
};

export type UserRole = {
  __typename?: 'UserRole';
  createdAt: Scalars['Timestamp']['output'];
  discordId: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  name: Scalars['String']['output'];
  permissions: Scalars['Int']['output'];
  primary: Scalars['Boolean']['output'];
  updatedAt: Scalars['Timestamp']['output'];
  users: Array<User>;
};

export type UserSettings = {
  __typename?: 'UserSettings';
  updatedAt: Scalars['Timestamp']['output'];
};

export type UserStatus = {
  __typename?: 'UserStatus';
  activity?: Maybe<Scalars['String']['output']>;
  ship?: Maybe<Scalars['String']['output']>;
  updatedAt: Scalars['Timestamp']['output'];
};

export type UserStatusEditInput = {
  activity?: InputMaybe<Scalars['String']['input']>;
  ship?: InputMaybe<Scalars['String']['input']>;
};

export type CreateEventMutationVariables = Exact<{ [key: string]: never; }>;


export type CreateEventMutation = { __typename?: 'Mutation', event: ID['output'] };

export type GetCurrentRsvpsQueryVariables = Exact<{ [key: string]: never; }>;


export type GetCurrentRsvpsQuery = { __typename?: 'Query', rsvps?: { __typename?: 'User', rsvps: Array<{ __typename?: 'EventRsvp', invite: Boolean['output'], rsvpAt: Timestamp['output'], rsvp?: { __typename?: 'EventRsvpRole', id: ID['output'], name: String['output'] } | null, event: { __typename?: 'Event', id: ID['output'], name: String['output'], summary: String['output'], description: String['output'], imageUrl?: String['output'] | null, eventType?: String['output'] | null, location: Array<String['output']>, duration?: Int['output'] | null, startAt?: Timestamp['output'] | null, endedAt?: Timestamp['output'] | null, updatedAt: Timestamp['output'], createdAt: Timestamp['output'], owner: { __typename?: 'User', id: ID['output'], name: String['output'], scName?: String['output'] | null, avatarUrl: String['output'], verified: Boolean['output'], updatedAt: Timestamp['output'], createdAt: Timestamp['output'] } } }> } | null };

export type GetCurrentUserQueryVariables = Exact<{ [key: string]: never; }>;


export type GetCurrentUserQuery = { __typename?: 'Query', user?: { __typename?: 'User', id: ID['output'], name: String['output'], scName?: String['output'] | null, discordName: String['output'], verified: Boolean['output'], avatarUrl: String['output'], permissions: Int['output'], updatedAt: Timestamp['output'], createdAt: Timestamp['output'], primaryRole: { __typename?: 'UserRole', id: ID['output'], name: String['output'] }, roles: Array<{ __typename?: 'UserRole', id: ID['output'], name: String['output'] }>, settings: { __typename?: 'UserSettings', updatedAt: Timestamp['output'] }, status: { __typename?: 'UserStatus', activity?: String['output'] | null, ship?: String['output'] | null, updatedAt: Timestamp['output'] } } | null };

export type EditEventMutationVariables = Exact<{
  eventId: Scalars['ID']['input'];
  data: EventEditInput;
}>;


export type EditEventMutation = { __typename?: 'Mutation', event?: { __typename?: 'Event', id: ID['output'], name: String['output'], summary: String['output'], description: String['output'], imageUrl?: String['output'] | null, eventType?: String['output'] | null, location: Array<String['output']>, posted: Boolean['output'], duration?: Int['output'] | null, startAt?: Timestamp['output'] | null, endedAt?: Timestamp['output'] | null, updatedAt: Timestamp['output'], createdAt: Timestamp['output'], accessType: EventAccessType, channel: { __typename?: 'DiscordChannel', id: ID['output'], name: String['output'], type?: String['output'] | null }, owner: { __typename?: 'User', id: ID['output'], name: String['output'], discordName: String['output'], avatarUrl: String['output'], verified: Boolean['output'] }, roles: Array<{ __typename?: 'EventRsvpRole', id: ID['output'], name: String['output'], limit: Int['output'], emoji: { __typename?: 'DiscordEmoji', id: ID['output'], name: String['output'], image?: String['output'] | null } }>, members: Array<{ __typename?: 'EventMember', id: ID['output'], pending: Boolean['output'], rsvp: ID['output'], rsvpAt: Timestamp['output'], user: { __typename?: 'User', id: ID['output'], name: String['output'], discordName: String['output'], avatarUrl: String['output'], verified: Boolean['output'], status: { __typename?: 'UserStatus', activity?: String['output'] | null, ship?: String['output'] | null } } }>, mentions: Array<{ __typename?: 'DiscordRole', id: ID['output'], name: String['output'], color: String['output'] }>, settings: { __typename?: 'EventSettings', hideLocation: Boolean['output'], inviteOnly: Boolean['output'], openToJoinRequests: Boolean['output'], allowTeamSwitching: Boolean['output'], allowCrewSwitching: Boolean['output'] }, accessRoles: Array<{ __typename?: 'UserRole', id: ID['output'], name: String['output'] }> } | null };

export type ChannelFragmentFragment = { __typename?: 'DiscordChannel', id: ID['output'], name: String['output'], type?: String['output'] | null };

export type EventFragmentFragment = { __typename?: 'Event', id: ID['output'], name: String['output'], summary: String['output'], description: String['output'], imageUrl?: String['output'] | null, eventType?: String['output'] | null, location: Array<String['output']>, posted: Boolean['output'], duration?: Int['output'] | null, startAt?: Timestamp['output'] | null, endedAt?: Timestamp['output'] | null, updatedAt: Timestamp['output'], createdAt: Timestamp['output'], channel: { __typename?: 'DiscordChannel', id: ID['output'], name: String['output'], type?: String['output'] | null }, owner: { __typename?: 'User', id: ID['output'], name: String['output'], discordName: String['output'], avatarUrl: String['output'], verified: Boolean['output'] }, roles: Array<{ __typename?: 'EventRsvpRole', id: ID['output'], name: String['output'], limit: Int['output'], emoji: { __typename?: 'DiscordEmoji', id: ID['output'], name: String['output'], image?: String['output'] | null } }>, members: Array<{ __typename?: 'EventMember', id: ID['output'], pending: Boolean['output'], rsvp: ID['output'], rsvpAt: Timestamp['output'], user: { __typename?: 'User', id: ID['output'], name: String['output'], discordName: String['output'], avatarUrl: String['output'], verified: Boolean['output'], status: { __typename?: 'UserStatus', activity?: String['output'] | null, ship?: String['output'] | null } } }> };

export type EventMemberFragmentFragment = { __typename?: 'EventMember', id: ID['output'], pending: Boolean['output'], rsvp: ID['output'], rsvpAt: Timestamp['output'], user: { __typename?: 'User', id: ID['output'], name: String['output'], discordName: String['output'], avatarUrl: String['output'], verified: Boolean['output'], status: { __typename?: 'UserStatus', activity?: String['output'] | null, ship?: String['output'] | null } } };

export type EventSettingsFragmentFragment = { __typename?: 'Event', accessType: EventAccessType, mentions: Array<{ __typename?: 'DiscordRole', id: ID['output'], name: String['output'], color: String['output'] }>, settings: { __typename?: 'EventSettings', hideLocation: Boolean['output'], inviteOnly: Boolean['output'], openToJoinRequests: Boolean['output'], allowTeamSwitching: Boolean['output'], allowCrewSwitching: Boolean['output'] }, accessRoles: Array<{ __typename?: 'UserRole', id: ID['output'], name: String['output'] }> };

export type EventUserFragmentFragment = { __typename?: 'User', id: ID['output'], name: String['output'], discordName: String['output'], avatarUrl: String['output'], verified: Boolean['output'], status: { __typename?: 'UserStatus', activity?: String['output'] | null, ship?: String['output'] | null } };

export type GetEventQueryVariables = Exact<{
  eventId: Scalars['ID']['input'];
}>;


export type GetEventQuery = { __typename?: 'Query', event?: { __typename?: 'Event', id: ID['output'], name: String['output'], summary: String['output'], description: String['output'], imageUrl?: String['output'] | null, eventType?: String['output'] | null, location: Array<String['output']>, posted: Boolean['output'], duration?: Int['output'] | null, startAt?: Timestamp['output'] | null, endedAt?: Timestamp['output'] | null, updatedAt: Timestamp['output'], createdAt: Timestamp['output'], channel: { __typename?: 'DiscordChannel', id: ID['output'], name: String['output'], type?: String['output'] | null }, owner: { __typename?: 'User', id: ID['output'], name: String['output'], discordName: String['output'], avatarUrl: String['output'], verified: Boolean['output'] }, roles: Array<{ __typename?: 'EventRsvpRole', id: ID['output'], name: String['output'], limit: Int['output'], emoji: { __typename?: 'DiscordEmoji', id: ID['output'], name: String['output'], image?: String['output'] | null } }>, members: Array<{ __typename?: 'EventMember', id: ID['output'], pending: Boolean['output'], rsvp: ID['output'], rsvpAt: Timestamp['output'], user: { __typename?: 'User', id: ID['output'], name: String['output'], discordName: String['output'], avatarUrl: String['output'], verified: Boolean['output'], status: { __typename?: 'UserStatus', activity?: String['output'] | null, ship?: String['output'] | null } } }> } | null };

export type GetEventSettingsQueryVariables = Exact<{
  eventId: Scalars['ID']['input'];
}>;


export type GetEventSettingsQuery = { __typename?: 'Query', event?: { __typename?: 'Event', accessType: EventAccessType, mentions: Array<{ __typename?: 'DiscordRole', id: ID['output'], name: String['output'], color: String['output'] }>, settings: { __typename?: 'EventSettings', hideLocation: Boolean['output'], inviteOnly: Boolean['output'], openToJoinRequests: Boolean['output'], allowTeamSwitching: Boolean['output'], allowCrewSwitching: Boolean['output'] }, accessRoles: Array<{ __typename?: 'UserRole', id: ID['output'], name: String['output'] }> } | null, eventChannels: Array<{ __typename?: 'DiscordChannel', id: ID['output'], name: String['output'], type?: String['output'] | null } | null>, customEmojis: Array<{ __typename?: 'DiscordEmoji', id: ID['output'], name: String['output'], image?: String['output'] | null }> };

export type PostEventMutationVariables = Exact<{
  eventId: Scalars['ID']['input'];
}>;


export type PostEventMutation = { __typename?: 'Mutation', success: Boolean['output'] };

export const ChannelFragmentFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"ChannelFragment"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"DiscordChannel"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"type"}}]}}]} as unknown as DocumentNode<ChannelFragmentFragment, unknown>;
export const EventUserFragmentFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"EventUserFragment"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"User"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"discordName"}},{"kind":"Field","name":{"kind":"Name","value":"avatarUrl"}},{"kind":"Field","name":{"kind":"Name","value":"verified"}},{"kind":"Field","name":{"kind":"Name","value":"status"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"activity"}},{"kind":"Field","name":{"kind":"Name","value":"ship"}}]}}]}}]} as unknown as DocumentNode<EventUserFragmentFragment, unknown>;
export const EventMemberFragmentFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"EventMemberFragment"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"EventMember"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"pending"}},{"kind":"Field","name":{"kind":"Name","value":"user"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"EventUserFragment"}}]}},{"kind":"Field","name":{"kind":"Name","value":"rsvp"}},{"kind":"Field","name":{"kind":"Name","value":"rsvpAt"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"EventUserFragment"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"User"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"discordName"}},{"kind":"Field","name":{"kind":"Name","value":"avatarUrl"}},{"kind":"Field","name":{"kind":"Name","value":"verified"}},{"kind":"Field","name":{"kind":"Name","value":"status"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"activity"}},{"kind":"Field","name":{"kind":"Name","value":"ship"}}]}}]}}]} as unknown as DocumentNode<EventMemberFragmentFragment, unknown>;
export const EventFragmentFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"EventFragment"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Event"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"channel"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"ChannelFragment"}}]}},{"kind":"Field","name":{"kind":"Name","value":"owner"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"discordName"}},{"kind":"Field","name":{"kind":"Name","value":"avatarUrl"}},{"kind":"Field","name":{"kind":"Name","value":"verified"}}]}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"summary"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"imageUrl"}},{"kind":"Field","name":{"kind":"Name","value":"eventType"}},{"kind":"Field","name":{"kind":"Name","value":"location"}},{"kind":"Field","name":{"kind":"Name","value":"roles"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"emoji"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"image"}}]}},{"kind":"Field","name":{"kind":"Name","value":"limit"}}]}},{"kind":"Field","name":{"kind":"Name","value":"members"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"EventMemberFragment"}}]}},{"kind":"Field","name":{"kind":"Name","value":"posted"}},{"kind":"Field","name":{"kind":"Name","value":"duration"}},{"kind":"Field","name":{"kind":"Name","value":"startAt"}},{"kind":"Field","name":{"kind":"Name","value":"endedAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"EventUserFragment"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"User"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"discordName"}},{"kind":"Field","name":{"kind":"Name","value":"avatarUrl"}},{"kind":"Field","name":{"kind":"Name","value":"verified"}},{"kind":"Field","name":{"kind":"Name","value":"status"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"activity"}},{"kind":"Field","name":{"kind":"Name","value":"ship"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"ChannelFragment"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"DiscordChannel"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"type"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"EventMemberFragment"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"EventMember"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"pending"}},{"kind":"Field","name":{"kind":"Name","value":"user"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"EventUserFragment"}}]}},{"kind":"Field","name":{"kind":"Name","value":"rsvp"}},{"kind":"Field","name":{"kind":"Name","value":"rsvpAt"}}]}}]} as unknown as DocumentNode<EventFragmentFragment, unknown>;
export const EventSettingsFragmentFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"EventSettingsFragment"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Event"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"mentions"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"color"}}]}},{"kind":"Field","name":{"kind":"Name","value":"settings"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"hideLocation"}},{"kind":"Field","name":{"kind":"Name","value":"inviteOnly"}},{"kind":"Field","name":{"kind":"Name","value":"openToJoinRequests"}},{"kind":"Field","name":{"kind":"Name","value":"allowTeamSwitching"}},{"kind":"Field","name":{"kind":"Name","value":"allowCrewSwitching"}}]}},{"kind":"Field","name":{"kind":"Name","value":"accessType"}},{"kind":"Field","name":{"kind":"Name","value":"accessRoles"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}}]} as unknown as DocumentNode<EventSettingsFragmentFragment, unknown>;
export const CreateEventDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CreateEvent"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","alias":{"kind":"Name","value":"event"},"name":{"kind":"Name","value":"createEvent"}}]}}]} as unknown as DocumentNode<CreateEventMutation, CreateEventMutationVariables>;
export const GetCurrentRsvpsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetCurrentRsvps"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","alias":{"kind":"Name","value":"rsvps"},"name":{"kind":"Name","value":"getCurrentUser"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"rsvps"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"invite"}},{"kind":"Field","name":{"kind":"Name","value":"rsvpAt"}},{"kind":"Field","name":{"kind":"Name","value":"rsvp"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"event"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"owner"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"scName"}},{"kind":"Field","name":{"kind":"Name","value":"avatarUrl"}},{"kind":"Field","name":{"kind":"Name","value":"verified"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}}]}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"summary"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"imageUrl"}},{"kind":"Field","name":{"kind":"Name","value":"eventType"}},{"kind":"Field","name":{"kind":"Name","value":"location"}},{"kind":"Field","name":{"kind":"Name","value":"duration"}},{"kind":"Field","name":{"kind":"Name","value":"startAt"}},{"kind":"Field","name":{"kind":"Name","value":"endedAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}}]}}]}}]}}]}}]} as unknown as DocumentNode<GetCurrentRsvpsQuery, GetCurrentRsvpsQueryVariables>;
export const GetCurrentUserDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetCurrentUser"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","alias":{"kind":"Name","value":"user"},"name":{"kind":"Name","value":"getCurrentUser"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"scName"}},{"kind":"Field","name":{"kind":"Name","value":"discordName"}},{"kind":"Field","name":{"kind":"Name","value":"verified"}},{"kind":"Field","name":{"kind":"Name","value":"avatarUrl"}},{"kind":"Field","name":{"kind":"Name","value":"permissions"}},{"kind":"Field","name":{"kind":"Name","value":"primaryRole"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"roles"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"settings"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}}]}},{"kind":"Field","name":{"kind":"Name","value":"status"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"activity"}},{"kind":"Field","name":{"kind":"Name","value":"ship"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}}]}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}}]}}]}}]} as unknown as DocumentNode<GetCurrentUserQuery, GetCurrentUserQueryVariables>;
export const EditEventDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"EditEvent"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"eventId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"data"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"EventEditInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","alias":{"kind":"Name","value":"event"},"name":{"kind":"Name","value":"editEvent"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"eventId"}}},{"kind":"Argument","name":{"kind":"Name","value":"data"},"value":{"kind":"Variable","name":{"kind":"Name","value":"data"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"EventFragment"}},{"kind":"FragmentSpread","name":{"kind":"Name","value":"EventSettingsFragment"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"ChannelFragment"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"DiscordChannel"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"type"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"EventUserFragment"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"User"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"discordName"}},{"kind":"Field","name":{"kind":"Name","value":"avatarUrl"}},{"kind":"Field","name":{"kind":"Name","value":"verified"}},{"kind":"Field","name":{"kind":"Name","value":"status"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"activity"}},{"kind":"Field","name":{"kind":"Name","value":"ship"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"EventMemberFragment"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"EventMember"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"pending"}},{"kind":"Field","name":{"kind":"Name","value":"user"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"EventUserFragment"}}]}},{"kind":"Field","name":{"kind":"Name","value":"rsvp"}},{"kind":"Field","name":{"kind":"Name","value":"rsvpAt"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"EventFragment"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Event"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"channel"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"ChannelFragment"}}]}},{"kind":"Field","name":{"kind":"Name","value":"owner"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"discordName"}},{"kind":"Field","name":{"kind":"Name","value":"avatarUrl"}},{"kind":"Field","name":{"kind":"Name","value":"verified"}}]}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"summary"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"imageUrl"}},{"kind":"Field","name":{"kind":"Name","value":"eventType"}},{"kind":"Field","name":{"kind":"Name","value":"location"}},{"kind":"Field","name":{"kind":"Name","value":"roles"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"emoji"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"image"}}]}},{"kind":"Field","name":{"kind":"Name","value":"limit"}}]}},{"kind":"Field","name":{"kind":"Name","value":"members"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"EventMemberFragment"}}]}},{"kind":"Field","name":{"kind":"Name","value":"posted"}},{"kind":"Field","name":{"kind":"Name","value":"duration"}},{"kind":"Field","name":{"kind":"Name","value":"startAt"}},{"kind":"Field","name":{"kind":"Name","value":"endedAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"EventSettingsFragment"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Event"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"mentions"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"color"}}]}},{"kind":"Field","name":{"kind":"Name","value":"settings"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"hideLocation"}},{"kind":"Field","name":{"kind":"Name","value":"inviteOnly"}},{"kind":"Field","name":{"kind":"Name","value":"openToJoinRequests"}},{"kind":"Field","name":{"kind":"Name","value":"allowTeamSwitching"}},{"kind":"Field","name":{"kind":"Name","value":"allowCrewSwitching"}}]}},{"kind":"Field","name":{"kind":"Name","value":"accessType"}},{"kind":"Field","name":{"kind":"Name","value":"accessRoles"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}}]} as unknown as DocumentNode<EditEventMutation, EditEventMutationVariables>;
export const GetEventDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetEvent"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"eventId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","alias":{"kind":"Name","value":"event"},"name":{"kind":"Name","value":"getEvent"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"eventId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"EventFragment"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"ChannelFragment"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"DiscordChannel"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"type"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"EventUserFragment"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"User"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"discordName"}},{"kind":"Field","name":{"kind":"Name","value":"avatarUrl"}},{"kind":"Field","name":{"kind":"Name","value":"verified"}},{"kind":"Field","name":{"kind":"Name","value":"status"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"activity"}},{"kind":"Field","name":{"kind":"Name","value":"ship"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"EventMemberFragment"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"EventMember"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"pending"}},{"kind":"Field","name":{"kind":"Name","value":"user"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"EventUserFragment"}}]}},{"kind":"Field","name":{"kind":"Name","value":"rsvp"}},{"kind":"Field","name":{"kind":"Name","value":"rsvpAt"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"EventFragment"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Event"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"channel"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"ChannelFragment"}}]}},{"kind":"Field","name":{"kind":"Name","value":"owner"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"discordName"}},{"kind":"Field","name":{"kind":"Name","value":"avatarUrl"}},{"kind":"Field","name":{"kind":"Name","value":"verified"}}]}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"summary"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"imageUrl"}},{"kind":"Field","name":{"kind":"Name","value":"eventType"}},{"kind":"Field","name":{"kind":"Name","value":"location"}},{"kind":"Field","name":{"kind":"Name","value":"roles"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"emoji"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"image"}}]}},{"kind":"Field","name":{"kind":"Name","value":"limit"}}]}},{"kind":"Field","name":{"kind":"Name","value":"members"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"EventMemberFragment"}}]}},{"kind":"Field","name":{"kind":"Name","value":"posted"}},{"kind":"Field","name":{"kind":"Name","value":"duration"}},{"kind":"Field","name":{"kind":"Name","value":"startAt"}},{"kind":"Field","name":{"kind":"Name","value":"endedAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}}]}}]} as unknown as DocumentNode<GetEventQuery, GetEventQueryVariables>;
export const GetEventSettingsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetEventSettings"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"eventId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","alias":{"kind":"Name","value":"event"},"name":{"kind":"Name","value":"getEvent"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"eventId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"EventSettingsFragment"}}]}},{"kind":"Field","alias":{"kind":"Name","value":"eventChannels"},"name":{"kind":"Name","value":"getAllEventChannels"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"ChannelFragment"}}]}},{"kind":"Field","alias":{"kind":"Name","value":"customEmojis"},"name":{"kind":"Name","value":"getAllDiscordEmojis"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"image"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"EventSettingsFragment"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Event"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"mentions"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"color"}}]}},{"kind":"Field","name":{"kind":"Name","value":"settings"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"hideLocation"}},{"kind":"Field","name":{"kind":"Name","value":"inviteOnly"}},{"kind":"Field","name":{"kind":"Name","value":"openToJoinRequests"}},{"kind":"Field","name":{"kind":"Name","value":"allowTeamSwitching"}},{"kind":"Field","name":{"kind":"Name","value":"allowCrewSwitching"}}]}},{"kind":"Field","name":{"kind":"Name","value":"accessType"}},{"kind":"Field","name":{"kind":"Name","value":"accessRoles"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"ChannelFragment"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"DiscordChannel"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"type"}}]}}]} as unknown as DocumentNode<GetEventSettingsQuery, GetEventSettingsQueryVariables>;
export const PostEventDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"PostEvent"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"eventId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","alias":{"kind":"Name","value":"success"},"name":{"kind":"Name","value":"postEvent"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"eventId"}}}]}]}}]} as unknown as DocumentNode<PostEventMutation, PostEventMutationVariables>;