/* eslint-disable */
import type { ID } from '@frcn/graphql-scalar-types/client';
import type { String } from '@frcn/graphql-scalar-types/client';
import type { Boolean } from '@frcn/graphql-scalar-types/client';
import type { Int } from '@frcn/graphql-scalar-types/client';
import type { Object } from '@frcn/graphql-scalar-types/client';
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
  Object: { input: Object['input']; output: Object['output']; }
  Timestamp: { input: Timestamp['input']; output: Timestamp['output']; }
};

export type AccessKey = {
  __typename?: 'AccessKey';
  createdAt: Scalars['Timestamp']['output'];
  description: Scalars['String']['output'];
  id: Scalars['Int']['output'];
  key?: Maybe<Scalars['String']['output']>;
  permissions: Scalars['Int']['output'];
  updatedAt: Scalars['Timestamp']['output'];
};

export type AccessKeyEditInput = {
  description?: InputMaybe<Scalars['String']['input']>;
  permissions?: InputMaybe<Scalars['Int']['input']>;
};

export enum CacheControlScope {
  Private = 'PRIVATE',
  Public = 'PUBLIC'
}

export type ContentContainer = {
  __typename?: 'ContentContainer';
  children: Array<ContentContainer>;
  content?: Maybe<Scalars['String']['output']>;
  files: Array<ContentContainerFile>;
  id: Scalars['ID']['output'];
  identifier?: Maybe<Scalars['String']['output']>;
  parent?: Maybe<ContentContainer>;
  recursiveChildren: Array<Scalars['Object']['output']>;
  title: Scalars['String']['output'];
  type: Scalars['String']['output'];
};

export type ContentContainerEditInput = {
  content?: InputMaybe<Scalars['String']['input']>;
  identifier?: InputMaybe<Scalars['String']['input']>;
  title?: InputMaybe<Scalars['String']['input']>;
};

export type ContentContainerFile = {
  __typename?: 'ContentContainerFile';
  contentType: Scalars['String']['output'];
  fileName: Scalars['String']['output'];
  fileSizeKb: Scalars['Int']['output'];
  id: Scalars['ID']['output'];
  identifier?: Maybe<Scalars['String']['output']>;
  previewUrl?: Maybe<Scalars['String']['output']>;
};

export type ContentContainerFileEditInput = {
  identifier?: InputMaybe<Scalars['String']['input']>;
};

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

export type DiscordEmojis = {
  __typename?: 'DiscordEmojis';
  emojis: Array<DiscordEmoji>;
  serverAvatar?: Maybe<Scalars['String']['output']>;
  serverName: Scalars['String']['output'];
};

export type DiscordGuild = {
  __typename?: 'DiscordGuild';
  id: Scalars['ID']['output'];
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
  channel?: Maybe<DiscordChannel>;
  createdAt: Scalars['Timestamp']['output'];
  description: Scalars['String']['output'];
  duration?: Maybe<Scalars['Int']['output']>;
  endedAt?: Maybe<Scalars['Timestamp']['output']>;
  eventType?: Maybe<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  imageUrl?: Maybe<Scalars['String']['output']>;
  location?: Maybe<Array<Scalars['String']['output']>>;
  members: Array<EventMember>;
  mentions: Array<Scalars['ID']['output']>;
  name: Scalars['String']['output'];
  owner?: Maybe<User>;
  posted: Scalars['Boolean']['output'];
  roles: Array<EventRsvpRole>;
  rsvp?: Maybe<EventMember>;
  settings: EventSettings;
  startAt?: Maybe<Scalars['Timestamp']['output']>;
  summary: Scalars['String']['output'];
  teams: Array<EventTeam>;
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
  eventType?: InputMaybe<Scalars['String']['input']>;
  includeCompleted?: InputMaybe<Scalars['Boolean']['input']>;
  maxDuration?: InputMaybe<Scalars['Int']['input']>;
  maxStartAt?: InputMaybe<Scalars['Timestamp']['input']>;
  minDuration?: InputMaybe<Scalars['Int']['input']>;
  minStartAt?: InputMaybe<Scalars['Timestamp']['input']>;
  search?: InputMaybe<Scalars['String']['input']>;
};

export type EventMember = {
  __typename?: 'EventMember';
  id: Scalars['ID']['output'];
  pending: Scalars['Boolean']['output'];
  rsvp?: Maybe<Scalars['ID']['output']>;
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
  allowTeamSwitching: Scalars['Boolean']['output'];
  hideLocation: Scalars['Boolean']['output'];
  inviteOnly: Scalars['Boolean']['output'];
  openToJoinRequests: Scalars['Boolean']['output'];
};

export type EventSettingsInput = {
  allowTeamSwitching: Scalars['Boolean']['input'];
  hideLocation: Scalars['Boolean']['input'];
  inviteOnly: Scalars['Boolean']['input'];
  openToJoinRequests: Scalars['Boolean']['input'];
};

export type EventTeam = {
  __typename?: 'EventTeam';
  id: Scalars['ID']['output'];
  members: Array<EventMember>;
  name: Scalars['String']['output'];
};

export type EventTeamCreateInput = {
  name: Scalars['String']['input'];
};

export type EventTeamEditInput = {
  name?: InputMaybe<Scalars['String']['input']>;
};

export type Mutation = {
  __typename?: 'Mutation';
  createAccessKey: AccessKey;
  createContentContainer: ContentContainer;
  createEvent: Scalars['ID']['output'];
  createEventTeam: EventTeam;
  createResource: Resource;
  createRole: Scalars['ID']['output'];
  deleteAccessKey: Scalars['Boolean']['output'];
  deleteContentContainer: Scalars['Boolean']['output'];
  deleteContentContainerFile: Scalars['Boolean']['output'];
  deleteCurrentUser: Scalars['Boolean']['output'];
  deleteEvent: Scalars['Boolean']['output'];
  deleteEventTeam: Scalars['Boolean']['output'];
  deleteResource: Scalars['Boolean']['output'];
  deleteRole: Scalars['Boolean']['output'];
  editAccessKey?: Maybe<AccessKey>;
  editContentContainer?: Maybe<ContentContainer>;
  editContentContainerFile?: Maybe<ContentContainerFile>;
  editEvent?: Maybe<Event>;
  editEventChannels: Array<DiscordChannel>;
  editEventTeam: EventTeam;
  editResource?: Maybe<Resource>;
  editRole?: Maybe<UserRole>;
  editSystemSettings: SystemSettings;
  editUserStatus: UserStatus;
  giveUserRole: Scalars['Boolean']['output'];
  kickEventMember: Scalars['Boolean']['output'];
  postEvent: Scalars['Boolean']['output'];
  regenerateAccessKey?: Maybe<AccessKey>;
  removeUserRole: Scalars['Boolean']['output'];
  reorderContentContainerChildren?: Maybe<ContentContainer>;
  reorderContentContainerFiles?: Maybe<ContentContainer>;
  reorderRoles: Array<Scalars['ID']['output']>;
  rsvpForEvent: Scalars['Boolean']['output'];
  setEventMemberTeam: Scalars['Boolean']['output'];
  setUserScName: User;
  syncRole?: Maybe<UserRole>;
  unrsvpForEvent: Scalars['Boolean']['output'];
  verifyUserScName: User;
};


export type MutationCreateContentContainerArgs = {
  identifier?: InputMaybe<Scalars['String']['input']>;
  parent?: InputMaybe<Scalars['ID']['input']>;
  type: Scalars['String']['input'];
};


export type MutationCreateEventTeamArgs = {
  data: EventTeamCreateInput;
  id: Scalars['ID']['input'];
};


export type MutationCreateResourceArgs = {
  data: ResourceCreateInput;
};


export type MutationDeleteAccessKeyArgs = {
  id: Scalars['Int']['input'];
};


export type MutationDeleteContentContainerArgs = {
  id: Scalars['ID']['input'];
};


export type MutationDeleteContentContainerFileArgs = {
  id: Scalars['ID']['input'];
};


export type MutationDeleteEventArgs = {
  id: Scalars['ID']['input'];
};


export type MutationDeleteEventTeamArgs = {
  id: Scalars['ID']['input'];
  team: Scalars['ID']['input'];
};


export type MutationDeleteResourceArgs = {
  id: Scalars['ID']['input'];
};


export type MutationDeleteRoleArgs = {
  id: Scalars['ID']['input'];
};


export type MutationEditAccessKeyArgs = {
  data: AccessKeyEditInput;
  id: Scalars['Int']['input'];
};


export type MutationEditContentContainerArgs = {
  data: ContentContainerEditInput;
  id: Scalars['ID']['input'];
};


export type MutationEditContentContainerFileArgs = {
  data: ContentContainerFileEditInput;
  id: Scalars['ID']['input'];
};


export type MutationEditEventArgs = {
  data: EventEditInput;
  id: Scalars['ID']['input'];
};


export type MutationEditEventChannelsArgs = {
  channels: Array<Scalars['ID']['input']>;
};


export type MutationEditEventTeamArgs = {
  data: EventTeamEditInput;
  id: Scalars['ID']['input'];
};


export type MutationEditResourceArgs = {
  data: ResourceEditInput;
  id: Scalars['ID']['input'];
};


export type MutationEditRoleArgs = {
  data: RoleEditInput;
  id: Scalars['ID']['input'];
};


export type MutationEditSystemSettingsArgs = {
  data: SystemEditInput;
};


export type MutationEditUserStatusArgs = {
  data: UserStatusEditInput;
};


export type MutationGiveUserRoleArgs = {
  roleId: Scalars['ID']['input'];
  userId: Scalars['ID']['input'];
};


export type MutationKickEventMemberArgs = {
  id: Scalars['ID']['input'];
  member: Scalars['ID']['input'];
};


export type MutationPostEventArgs = {
  id: Scalars['ID']['input'];
};


export type MutationRegenerateAccessKeyArgs = {
  id: Scalars['Int']['input'];
};


export type MutationRemoveUserRoleArgs = {
  roleId: Scalars['ID']['input'];
  userId: Scalars['ID']['input'];
};


export type MutationReorderContentContainerChildrenArgs = {
  id: Scalars['ID']['input'];
  order: Array<Scalars['ID']['input']>;
};


export type MutationReorderContentContainerFilesArgs = {
  id: Scalars['ID']['input'];
  order: Array<Scalars['ID']['input']>;
};


export type MutationReorderRolesArgs = {
  order: Array<Scalars['ID']['input']>;
};


export type MutationRsvpForEventArgs = {
  id: Scalars['ID']['input'];
  rsvp: Scalars['ID']['input'];
};


export type MutationSetEventMemberTeamArgs = {
  id: Scalars['ID']['input'];
  member: Scalars['ID']['input'];
  team?: InputMaybe<Scalars['ID']['input']>;
};


export type MutationSetUserScNameArgs = {
  name: Scalars['String']['input'];
};


export type MutationSyncRoleArgs = {
  id: Scalars['ID']['input'];
};


export type MutationUnrsvpForEventArgs = {
  id: Scalars['ID']['input'];
};


export type MutationVerifyUserScNameArgs = {
  code: Scalars['String']['input'];
};

export type PagedEvent = {
  __typename?: 'PagedEvent';
  items: Array<Event>;
  itemsPerPage: Scalars['Int']['output'];
  nextPage?: Maybe<Scalars['Int']['output']>;
  page: Scalars['Int']['output'];
  prevPage?: Maybe<Scalars['Int']['output']>;
  total: Scalars['Int']['output'];
};

export type PagedResource = {
  __typename?: 'PagedResource';
  items: Array<Resource>;
  itemsPerPage: Scalars['Int']['output'];
  nextPage?: Maybe<Scalars['Int']['output']>;
  page: Scalars['Int']['output'];
  prevPage?: Maybe<Scalars['Int']['output']>;
  total: Scalars['Int']['output'];
};

export enum Permission {
  Admin = 'Admin',
  CmsRead = 'CmsRead',
  CmsWrite = 'CmsWrite',
  CreateEvents = 'CreateEvents',
  ManageRoles = 'ManageRoles',
  ManageSystem = 'ManageSystem',
  Unassigned4 = 'Unassigned4',
  Unassigned5 = 'Unassigned5',
  Unassigned6 = 'Unassigned6',
  Unassigned7 = 'Unassigned7',
  Unassigned8 = 'Unassigned8',
  Unassigned9 = 'Unassigned9',
  Unassigned10 = 'Unassigned10',
  Unassigned11 = 'Unassigned11',
  Unassigned12 = 'Unassigned12',
  Unassigned13 = 'Unassigned13',
  Unassigned14 = 'Unassigned14',
  Unassigned15 = 'Unassigned15',
  Unassigned16 = 'Unassigned16',
  Unassigned17 = 'Unassigned17',
  Unassigned18 = 'Unassigned18',
  Unassigned19 = 'Unassigned19',
  Unassigned20 = 'Unassigned20',
  Unassigned21 = 'Unassigned21',
  Unassigned22 = 'Unassigned22',
  Unassigned23 = 'Unassigned23',
  Unassigned24 = 'Unassigned24',
  Unassigned25 = 'Unassigned25',
  Unassigned26 = 'Unassigned26',
  Unassigned27 = 'Unassigned27',
  UploadResources = 'UploadResources'
}

export type Query = {
  __typename?: 'Query';
  getAccessKey?: Maybe<AccessKey>;
  getAllAccessKeys: Array<AccessKey>;
  getAllDiscordChannels: Array<DiscordChannel>;
  getAllDiscordEmojis: DiscordEmojis;
  getAllDiscordRoles: Array<DiscordRole>;
  getAllEventChannels: Array<DiscordChannel>;
  getContentContainer?: Maybe<ContentContainer>;
  getContentContainerById?: Maybe<ContentContainer>;
  getContentContainersOfType: Array<ContentContainer>;
  getCurrentAccessKey?: Maybe<AccessKey>;
  getCurrentUser?: Maybe<User>;
  getEvent?: Maybe<Event>;
  getEvents?: Maybe<PagedEvent>;
  getResource?: Maybe<Resource>;
  getResources?: Maybe<PagedResource>;
  getRole?: Maybe<UserRole>;
  getRoleOrder: Array<Scalars['ID']['output']>;
  getRoles: Array<UserRole>;
  getSystemSettings: SystemSettings;
  getUser?: Maybe<User>;
  getUserScVerifyCode?: Maybe<Scalars['String']['output']>;
};


export type QueryGetAccessKeyArgs = {
  id: Scalars['Int']['input'];
};


export type QueryGetAllDiscordRolesArgs = {
  everyone?: InputMaybe<Scalars['Boolean']['input']>;
};


export type QueryGetContentContainerArgs = {
  identifier: Scalars['String']['input'];
  parentId?: InputMaybe<Scalars['ID']['input']>;
  type: Scalars['String']['input'];
};


export type QueryGetContentContainerByIdArgs = {
  id: Scalars['ID']['input'];
};


export type QueryGetContentContainersOfTypeArgs = {
  parentId?: InputMaybe<Scalars['ID']['input']>;
  type: Scalars['String']['input'];
};


export type QueryGetEventArgs = {
  id: Scalars['ID']['input'];
};


export type QueryGetEventsArgs = {
  filter?: InputMaybe<EventFilterInput>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  page?: InputMaybe<Scalars['Int']['input']>;
};


export type QueryGetResourceArgs = {
  id: Scalars['ID']['input'];
};


export type QueryGetResourcesArgs = {
  filter?: InputMaybe<ResourceFilterInput>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  page?: InputMaybe<Scalars['Int']['input']>;
};


export type QueryGetRoleArgs = {
  id: Scalars['ID']['input'];
};


export type QueryGetUserArgs = {
  id: Scalars['ID']['input'];
};

export type Resource = {
  __typename?: 'Resource';
  createdAt: Scalars['Timestamp']['output'];
  downloadUrl?: Maybe<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  name: Scalars['String']['output'];
  owner?: Maybe<User>;
  previewUrl?: Maybe<Scalars['String']['output']>;
  shortDescription: Scalars['String']['output'];
  sizeKb: Scalars['Int']['output'];
  tags: Array<Scalars['String']['output']>;
  updatedAt: Scalars['Timestamp']['output'];
};

export type ResourceCreateInput = {
  name: Scalars['String']['input'];
  shortDescription: Scalars['String']['input'];
  tags: Array<Scalars['String']['input']>;
};

export type ResourceEditInput = {
  name?: InputMaybe<Scalars['String']['input']>;
  shortDescription?: InputMaybe<Scalars['String']['input']>;
  tags?: InputMaybe<Array<Scalars['String']['input']>>;
};

export type ResourceFilterInput = {
  search?: InputMaybe<Scalars['String']['input']>;
  tags?: InputMaybe<Array<Scalars['String']['input']>>;
};

export type RoleEditInput = {
  discordId?: InputMaybe<Scalars['ID']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  newPrimaryRole?: InputMaybe<Scalars['ID']['input']>;
  permissions?: InputMaybe<Scalars['Int']['input']>;
  primary?: InputMaybe<Scalars['Boolean']['input']>;
};

export type Subscription = {
  __typename?: 'Subscription';
  userRolesUpdated: UpdatedUserRoles;
};


export type SubscriptionUserRolesUpdatedArgs = {
  userId: Scalars['ID']['input'];
};

export type SystemEditInput = {
  defaultEventChannelId?: InputMaybe<Scalars['ID']['input']>;
  discordGuildId?: InputMaybe<Scalars['ID']['input']>;
};

export type SystemSettings = {
  __typename?: 'SystemSettings';
  defaultEventChannel?: Maybe<DiscordChannel>;
  discordGuild: DiscordGuild;
};

export type UpdatedUserRoles = {
  __typename?: 'UpdatedUserRoles';
  permissions: Scalars['Int']['output'];
  primaryRole: UserRole;
  roles: Array<UserRole>;
  userId: Scalars['ID']['output'];
};

export type User = {
  __typename?: 'User';
  avatarUrl: Scalars['String']['output'];
  createdAt: Scalars['Timestamp']['output'];
  discordId: Scalars['ID']['output'];
  discordName: Scalars['String']['output'];
  discordUsername: Scalars['String']['output'];
  events: Array<Event>;
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
  discordId?: Maybe<Scalars['String']['output']>;
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

export type ChannelFragmentFragment = { __typename?: 'DiscordChannel', id: ID['output'], name: String['output'], type?: String['output'] | null };

export type ContentContainerFragmentFragment = { __typename?: 'ContentContainer', id: ID['output'], identifier?: String['output'] | null, type: String['output'], title: String['output'], content?: String['output'] | null, files: Array<{ __typename?: 'ContentContainerFile', id: ID['output'], identifier?: String['output'] | null, fileName: String['output'], fileSizeKb: Int['output'], contentType: String['output'], previewUrl?: String['output'] | null }>, parent?: { __typename?: 'ContentContainer', id: ID['output'] } | null };

export type ContentContainerFileFragmentFragment = { __typename?: 'ContentContainerFile', id: ID['output'], identifier?: String['output'] | null, fileName: String['output'], fileSizeKb: Int['output'], contentType: String['output'], previewUrl?: String['output'] | null };

export type EventFragmentFragment = { __typename?: 'Event', id: ID['output'], name: String['output'], summary: String['output'], description: String['output'], imageUrl?: String['output'] | null, eventType?: String['output'] | null, location?: Array<String['output']> | null, posted: Boolean['output'], duration?: Int['output'] | null, startAt?: Timestamp['output'] | null, endedAt?: Timestamp['output'] | null, updatedAt: Timestamp['output'], createdAt: Timestamp['output'], channel?: { __typename?: 'DiscordChannel', id: ID['output'], name: String['output'], type?: String['output'] | null } | null, owner?: { __typename?: 'User', id: ID['output'], name: String['output'], scName?: String['output'] | null, discordId: ID['output'], discordName: String['output'], discordUsername: String['output'], verified: Boolean['output'], avatarUrl: String['output'], updatedAt: Timestamp['output'], createdAt: Timestamp['output'], primaryRole: { __typename?: 'UserRole', id: ID['output'], name: String['output'] }, roles: Array<{ __typename?: 'UserRole', id: ID['output'], name: String['output'] }> } | null, rsvp?: { __typename?: 'EventMember', pending: Boolean['output'], rsvp?: ID['output'] | null } | null, rsvpRoles: Array<{ __typename?: 'EventRsvpRole', id: ID['output'], name: String['output'], limit: Int['output'], emoji: { __typename?: 'DiscordEmoji', id: ID['output'], name: String['output'], image?: String['output'] | null } }>, members: Array<{ __typename?: 'EventMember', id: ID['output'], pending: Boolean['output'], rsvp?: ID['output'] | null, rsvpAt: Timestamp['output'], user: { __typename?: 'User', id: ID['output'], name: String['output'], avatarUrl: String['output'] } }> };

export type EventMemberFragmentFragment = { __typename?: 'EventMember', id: ID['output'], pending: Boolean['output'], rsvp?: ID['output'] | null, rsvpAt: Timestamp['output'], user: { __typename?: 'User', id: ID['output'], name: String['output'], avatarUrl: String['output'] } };

export type EventSettingsFragmentFragment = { __typename?: 'Event', mentions: Array<ID['output']>, accessType: EventAccessType, settings: { __typename?: 'EventSettings', hideLocation: Boolean['output'], inviteOnly: Boolean['output'], openToJoinRequests: Boolean['output'], allowTeamSwitching: Boolean['output'] }, accessRoles: Array<{ __typename?: 'UserRole', id: ID['output'], name: String['output'] }> };

export type ResourceFragmentFragment = { __typename?: 'Resource', id: ID['output'], name: String['output'], sizeKb: Int['output'], shortDescription: String['output'], previewUrl?: String['output'] | null, downloadUrl?: String['output'] | null, tags: Array<String['output']>, updatedAt: Timestamp['output'], createdAt: Timestamp['output'], owner?: { __typename?: 'User', id: ID['output'], name: String['output'], scName?: String['output'] | null, discordId: ID['output'], discordName: String['output'], discordUsername: String['output'], verified: Boolean['output'], avatarUrl: String['output'], updatedAt: Timestamp['output'], createdAt: Timestamp['output'], primaryRole: { __typename?: 'UserRole', id: ID['output'], name: String['output'] }, roles: Array<{ __typename?: 'UserRole', id: ID['output'], name: String['output'] }> } | null };

export type RoleFragmentFragment = { __typename?: 'UserRole', id: ID['output'], name: String['output'], primary: Boolean['output'], discordId?: String['output'] | null, permissions: Int['output'], updatedAt: Timestamp['output'], createdAt: Timestamp['output'] };

export type UserFragmentFragment = { __typename?: 'User', id: ID['output'], name: String['output'], scName?: String['output'] | null, discordId: ID['output'], discordName: String['output'], discordUsername: String['output'], verified: Boolean['output'], avatarUrl: String['output'], updatedAt: Timestamp['output'], createdAt: Timestamp['output'], primaryRole: { __typename?: 'UserRole', id: ID['output'], name: String['output'] }, roles: Array<{ __typename?: 'UserRole', id: ID['output'], name: String['output'] }> };

export type CreateAccessKeyMutationVariables = Exact<{ [key: string]: never; }>;


export type CreateAccessKeyMutation = { __typename?: 'Mutation', key: { __typename?: 'AccessKey', id: Int['output'], key?: String['output'] | null, description: String['output'], permissions: Int['output'], updatedAt: Timestamp['output'], createdAt: Timestamp['output'] } };

export type CreateContentContainerMutationVariables = Exact<{
  type: Scalars['String']['input'];
  identifier?: InputMaybe<Scalars['String']['input']>;
  parent?: InputMaybe<Scalars['ID']['input']>;
}>;


export type CreateContentContainerMutation = { __typename?: 'Mutation', container: { __typename?: 'ContentContainer', id: ID['output'], identifier?: String['output'] | null, type: String['output'], title: String['output'], content?: String['output'] | null, files: Array<{ __typename?: 'ContentContainerFile', id: ID['output'], identifier?: String['output'] | null, fileName: String['output'], fileSizeKb: Int['output'], contentType: String['output'], previewUrl?: String['output'] | null }>, parent?: { __typename?: 'ContentContainer', id: ID['output'] } | null } };

export type CreateEventMutationVariables = Exact<{ [key: string]: never; }>;


export type CreateEventMutation = { __typename?: 'Mutation', event: ID['output'] };

export type CreateResourceMutationVariables = Exact<{
  data: ResourceCreateInput;
}>;


export type CreateResourceMutation = { __typename?: 'Mutation', resource: { __typename?: 'Resource', id: ID['output'], name: String['output'], sizeKb: Int['output'], shortDescription: String['output'], previewUrl?: String['output'] | null, downloadUrl?: String['output'] | null, tags: Array<String['output']>, updatedAt: Timestamp['output'], createdAt: Timestamp['output'], owner?: { __typename?: 'User', id: ID['output'], name: String['output'], scName?: String['output'] | null, discordId: ID['output'], discordName: String['output'], discordUsername: String['output'], verified: Boolean['output'], avatarUrl: String['output'], updatedAt: Timestamp['output'], createdAt: Timestamp['output'], primaryRole: { __typename?: 'UserRole', id: ID['output'], name: String['output'] }, roles: Array<{ __typename?: 'UserRole', id: ID['output'], name: String['output'] }> } | null } };

export type CreateRoleMutationVariables = Exact<{ [key: string]: never; }>;


export type CreateRoleMutation = { __typename?: 'Mutation', role: ID['output'] };

export type DeleteAccessKeyMutationVariables = Exact<{
  id: Scalars['Int']['input'];
}>;


export type DeleteAccessKeyMutation = { __typename?: 'Mutation', deleted: Boolean['output'] };

export type DeleteContentContainerMutationVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type DeleteContentContainerMutation = { __typename?: 'Mutation', deleted: Boolean['output'] };

export type DeleteContentContainerFileMutationVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type DeleteContentContainerFileMutation = { __typename?: 'Mutation', deleted: Boolean['output'] };

export type DeleteCurrentUserMutationVariables = Exact<{ [key: string]: never; }>;


export type DeleteCurrentUserMutation = { __typename?: 'Mutation', deleted: Boolean['output'] };

export type DeleteEventMutationVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type DeleteEventMutation = { __typename?: 'Mutation', deleted: Boolean['output'] };

export type DeleteResourceMutationVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type DeleteResourceMutation = { __typename?: 'Mutation', deleted: Boolean['output'] };

export type DeleteRoleMutationVariables = Exact<{
  roleId: Scalars['ID']['input'];
}>;


export type DeleteRoleMutation = { __typename?: 'Mutation', deleted: Boolean['output'] };

export type EditAccessKeyMutationVariables = Exact<{
  id: Scalars['Int']['input'];
  data: AccessKeyEditInput;
}>;


export type EditAccessKeyMutation = { __typename?: 'Mutation', key?: { __typename?: 'AccessKey', id: Int['output'], description: String['output'], permissions: Int['output'], updatedAt: Timestamp['output'], createdAt: Timestamp['output'] } | null };

export type EditContentContainerMutationVariables = Exact<{
  id: Scalars['ID']['input'];
  data: ContentContainerEditInput;
}>;


export type EditContentContainerMutation = { __typename?: 'Mutation', container?: { __typename?: 'ContentContainer', id: ID['output'] } | null };

export type EditContentContainerFileMutationVariables = Exact<{
  id: Scalars['ID']['input'];
  data: ContentContainerFileEditInput;
}>;


export type EditContentContainerFileMutation = { __typename?: 'Mutation', file?: { __typename?: 'ContentContainerFile', id: ID['output'] } | null };

export type EditEventMutationVariables = Exact<{
  eventId: Scalars['ID']['input'];
  data: EventEditInput;
}>;


export type EditEventMutation = { __typename?: 'Mutation', event?: { __typename?: 'Event', id: ID['output'], name: String['output'], summary: String['output'], description: String['output'], imageUrl?: String['output'] | null, eventType?: String['output'] | null, location?: Array<String['output']> | null, posted: Boolean['output'], duration?: Int['output'] | null, startAt?: Timestamp['output'] | null, endedAt?: Timestamp['output'] | null, updatedAt: Timestamp['output'], createdAt: Timestamp['output'], mentions: Array<ID['output']>, accessType: EventAccessType, channel?: { __typename?: 'DiscordChannel', id: ID['output'], name: String['output'], type?: String['output'] | null } | null, owner?: { __typename?: 'User', id: ID['output'], name: String['output'], scName?: String['output'] | null, discordId: ID['output'], discordName: String['output'], discordUsername: String['output'], verified: Boolean['output'], avatarUrl: String['output'], updatedAt: Timestamp['output'], createdAt: Timestamp['output'], primaryRole: { __typename?: 'UserRole', id: ID['output'], name: String['output'] }, roles: Array<{ __typename?: 'UserRole', id: ID['output'], name: String['output'] }> } | null, rsvp?: { __typename?: 'EventMember', pending: Boolean['output'], rsvp?: ID['output'] | null } | null, rsvpRoles: Array<{ __typename?: 'EventRsvpRole', id: ID['output'], name: String['output'], limit: Int['output'], emoji: { __typename?: 'DiscordEmoji', id: ID['output'], name: String['output'], image?: String['output'] | null } }>, members: Array<{ __typename?: 'EventMember', id: ID['output'], pending: Boolean['output'], rsvp?: ID['output'] | null, rsvpAt: Timestamp['output'], user: { __typename?: 'User', id: ID['output'], name: String['output'], avatarUrl: String['output'] } }>, settings: { __typename?: 'EventSettings', hideLocation: Boolean['output'], inviteOnly: Boolean['output'], openToJoinRequests: Boolean['output'], allowTeamSwitching: Boolean['output'] }, accessRoles: Array<{ __typename?: 'UserRole', id: ID['output'], name: String['output'] }> } | null };

export type EditResourceMutationVariables = Exact<{
  id: Scalars['ID']['input'];
  data: ResourceEditInput;
}>;


export type EditResourceMutation = { __typename?: 'Mutation', resource?: { __typename?: 'Resource', id: ID['output'], name: String['output'], sizeKb: Int['output'], shortDescription: String['output'], previewUrl?: String['output'] | null, downloadUrl?: String['output'] | null, tags: Array<String['output']>, updatedAt: Timestamp['output'], createdAt: Timestamp['output'], owner?: { __typename?: 'User', id: ID['output'], name: String['output'], scName?: String['output'] | null, discordId: ID['output'], discordName: String['output'], discordUsername: String['output'], verified: Boolean['output'], avatarUrl: String['output'], updatedAt: Timestamp['output'], createdAt: Timestamp['output'], primaryRole: { __typename?: 'UserRole', id: ID['output'], name: String['output'] }, roles: Array<{ __typename?: 'UserRole', id: ID['output'], name: String['output'] }> } | null } | null };

export type EditRoleMutationVariables = Exact<{
  roleId: Scalars['ID']['input'];
  data: RoleEditInput;
}>;


export type EditRoleMutation = { __typename?: 'Mutation', role?: { __typename?: 'UserRole', id: ID['output'], name: String['output'], discordId?: String['output'] | null, primary: Boolean['output'], permissions: Int['output'], updatedAt: Timestamp['output'], createdAt: Timestamp['output'] } | null };

export type EditSystemSettingsMutationVariables = Exact<{
  data: SystemEditInput;
}>;


export type EditSystemSettingsMutation = { __typename?: 'Mutation', settings: { __typename?: 'SystemSettings', discordGuild: { __typename?: 'DiscordGuild', id: ID['output'], name: String['output'] }, defaultEventChannel?: { __typename?: 'DiscordChannel', id: ID['output'], name: String['output'], type?: String['output'] | null } | null } };

export type PostEventMutationVariables = Exact<{
  eventId: Scalars['ID']['input'];
}>;


export type PostEventMutation = { __typename?: 'Mutation', success: Boolean['output'] };

export type RegenerateAccessKeyMutationVariables = Exact<{
  id: Scalars['Int']['input'];
}>;


export type RegenerateAccessKeyMutation = { __typename?: 'Mutation', key?: { __typename?: 'AccessKey', id: Int['output'], key?: String['output'] | null } | null };

export type ReorderRolesMutationVariables = Exact<{
  order: Array<Scalars['ID']['input']> | Scalars['ID']['input'];
}>;


export type ReorderRolesMutation = { __typename?: 'Mutation', order: Array<ID['output']> };

export type RsvpForEventMutationVariables = Exact<{
  eventId: Scalars['ID']['input'];
  rsvpId: Scalars['ID']['input'];
}>;


export type RsvpForEventMutation = { __typename?: 'Mutation', success: Boolean['output'] };

export type UnrsvpForEventMutationVariables = Exact<{
  eventId: Scalars['ID']['input'];
}>;


export type UnrsvpForEventMutation = { __typename?: 'Mutation', success: Boolean['output'] };

export type GetCurrentRsvpsQueryVariables = Exact<{ [key: string]: never; }>;


export type GetCurrentRsvpsQuery = { __typename?: 'Query', rsvps?: { __typename?: 'User', rsvps: Array<{ __typename?: 'EventRsvp', invite: Boolean['output'], rsvpAt: Timestamp['output'], rsvp?: { __typename?: 'EventRsvpRole', id: ID['output'], name: String['output'] } | null, event: { __typename?: 'Event', id: ID['output'], name: String['output'], summary: String['output'], description: String['output'], imageUrl?: String['output'] | null, eventType?: String['output'] | null, location?: Array<String['output']> | null, duration?: Int['output'] | null, startAt?: Timestamp['output'] | null, endedAt?: Timestamp['output'] | null, updatedAt: Timestamp['output'], createdAt: Timestamp['output'], owner?: { __typename?: 'User', id: ID['output'], name: String['output'], scName?: String['output'] | null, avatarUrl: String['output'], verified: Boolean['output'], updatedAt: Timestamp['output'], createdAt: Timestamp['output'] } | null } }> } | null };

export type GetCurrentUserQueryVariables = Exact<{ [key: string]: never; }>;


export type GetCurrentUserQuery = { __typename?: 'Query', user?: { __typename?: 'User', permissions: Int['output'], id: ID['output'], name: String['output'], scName?: String['output'] | null, discordId: ID['output'], discordName: String['output'], discordUsername: String['output'], verified: Boolean['output'], avatarUrl: String['output'], updatedAt: Timestamp['output'], createdAt: Timestamp['output'], settings: { __typename?: 'UserSettings', updatedAt: Timestamp['output'] }, status: { __typename?: 'UserStatus', activity?: String['output'] | null, ship?: String['output'] | null, updatedAt: Timestamp['output'] }, primaryRole: { __typename?: 'UserRole', id: ID['output'], name: String['output'] }, roles: Array<{ __typename?: 'UserRole', id: ID['output'], name: String['output'] }> } | null };

export type GetAllAccessKeysQueryVariables = Exact<{ [key: string]: never; }>;


export type GetAllAccessKeysQuery = { __typename?: 'Query', keys: Array<{ __typename?: 'AccessKey', id: Int['output'], description: String['output'], permissions: Int['output'], updatedAt: Timestamp['output'], createdAt: Timestamp['output'] }> };

export type GetAllRolesQueryVariables = Exact<{ [key: string]: never; }>;


export type GetAllRolesQuery = { __typename?: 'Query', roles: Array<{ __typename?: 'UserRole', id: ID['output'], name: String['output'], primary: Boolean['output'], discordId?: String['output'] | null, permissions: Int['output'], updatedAt: Timestamp['output'], createdAt: Timestamp['output'], users: Array<{ __typename?: 'User', id: ID['output'] }> }> };

export type GetContentContainerQueryVariables = Exact<{
  identifier: Scalars['String']['input'];
  type: Scalars['String']['input'];
}>;


export type GetContentContainerQuery = { __typename?: 'Query', container?: { __typename?: 'ContentContainer', id: ID['output'], identifier?: String['output'] | null, type: String['output'], title: String['output'], content?: String['output'] | null, files: Array<{ __typename?: 'ContentContainerFile', id: ID['output'], identifier?: String['output'] | null, fileName: String['output'], fileSizeKb: Int['output'], contentType: String['output'], previewUrl?: String['output'] | null }>, parent?: { __typename?: 'ContentContainer', id: ID['output'] } | null } | null };

export type GetContentContainerByIdQueryVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type GetContentContainerByIdQuery = { __typename?: 'Query', container?: { __typename?: 'ContentContainer', recursiveChildren: Array<Object['output']>, id: ID['output'], identifier?: String['output'] | null, type: String['output'], title: String['output'], content?: String['output'] | null, files: Array<{ __typename?: 'ContentContainerFile', id: ID['output'], identifier?: String['output'] | null, fileName: String['output'], fileSizeKb: Int['output'], contentType: String['output'], previewUrl?: String['output'] | null }>, parent?: { __typename?: 'ContentContainer', id: ID['output'] } | null } | null };

export type GetContentContainerWithDescendantsQueryVariables = Exact<{
  identifier: Scalars['String']['input'];
  type: Scalars['String']['input'];
}>;


export type GetContentContainerWithDescendantsQuery = { __typename?: 'Query', container?: { __typename?: 'ContentContainer', recursiveChildren: Array<Object['output']>, id: ID['output'], identifier?: String['output'] | null, type: String['output'], title: String['output'], content?: String['output'] | null, files: Array<{ __typename?: 'ContentContainerFile', id: ID['output'], identifier?: String['output'] | null, fileName: String['output'], fileSizeKb: Int['output'], contentType: String['output'], previewUrl?: String['output'] | null }>, parent?: { __typename?: 'ContentContainer', id: ID['output'] } | null } | null };

export type GetContentContainersOfTypeQueryVariables = Exact<{
  type: Scalars['String']['input'];
}>;


export type GetContentContainersOfTypeQuery = { __typename?: 'Query', containers: Array<{ __typename?: 'ContentContainer', id: ID['output'], identifier?: String['output'] | null, type: String['output'], title: String['output'], content?: String['output'] | null, files: Array<{ __typename?: 'ContentContainerFile', id: ID['output'], identifier?: String['output'] | null, fileName: String['output'], fileSizeKb: Int['output'], contentType: String['output'], previewUrl?: String['output'] | null }>, parent?: { __typename?: 'ContentContainer', id: ID['output'] } | null }> };

export type GetEventQueryVariables = Exact<{
  eventId: Scalars['ID']['input'];
}>;


export type GetEventQuery = { __typename?: 'Query', event?: { __typename?: 'Event', id: ID['output'], name: String['output'], summary: String['output'], description: String['output'], imageUrl?: String['output'] | null, eventType?: String['output'] | null, location?: Array<String['output']> | null, posted: Boolean['output'], duration?: Int['output'] | null, startAt?: Timestamp['output'] | null, endedAt?: Timestamp['output'] | null, updatedAt: Timestamp['output'], createdAt: Timestamp['output'], channel?: { __typename?: 'DiscordChannel', id: ID['output'], name: String['output'], type?: String['output'] | null } | null, owner?: { __typename?: 'User', id: ID['output'], name: String['output'], scName?: String['output'] | null, discordId: ID['output'], discordName: String['output'], discordUsername: String['output'], verified: Boolean['output'], avatarUrl: String['output'], updatedAt: Timestamp['output'], createdAt: Timestamp['output'], primaryRole: { __typename?: 'UserRole', id: ID['output'], name: String['output'] }, roles: Array<{ __typename?: 'UserRole', id: ID['output'], name: String['output'] }> } | null, rsvp?: { __typename?: 'EventMember', pending: Boolean['output'], rsvp?: ID['output'] | null } | null, rsvpRoles: Array<{ __typename?: 'EventRsvpRole', id: ID['output'], name: String['output'], limit: Int['output'], emoji: { __typename?: 'DiscordEmoji', id: ID['output'], name: String['output'], image?: String['output'] | null } }>, members: Array<{ __typename?: 'EventMember', id: ID['output'], pending: Boolean['output'], rsvp?: ID['output'] | null, rsvpAt: Timestamp['output'], user: { __typename?: 'User', id: ID['output'], name: String['output'], avatarUrl: String['output'] } }> } | null };

export type GetEventSettingsQueryVariables = Exact<{
  eventId: Scalars['ID']['input'];
}>;


export type GetEventSettingsQuery = { __typename?: 'Query', event?: { __typename?: 'Event', mentions: Array<ID['output']>, accessType: EventAccessType, settings: { __typename?: 'EventSettings', hideLocation: Boolean['output'], inviteOnly: Boolean['output'], openToJoinRequests: Boolean['output'], allowTeamSwitching: Boolean['output'] }, accessRoles: Array<{ __typename?: 'UserRole', id: ID['output'], name: String['output'] }> } | null, eventChannels: Array<{ __typename?: 'DiscordChannel', id: ID['output'], name: String['output'], type?: String['output'] | null }>, customEmojis: { __typename?: 'DiscordEmojis', serverName: String['output'], serverAvatar?: String['output'] | null, emojis: Array<{ __typename?: 'DiscordEmoji', id: ID['output'], name: String['output'], image?: String['output'] | null }> }, discordRoles: Array<{ __typename?: 'DiscordRole', id: ID['output'], name: String['output'], color: String['output'] }> };

export type GetEventsQueryVariables = Exact<{
  filter?: InputMaybe<EventFilterInput>;
  page?: InputMaybe<Scalars['Int']['input']>;
  limit?: InputMaybe<Scalars['Int']['input']>;
}>;


export type GetEventsQuery = { __typename?: 'Query', events?: { __typename?: 'PagedEvent', itemsPerPage: Int['output'], page: Int['output'], nextPage?: Int['output'] | null, prevPage?: Int['output'] | null, total: Int['output'], items: Array<{ __typename?: 'Event', id: ID['output'], name: String['output'], summary: String['output'], description: String['output'], imageUrl?: String['output'] | null, eventType?: String['output'] | null, location?: Array<String['output']> | null, posted: Boolean['output'], duration?: Int['output'] | null, startAt?: Timestamp['output'] | null, endedAt?: Timestamp['output'] | null, updatedAt: Timestamp['output'], createdAt: Timestamp['output'], channel?: { __typename?: 'DiscordChannel', id: ID['output'], name: String['output'], type?: String['output'] | null } | null, owner?: { __typename?: 'User', id: ID['output'], name: String['output'], scName?: String['output'] | null, discordId: ID['output'], discordName: String['output'], discordUsername: String['output'], verified: Boolean['output'], avatarUrl: String['output'], updatedAt: Timestamp['output'], createdAt: Timestamp['output'], primaryRole: { __typename?: 'UserRole', id: ID['output'], name: String['output'] }, roles: Array<{ __typename?: 'UserRole', id: ID['output'], name: String['output'] }> } | null, rsvp?: { __typename?: 'EventMember', pending: Boolean['output'], rsvp?: ID['output'] | null } | null, rsvpRoles: Array<{ __typename?: 'EventRsvpRole', id: ID['output'], name: String['output'], limit: Int['output'], emoji: { __typename?: 'DiscordEmoji', id: ID['output'], name: String['output'], image?: String['output'] | null } }>, members: Array<{ __typename?: 'EventMember', id: ID['output'], pending: Boolean['output'], rsvp?: ID['output'] | null, rsvpAt: Timestamp['output'], user: { __typename?: 'User', id: ID['output'], name: String['output'], avatarUrl: String['output'] } }> }> } | null };

export type GetOwnedEventsQueryVariables = Exact<{ [key: string]: never; }>;


export type GetOwnedEventsQuery = { __typename?: 'Query', events?: { __typename?: 'User', events: Array<{ __typename?: 'Event', id: ID['output'], name: String['output'], summary: String['output'], description: String['output'], imageUrl?: String['output'] | null, eventType?: String['output'] | null, location?: Array<String['output']> | null, posted: Boolean['output'], duration?: Int['output'] | null, startAt?: Timestamp['output'] | null, endedAt?: Timestamp['output'] | null, updatedAt: Timestamp['output'], createdAt: Timestamp['output'], channel?: { __typename?: 'DiscordChannel', id: ID['output'], name: String['output'], type?: String['output'] | null } | null, owner?: { __typename?: 'User', id: ID['output'], name: String['output'], scName?: String['output'] | null, discordId: ID['output'], discordName: String['output'], discordUsername: String['output'], verified: Boolean['output'], avatarUrl: String['output'], updatedAt: Timestamp['output'], createdAt: Timestamp['output'], primaryRole: { __typename?: 'UserRole', id: ID['output'], name: String['output'] }, roles: Array<{ __typename?: 'UserRole', id: ID['output'], name: String['output'] }> } | null, rsvp?: { __typename?: 'EventMember', pending: Boolean['output'], rsvp?: ID['output'] | null } | null, rsvpRoles: Array<{ __typename?: 'EventRsvpRole', id: ID['output'], name: String['output'], limit: Int['output'], emoji: { __typename?: 'DiscordEmoji', id: ID['output'], name: String['output'], image?: String['output'] | null } }>, members: Array<{ __typename?: 'EventMember', id: ID['output'], pending: Boolean['output'], rsvp?: ID['output'] | null, rsvpAt: Timestamp['output'], user: { __typename?: 'User', id: ID['output'], name: String['output'], avatarUrl: String['output'] } }> }> } | null };

export type GetResourceQueryVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type GetResourceQuery = { __typename?: 'Query', resource?: { __typename?: 'Resource', id: ID['output'], name: String['output'], sizeKb: Int['output'], shortDescription: String['output'], previewUrl?: String['output'] | null, downloadUrl?: String['output'] | null, tags: Array<String['output']>, updatedAt: Timestamp['output'], createdAt: Timestamp['output'], owner?: { __typename?: 'User', id: ID['output'], name: String['output'], scName?: String['output'] | null, discordId: ID['output'], discordName: String['output'], discordUsername: String['output'], verified: Boolean['output'], avatarUrl: String['output'], updatedAt: Timestamp['output'], createdAt: Timestamp['output'], primaryRole: { __typename?: 'UserRole', id: ID['output'], name: String['output'] }, roles: Array<{ __typename?: 'UserRole', id: ID['output'], name: String['output'] }> } | null } | null };

export type GetResourcesQueryVariables = Exact<{
  filter?: InputMaybe<ResourceFilterInput>;
  page?: InputMaybe<Scalars['Int']['input']>;
  limit?: InputMaybe<Scalars['Int']['input']>;
}>;


export type GetResourcesQuery = { __typename?: 'Query', resources?: { __typename?: 'PagedResource', itemsPerPage: Int['output'], page: Int['output'], nextPage?: Int['output'] | null, prevPage?: Int['output'] | null, total: Int['output'], items: Array<{ __typename?: 'Resource', id: ID['output'], name: String['output'], sizeKb: Int['output'], shortDescription: String['output'], previewUrl?: String['output'] | null, downloadUrl?: String['output'] | null, tags: Array<String['output']>, updatedAt: Timestamp['output'], createdAt: Timestamp['output'], owner?: { __typename?: 'User', id: ID['output'], name: String['output'], scName?: String['output'] | null, discordId: ID['output'], discordName: String['output'], discordUsername: String['output'], verified: Boolean['output'], avatarUrl: String['output'], updatedAt: Timestamp['output'], createdAt: Timestamp['output'], primaryRole: { __typename?: 'UserRole', id: ID['output'], name: String['output'] }, roles: Array<{ __typename?: 'UserRole', id: ID['output'], name: String['output'] }> } | null }> } | null };

export type GetRoleQueryVariables = Exact<{
  roleId: Scalars['ID']['input'];
}>;


export type GetRoleQuery = { __typename?: 'Query', role?: { __typename?: 'UserRole', id: ID['output'], name: String['output'], discordId?: String['output'] | null, primary: Boolean['output'], permissions: Int['output'], users: Array<{ __typename?: 'User', id: ID['output'], name: String['output'], avatarUrl: String['output'] }> } | null, discordRoles: Array<{ __typename?: 'DiscordRole', id: ID['output'], name: String['output'], color: String['output'] }> };

export type GetSystemSettingsQueryVariables = Exact<{ [key: string]: never; }>;


export type GetSystemSettingsQuery = { __typename?: 'Query', settings: { __typename?: 'SystemSettings', discordGuild: { __typename?: 'DiscordGuild', id: ID['output'], name: String['output'] }, defaultEventChannel?: { __typename?: 'DiscordChannel', id: ID['output'], name: String['output'], type?: String['output'] | null } | null }, eventChannels: Array<{ __typename?: 'DiscordChannel', id: ID['output'], name: String['output'], type?: String['output'] | null }> };

export type GetUserQueryVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type GetUserQuery = { __typename?: 'Query', user?: { __typename?: 'User', id: ID['output'], name: String['output'], scName?: String['output'] | null, discordId: ID['output'], discordName: String['output'], discordUsername: String['output'], verified: Boolean['output'], avatarUrl: String['output'], updatedAt: Timestamp['output'], createdAt: Timestamp['output'], primaryRole: { __typename?: 'UserRole', id: ID['output'], name: String['output'] }, roles: Array<{ __typename?: 'UserRole', id: ID['output'], name: String['output'] }> } | null };

export type OnRolesUpdatedSubscriptionVariables = Exact<{
  userId: Scalars['ID']['input'];
}>;


export type OnRolesUpdatedSubscription = { __typename?: 'Subscription', roles: { __typename?: 'UpdatedUserRoles', permissions: Int['output'], primaryRole: { __typename?: 'UserRole', id: ID['output'], name: String['output'] }, roles: Array<{ __typename?: 'UserRole', id: ID['output'], name: String['output'] }> } };

export const ContentContainerFileFragmentFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"ContentContainerFileFragment"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"ContentContainerFile"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"identifier"}},{"kind":"Field","name":{"kind":"Name","value":"fileName"}},{"kind":"Field","name":{"kind":"Name","value":"fileSizeKb"}},{"kind":"Field","name":{"kind":"Name","value":"contentType"}},{"kind":"Field","name":{"kind":"Name","value":"previewUrl"}}]}}]} as unknown as DocumentNode<ContentContainerFileFragmentFragment, unknown>;
export const ContentContainerFragmentFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"ContentContainerFragment"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"ContentContainer"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"identifier"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"content"}},{"kind":"Field","name":{"kind":"Name","value":"files"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"ContentContainerFileFragment"}}]}},{"kind":"Field","name":{"kind":"Name","value":"parent"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"ContentContainerFileFragment"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"ContentContainerFile"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"identifier"}},{"kind":"Field","name":{"kind":"Name","value":"fileName"}},{"kind":"Field","name":{"kind":"Name","value":"fileSizeKb"}},{"kind":"Field","name":{"kind":"Name","value":"contentType"}},{"kind":"Field","name":{"kind":"Name","value":"previewUrl"}}]}}]} as unknown as DocumentNode<ContentContainerFragmentFragment, unknown>;
export const ChannelFragmentFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"ChannelFragment"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"DiscordChannel"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"type"}}]}}]} as unknown as DocumentNode<ChannelFragmentFragment, unknown>;
export const UserFragmentFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"UserFragment"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"User"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"scName"}},{"kind":"Field","name":{"kind":"Name","value":"discordId"}},{"kind":"Field","name":{"kind":"Name","value":"discordName"}},{"kind":"Field","name":{"kind":"Name","value":"discordUsername"}},{"kind":"Field","name":{"kind":"Name","value":"verified"}},{"kind":"Field","name":{"kind":"Name","value":"avatarUrl"}},{"kind":"Field","name":{"kind":"Name","value":"primaryRole"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"roles"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}}]}}]} as unknown as DocumentNode<UserFragmentFragment, unknown>;
export const EventMemberFragmentFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"EventMemberFragment"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"EventMember"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"pending"}},{"kind":"Field","name":{"kind":"Name","value":"user"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"avatarUrl"}}]}},{"kind":"Field","name":{"kind":"Name","value":"rsvp"}},{"kind":"Field","name":{"kind":"Name","value":"rsvpAt"}}]}}]} as unknown as DocumentNode<EventMemberFragmentFragment, unknown>;
export const EventFragmentFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"EventFragment"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Event"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"channel"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"ChannelFragment"}}]}},{"kind":"Field","name":{"kind":"Name","value":"owner"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"UserFragment"}}]}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"summary"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"imageUrl"}},{"kind":"Field","name":{"kind":"Name","value":"eventType"}},{"kind":"Field","name":{"kind":"Name","value":"location"}},{"kind":"Field","name":{"kind":"Name","value":"rsvp"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"pending"}},{"kind":"Field","name":{"kind":"Name","value":"rsvp"}}]}},{"kind":"Field","alias":{"kind":"Name","value":"rsvpRoles"},"name":{"kind":"Name","value":"roles"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"emoji"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"image"}}]}},{"kind":"Field","name":{"kind":"Name","value":"limit"}}]}},{"kind":"Field","name":{"kind":"Name","value":"members"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"EventMemberFragment"}}]}},{"kind":"Field","name":{"kind":"Name","value":"posted"}},{"kind":"Field","name":{"kind":"Name","value":"duration"}},{"kind":"Field","name":{"kind":"Name","value":"startAt"}},{"kind":"Field","name":{"kind":"Name","value":"endedAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"ChannelFragment"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"DiscordChannel"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"type"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"UserFragment"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"User"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"scName"}},{"kind":"Field","name":{"kind":"Name","value":"discordId"}},{"kind":"Field","name":{"kind":"Name","value":"discordName"}},{"kind":"Field","name":{"kind":"Name","value":"discordUsername"}},{"kind":"Field","name":{"kind":"Name","value":"verified"}},{"kind":"Field","name":{"kind":"Name","value":"avatarUrl"}},{"kind":"Field","name":{"kind":"Name","value":"primaryRole"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"roles"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"EventMemberFragment"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"EventMember"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"pending"}},{"kind":"Field","name":{"kind":"Name","value":"user"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"avatarUrl"}}]}},{"kind":"Field","name":{"kind":"Name","value":"rsvp"}},{"kind":"Field","name":{"kind":"Name","value":"rsvpAt"}}]}}]} as unknown as DocumentNode<EventFragmentFragment, unknown>;
export const EventSettingsFragmentFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"EventSettingsFragment"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Event"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"mentions"}},{"kind":"Field","name":{"kind":"Name","value":"settings"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"hideLocation"}},{"kind":"Field","name":{"kind":"Name","value":"inviteOnly"}},{"kind":"Field","name":{"kind":"Name","value":"openToJoinRequests"}},{"kind":"Field","name":{"kind":"Name","value":"allowTeamSwitching"}}]}},{"kind":"Field","name":{"kind":"Name","value":"accessType"}},{"kind":"Field","name":{"kind":"Name","value":"accessRoles"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}}]} as unknown as DocumentNode<EventSettingsFragmentFragment, unknown>;
export const ResourceFragmentFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"ResourceFragment"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Resource"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"owner"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"UserFragment"}}]}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"sizeKb"}},{"kind":"Field","name":{"kind":"Name","value":"shortDescription"}},{"kind":"Field","name":{"kind":"Name","value":"previewUrl"}},{"kind":"Field","name":{"kind":"Name","value":"downloadUrl"}},{"kind":"Field","name":{"kind":"Name","value":"tags"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"UserFragment"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"User"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"scName"}},{"kind":"Field","name":{"kind":"Name","value":"discordId"}},{"kind":"Field","name":{"kind":"Name","value":"discordName"}},{"kind":"Field","name":{"kind":"Name","value":"discordUsername"}},{"kind":"Field","name":{"kind":"Name","value":"verified"}},{"kind":"Field","name":{"kind":"Name","value":"avatarUrl"}},{"kind":"Field","name":{"kind":"Name","value":"primaryRole"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"roles"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}}]}}]} as unknown as DocumentNode<ResourceFragmentFragment, unknown>;
export const RoleFragmentFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"RoleFragment"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"UserRole"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"primary"}},{"kind":"Field","name":{"kind":"Name","value":"discordId"}},{"kind":"Field","name":{"kind":"Name","value":"permissions"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}}]}}]} as unknown as DocumentNode<RoleFragmentFragment, unknown>;
export const CreateAccessKeyDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CreateAccessKey"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","alias":{"kind":"Name","value":"key"},"name":{"kind":"Name","value":"createAccessKey"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"key"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"permissions"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}}]}}]}}]} as unknown as DocumentNode<CreateAccessKeyMutation, CreateAccessKeyMutationVariables>;
export const CreateContentContainerDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CreateContentContainer"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"type"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"identifier"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"parent"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","alias":{"kind":"Name","value":"container"},"name":{"kind":"Name","value":"createContentContainer"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"type"},"value":{"kind":"Variable","name":{"kind":"Name","value":"type"}}},{"kind":"Argument","name":{"kind":"Name","value":"identifier"},"value":{"kind":"Variable","name":{"kind":"Name","value":"identifier"}}},{"kind":"Argument","name":{"kind":"Name","value":"parent"},"value":{"kind":"Variable","name":{"kind":"Name","value":"parent"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"ContentContainerFragment"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"ContentContainerFileFragment"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"ContentContainerFile"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"identifier"}},{"kind":"Field","name":{"kind":"Name","value":"fileName"}},{"kind":"Field","name":{"kind":"Name","value":"fileSizeKb"}},{"kind":"Field","name":{"kind":"Name","value":"contentType"}},{"kind":"Field","name":{"kind":"Name","value":"previewUrl"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"ContentContainerFragment"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"ContentContainer"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"identifier"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"content"}},{"kind":"Field","name":{"kind":"Name","value":"files"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"ContentContainerFileFragment"}}]}},{"kind":"Field","name":{"kind":"Name","value":"parent"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]} as unknown as DocumentNode<CreateContentContainerMutation, CreateContentContainerMutationVariables>;
export const CreateEventDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CreateEvent"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","alias":{"kind":"Name","value":"event"},"name":{"kind":"Name","value":"createEvent"}}]}}]} as unknown as DocumentNode<CreateEventMutation, CreateEventMutationVariables>;
export const CreateResourceDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CreateResource"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"data"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ResourceCreateInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","alias":{"kind":"Name","value":"resource"},"name":{"kind":"Name","value":"createResource"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"data"},"value":{"kind":"Variable","name":{"kind":"Name","value":"data"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"ResourceFragment"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"UserFragment"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"User"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"scName"}},{"kind":"Field","name":{"kind":"Name","value":"discordId"}},{"kind":"Field","name":{"kind":"Name","value":"discordName"}},{"kind":"Field","name":{"kind":"Name","value":"discordUsername"}},{"kind":"Field","name":{"kind":"Name","value":"verified"}},{"kind":"Field","name":{"kind":"Name","value":"avatarUrl"}},{"kind":"Field","name":{"kind":"Name","value":"primaryRole"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"roles"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"ResourceFragment"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Resource"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"owner"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"UserFragment"}}]}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"sizeKb"}},{"kind":"Field","name":{"kind":"Name","value":"shortDescription"}},{"kind":"Field","name":{"kind":"Name","value":"previewUrl"}},{"kind":"Field","name":{"kind":"Name","value":"downloadUrl"}},{"kind":"Field","name":{"kind":"Name","value":"tags"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}}]}}]} as unknown as DocumentNode<CreateResourceMutation, CreateResourceMutationVariables>;
export const CreateRoleDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CreateRole"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","alias":{"kind":"Name","value":"role"},"name":{"kind":"Name","value":"createRole"}}]}}]} as unknown as DocumentNode<CreateRoleMutation, CreateRoleMutationVariables>;
export const DeleteAccessKeyDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"DeleteAccessKey"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","alias":{"kind":"Name","value":"deleted"},"name":{"kind":"Name","value":"deleteAccessKey"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}]}]}}]} as unknown as DocumentNode<DeleteAccessKeyMutation, DeleteAccessKeyMutationVariables>;
export const DeleteContentContainerDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"DeleteContentContainer"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","alias":{"kind":"Name","value":"deleted"},"name":{"kind":"Name","value":"deleteContentContainer"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}]}]}}]} as unknown as DocumentNode<DeleteContentContainerMutation, DeleteContentContainerMutationVariables>;
export const DeleteContentContainerFileDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"DeleteContentContainerFile"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","alias":{"kind":"Name","value":"deleted"},"name":{"kind":"Name","value":"deleteContentContainerFile"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}]}]}}]} as unknown as DocumentNode<DeleteContentContainerFileMutation, DeleteContentContainerFileMutationVariables>;
export const DeleteCurrentUserDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"DeleteCurrentUser"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","alias":{"kind":"Name","value":"deleted"},"name":{"kind":"Name","value":"deleteCurrentUser"}}]}}]} as unknown as DocumentNode<DeleteCurrentUserMutation, DeleteCurrentUserMutationVariables>;
export const DeleteEventDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"DeleteEvent"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","alias":{"kind":"Name","value":"deleted"},"name":{"kind":"Name","value":"deleteEvent"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}]}]}}]} as unknown as DocumentNode<DeleteEventMutation, DeleteEventMutationVariables>;
export const DeleteResourceDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"DeleteResource"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","alias":{"kind":"Name","value":"deleted"},"name":{"kind":"Name","value":"deleteResource"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}]}]}}]} as unknown as DocumentNode<DeleteResourceMutation, DeleteResourceMutationVariables>;
export const DeleteRoleDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"DeleteRole"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"roleId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","alias":{"kind":"Name","value":"deleted"},"name":{"kind":"Name","value":"deleteRole"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"roleId"}}}]}]}}]} as unknown as DocumentNode<DeleteRoleMutation, DeleteRoleMutationVariables>;
export const EditAccessKeyDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"EditAccessKey"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"data"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"AccessKeyEditInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","alias":{"kind":"Name","value":"key"},"name":{"kind":"Name","value":"editAccessKey"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}},{"kind":"Argument","name":{"kind":"Name","value":"data"},"value":{"kind":"Variable","name":{"kind":"Name","value":"data"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"permissions"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}}]}}]}}]} as unknown as DocumentNode<EditAccessKeyMutation, EditAccessKeyMutationVariables>;
export const EditContentContainerDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"EditContentContainer"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"data"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ContentContainerEditInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","alias":{"kind":"Name","value":"container"},"name":{"kind":"Name","value":"editContentContainer"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}},{"kind":"Argument","name":{"kind":"Name","value":"data"},"value":{"kind":"Variable","name":{"kind":"Name","value":"data"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]} as unknown as DocumentNode<EditContentContainerMutation, EditContentContainerMutationVariables>;
export const EditContentContainerFileDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"EditContentContainerFile"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"data"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ContentContainerFileEditInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","alias":{"kind":"Name","value":"file"},"name":{"kind":"Name","value":"editContentContainerFile"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}},{"kind":"Argument","name":{"kind":"Name","value":"data"},"value":{"kind":"Variable","name":{"kind":"Name","value":"data"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]} as unknown as DocumentNode<EditContentContainerFileMutation, EditContentContainerFileMutationVariables>;
export const EditEventDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"EditEvent"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"eventId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"data"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"EventEditInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","alias":{"kind":"Name","value":"event"},"name":{"kind":"Name","value":"editEvent"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"eventId"}}},{"kind":"Argument","name":{"kind":"Name","value":"data"},"value":{"kind":"Variable","name":{"kind":"Name","value":"data"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"EventFragment"}},{"kind":"FragmentSpread","name":{"kind":"Name","value":"EventSettingsFragment"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"ChannelFragment"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"DiscordChannel"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"type"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"UserFragment"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"User"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"scName"}},{"kind":"Field","name":{"kind":"Name","value":"discordId"}},{"kind":"Field","name":{"kind":"Name","value":"discordName"}},{"kind":"Field","name":{"kind":"Name","value":"discordUsername"}},{"kind":"Field","name":{"kind":"Name","value":"verified"}},{"kind":"Field","name":{"kind":"Name","value":"avatarUrl"}},{"kind":"Field","name":{"kind":"Name","value":"primaryRole"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"roles"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"EventMemberFragment"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"EventMember"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"pending"}},{"kind":"Field","name":{"kind":"Name","value":"user"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"avatarUrl"}}]}},{"kind":"Field","name":{"kind":"Name","value":"rsvp"}},{"kind":"Field","name":{"kind":"Name","value":"rsvpAt"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"EventFragment"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Event"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"channel"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"ChannelFragment"}}]}},{"kind":"Field","name":{"kind":"Name","value":"owner"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"UserFragment"}}]}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"summary"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"imageUrl"}},{"kind":"Field","name":{"kind":"Name","value":"eventType"}},{"kind":"Field","name":{"kind":"Name","value":"location"}},{"kind":"Field","name":{"kind":"Name","value":"rsvp"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"pending"}},{"kind":"Field","name":{"kind":"Name","value":"rsvp"}}]}},{"kind":"Field","alias":{"kind":"Name","value":"rsvpRoles"},"name":{"kind":"Name","value":"roles"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"emoji"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"image"}}]}},{"kind":"Field","name":{"kind":"Name","value":"limit"}}]}},{"kind":"Field","name":{"kind":"Name","value":"members"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"EventMemberFragment"}}]}},{"kind":"Field","name":{"kind":"Name","value":"posted"}},{"kind":"Field","name":{"kind":"Name","value":"duration"}},{"kind":"Field","name":{"kind":"Name","value":"startAt"}},{"kind":"Field","name":{"kind":"Name","value":"endedAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"EventSettingsFragment"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Event"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"mentions"}},{"kind":"Field","name":{"kind":"Name","value":"settings"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"hideLocation"}},{"kind":"Field","name":{"kind":"Name","value":"inviteOnly"}},{"kind":"Field","name":{"kind":"Name","value":"openToJoinRequests"}},{"kind":"Field","name":{"kind":"Name","value":"allowTeamSwitching"}}]}},{"kind":"Field","name":{"kind":"Name","value":"accessType"}},{"kind":"Field","name":{"kind":"Name","value":"accessRoles"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}}]} as unknown as DocumentNode<EditEventMutation, EditEventMutationVariables>;
export const EditResourceDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"EditResource"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"data"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ResourceEditInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","alias":{"kind":"Name","value":"resource"},"name":{"kind":"Name","value":"editResource"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}},{"kind":"Argument","name":{"kind":"Name","value":"data"},"value":{"kind":"Variable","name":{"kind":"Name","value":"data"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"ResourceFragment"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"UserFragment"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"User"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"scName"}},{"kind":"Field","name":{"kind":"Name","value":"discordId"}},{"kind":"Field","name":{"kind":"Name","value":"discordName"}},{"kind":"Field","name":{"kind":"Name","value":"discordUsername"}},{"kind":"Field","name":{"kind":"Name","value":"verified"}},{"kind":"Field","name":{"kind":"Name","value":"avatarUrl"}},{"kind":"Field","name":{"kind":"Name","value":"primaryRole"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"roles"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"ResourceFragment"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Resource"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"owner"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"UserFragment"}}]}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"sizeKb"}},{"kind":"Field","name":{"kind":"Name","value":"shortDescription"}},{"kind":"Field","name":{"kind":"Name","value":"previewUrl"}},{"kind":"Field","name":{"kind":"Name","value":"downloadUrl"}},{"kind":"Field","name":{"kind":"Name","value":"tags"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}}]}}]} as unknown as DocumentNode<EditResourceMutation, EditResourceMutationVariables>;
export const EditRoleDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"EditRole"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"roleId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"data"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"RoleEditInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","alias":{"kind":"Name","value":"role"},"name":{"kind":"Name","value":"editRole"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"roleId"}}},{"kind":"Argument","name":{"kind":"Name","value":"data"},"value":{"kind":"Variable","name":{"kind":"Name","value":"data"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"discordId"}},{"kind":"Field","name":{"kind":"Name","value":"primary"}},{"kind":"Field","name":{"kind":"Name","value":"permissions"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}}]}}]}}]} as unknown as DocumentNode<EditRoleMutation, EditRoleMutationVariables>;
export const EditSystemSettingsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"EditSystemSettings"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"data"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"SystemEditInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","alias":{"kind":"Name","value":"settings"},"name":{"kind":"Name","value":"editSystemSettings"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"data"},"value":{"kind":"Variable","name":{"kind":"Name","value":"data"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"discordGuild"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"defaultEventChannel"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"ChannelFragment"}}]}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"ChannelFragment"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"DiscordChannel"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"type"}}]}}]} as unknown as DocumentNode<EditSystemSettingsMutation, EditSystemSettingsMutationVariables>;
export const PostEventDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"PostEvent"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"eventId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","alias":{"kind":"Name","value":"success"},"name":{"kind":"Name","value":"postEvent"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"eventId"}}}]}]}}]} as unknown as DocumentNode<PostEventMutation, PostEventMutationVariables>;
export const RegenerateAccessKeyDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"RegenerateAccessKey"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","alias":{"kind":"Name","value":"key"},"name":{"kind":"Name","value":"regenerateAccessKey"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"key"}}]}}]}}]} as unknown as DocumentNode<RegenerateAccessKeyMutation, RegenerateAccessKeyMutationVariables>;
export const ReorderRolesDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"ReorderRoles"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"order"}},"type":{"kind":"NonNullType","type":{"kind":"ListType","type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","alias":{"kind":"Name","value":"order"},"name":{"kind":"Name","value":"reorderRoles"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"order"},"value":{"kind":"Variable","name":{"kind":"Name","value":"order"}}}]}]}}]} as unknown as DocumentNode<ReorderRolesMutation, ReorderRolesMutationVariables>;
export const RsvpForEventDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"RsvpForEvent"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"eventId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"rsvpId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","alias":{"kind":"Name","value":"success"},"name":{"kind":"Name","value":"rsvpForEvent"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"eventId"}}},{"kind":"Argument","name":{"kind":"Name","value":"rsvp"},"value":{"kind":"Variable","name":{"kind":"Name","value":"rsvpId"}}}]}]}}]} as unknown as DocumentNode<RsvpForEventMutation, RsvpForEventMutationVariables>;
export const UnrsvpForEventDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"UnrsvpForEvent"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"eventId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","alias":{"kind":"Name","value":"success"},"name":{"kind":"Name","value":"unrsvpForEvent"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"eventId"}}}]}]}}]} as unknown as DocumentNode<UnrsvpForEventMutation, UnrsvpForEventMutationVariables>;
export const GetCurrentRsvpsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetCurrentRsvps"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","alias":{"kind":"Name","value":"rsvps"},"name":{"kind":"Name","value":"getCurrentUser"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"rsvps"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"invite"}},{"kind":"Field","name":{"kind":"Name","value":"rsvpAt"}},{"kind":"Field","name":{"kind":"Name","value":"rsvp"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"event"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"owner"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"scName"}},{"kind":"Field","name":{"kind":"Name","value":"avatarUrl"}},{"kind":"Field","name":{"kind":"Name","value":"verified"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}}]}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"summary"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"imageUrl"}},{"kind":"Field","name":{"kind":"Name","value":"eventType"}},{"kind":"Field","name":{"kind":"Name","value":"location"}},{"kind":"Field","name":{"kind":"Name","value":"duration"}},{"kind":"Field","name":{"kind":"Name","value":"startAt"}},{"kind":"Field","name":{"kind":"Name","value":"endedAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}}]}}]}}]}}]}}]} as unknown as DocumentNode<GetCurrentRsvpsQuery, GetCurrentRsvpsQueryVariables>;
export const GetCurrentUserDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetCurrentUser"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","alias":{"kind":"Name","value":"user"},"name":{"kind":"Name","value":"getCurrentUser"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"UserFragment"}},{"kind":"Field","name":{"kind":"Name","value":"permissions"}},{"kind":"Field","name":{"kind":"Name","value":"settings"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}}]}},{"kind":"Field","name":{"kind":"Name","value":"status"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"activity"}},{"kind":"Field","name":{"kind":"Name","value":"ship"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}}]}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"UserFragment"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"User"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"scName"}},{"kind":"Field","name":{"kind":"Name","value":"discordId"}},{"kind":"Field","name":{"kind":"Name","value":"discordName"}},{"kind":"Field","name":{"kind":"Name","value":"discordUsername"}},{"kind":"Field","name":{"kind":"Name","value":"verified"}},{"kind":"Field","name":{"kind":"Name","value":"avatarUrl"}},{"kind":"Field","name":{"kind":"Name","value":"primaryRole"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"roles"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}}]}}]} as unknown as DocumentNode<GetCurrentUserQuery, GetCurrentUserQueryVariables>;
export const GetAllAccessKeysDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetAllAccessKeys"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","alias":{"kind":"Name","value":"keys"},"name":{"kind":"Name","value":"getAllAccessKeys"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"permissions"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}}]}}]}}]} as unknown as DocumentNode<GetAllAccessKeysQuery, GetAllAccessKeysQueryVariables>;
export const GetAllRolesDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetAllRoles"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","alias":{"kind":"Name","value":"roles"},"name":{"kind":"Name","value":"getRoles"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"RoleFragment"}},{"kind":"Field","name":{"kind":"Name","value":"users"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"RoleFragment"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"UserRole"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"primary"}},{"kind":"Field","name":{"kind":"Name","value":"discordId"}},{"kind":"Field","name":{"kind":"Name","value":"permissions"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}}]}}]} as unknown as DocumentNode<GetAllRolesQuery, GetAllRolesQueryVariables>;
export const GetContentContainerDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetContentContainer"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"identifier"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"type"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","alias":{"kind":"Name","value":"container"},"name":{"kind":"Name","value":"getContentContainer"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"identifier"},"value":{"kind":"Variable","name":{"kind":"Name","value":"identifier"}}},{"kind":"Argument","name":{"kind":"Name","value":"type"},"value":{"kind":"Variable","name":{"kind":"Name","value":"type"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"ContentContainerFragment"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"ContentContainerFileFragment"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"ContentContainerFile"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"identifier"}},{"kind":"Field","name":{"kind":"Name","value":"fileName"}},{"kind":"Field","name":{"kind":"Name","value":"fileSizeKb"}},{"kind":"Field","name":{"kind":"Name","value":"contentType"}},{"kind":"Field","name":{"kind":"Name","value":"previewUrl"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"ContentContainerFragment"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"ContentContainer"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"identifier"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"content"}},{"kind":"Field","name":{"kind":"Name","value":"files"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"ContentContainerFileFragment"}}]}},{"kind":"Field","name":{"kind":"Name","value":"parent"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]} as unknown as DocumentNode<GetContentContainerQuery, GetContentContainerQueryVariables>;
export const GetContentContainerByIdDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetContentContainerById"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","alias":{"kind":"Name","value":"container"},"name":{"kind":"Name","value":"getContentContainerById"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"ContentContainerFragment"}},{"kind":"Field","name":{"kind":"Name","value":"recursiveChildren"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"ContentContainerFileFragment"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"ContentContainerFile"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"identifier"}},{"kind":"Field","name":{"kind":"Name","value":"fileName"}},{"kind":"Field","name":{"kind":"Name","value":"fileSizeKb"}},{"kind":"Field","name":{"kind":"Name","value":"contentType"}},{"kind":"Field","name":{"kind":"Name","value":"previewUrl"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"ContentContainerFragment"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"ContentContainer"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"identifier"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"content"}},{"kind":"Field","name":{"kind":"Name","value":"files"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"ContentContainerFileFragment"}}]}},{"kind":"Field","name":{"kind":"Name","value":"parent"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]} as unknown as DocumentNode<GetContentContainerByIdQuery, GetContentContainerByIdQueryVariables>;
export const GetContentContainerWithDescendantsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetContentContainerWithDescendants"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"identifier"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"type"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","alias":{"kind":"Name","value":"container"},"name":{"kind":"Name","value":"getContentContainer"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"identifier"},"value":{"kind":"Variable","name":{"kind":"Name","value":"identifier"}}},{"kind":"Argument","name":{"kind":"Name","value":"type"},"value":{"kind":"Variable","name":{"kind":"Name","value":"type"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"ContentContainerFragment"}},{"kind":"Field","name":{"kind":"Name","value":"recursiveChildren"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"ContentContainerFileFragment"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"ContentContainerFile"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"identifier"}},{"kind":"Field","name":{"kind":"Name","value":"fileName"}},{"kind":"Field","name":{"kind":"Name","value":"fileSizeKb"}},{"kind":"Field","name":{"kind":"Name","value":"contentType"}},{"kind":"Field","name":{"kind":"Name","value":"previewUrl"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"ContentContainerFragment"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"ContentContainer"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"identifier"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"content"}},{"kind":"Field","name":{"kind":"Name","value":"files"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"ContentContainerFileFragment"}}]}},{"kind":"Field","name":{"kind":"Name","value":"parent"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]} as unknown as DocumentNode<GetContentContainerWithDescendantsQuery, GetContentContainerWithDescendantsQueryVariables>;
export const GetContentContainersOfTypeDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetContentContainersOfType"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"type"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","alias":{"kind":"Name","value":"containers"},"name":{"kind":"Name","value":"getContentContainersOfType"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"type"},"value":{"kind":"Variable","name":{"kind":"Name","value":"type"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"ContentContainerFragment"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"ContentContainerFileFragment"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"ContentContainerFile"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"identifier"}},{"kind":"Field","name":{"kind":"Name","value":"fileName"}},{"kind":"Field","name":{"kind":"Name","value":"fileSizeKb"}},{"kind":"Field","name":{"kind":"Name","value":"contentType"}},{"kind":"Field","name":{"kind":"Name","value":"previewUrl"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"ContentContainerFragment"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"ContentContainer"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"identifier"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"content"}},{"kind":"Field","name":{"kind":"Name","value":"files"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"ContentContainerFileFragment"}}]}},{"kind":"Field","name":{"kind":"Name","value":"parent"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]} as unknown as DocumentNode<GetContentContainersOfTypeQuery, GetContentContainersOfTypeQueryVariables>;
export const GetEventDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetEvent"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"eventId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","alias":{"kind":"Name","value":"event"},"name":{"kind":"Name","value":"getEvent"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"eventId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"EventFragment"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"ChannelFragment"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"DiscordChannel"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"type"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"UserFragment"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"User"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"scName"}},{"kind":"Field","name":{"kind":"Name","value":"discordId"}},{"kind":"Field","name":{"kind":"Name","value":"discordName"}},{"kind":"Field","name":{"kind":"Name","value":"discordUsername"}},{"kind":"Field","name":{"kind":"Name","value":"verified"}},{"kind":"Field","name":{"kind":"Name","value":"avatarUrl"}},{"kind":"Field","name":{"kind":"Name","value":"primaryRole"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"roles"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"EventMemberFragment"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"EventMember"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"pending"}},{"kind":"Field","name":{"kind":"Name","value":"user"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"avatarUrl"}}]}},{"kind":"Field","name":{"kind":"Name","value":"rsvp"}},{"kind":"Field","name":{"kind":"Name","value":"rsvpAt"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"EventFragment"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Event"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"channel"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"ChannelFragment"}}]}},{"kind":"Field","name":{"kind":"Name","value":"owner"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"UserFragment"}}]}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"summary"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"imageUrl"}},{"kind":"Field","name":{"kind":"Name","value":"eventType"}},{"kind":"Field","name":{"kind":"Name","value":"location"}},{"kind":"Field","name":{"kind":"Name","value":"rsvp"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"pending"}},{"kind":"Field","name":{"kind":"Name","value":"rsvp"}}]}},{"kind":"Field","alias":{"kind":"Name","value":"rsvpRoles"},"name":{"kind":"Name","value":"roles"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"emoji"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"image"}}]}},{"kind":"Field","name":{"kind":"Name","value":"limit"}}]}},{"kind":"Field","name":{"kind":"Name","value":"members"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"EventMemberFragment"}}]}},{"kind":"Field","name":{"kind":"Name","value":"posted"}},{"kind":"Field","name":{"kind":"Name","value":"duration"}},{"kind":"Field","name":{"kind":"Name","value":"startAt"}},{"kind":"Field","name":{"kind":"Name","value":"endedAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}}]}}]} as unknown as DocumentNode<GetEventQuery, GetEventQueryVariables>;
export const GetEventSettingsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetEventSettings"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"eventId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","alias":{"kind":"Name","value":"event"},"name":{"kind":"Name","value":"getEvent"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"eventId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"EventSettingsFragment"}}]}},{"kind":"Field","alias":{"kind":"Name","value":"eventChannels"},"name":{"kind":"Name","value":"getAllEventChannels"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"ChannelFragment"}}]}},{"kind":"Field","alias":{"kind":"Name","value":"customEmojis"},"name":{"kind":"Name","value":"getAllDiscordEmojis"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"serverName"}},{"kind":"Field","name":{"kind":"Name","value":"serverAvatar"}},{"kind":"Field","name":{"kind":"Name","value":"emojis"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"image"}}]}}]}},{"kind":"Field","alias":{"kind":"Name","value":"discordRoles"},"name":{"kind":"Name","value":"getAllDiscordRoles"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"color"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"EventSettingsFragment"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Event"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"mentions"}},{"kind":"Field","name":{"kind":"Name","value":"settings"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"hideLocation"}},{"kind":"Field","name":{"kind":"Name","value":"inviteOnly"}},{"kind":"Field","name":{"kind":"Name","value":"openToJoinRequests"}},{"kind":"Field","name":{"kind":"Name","value":"allowTeamSwitching"}}]}},{"kind":"Field","name":{"kind":"Name","value":"accessType"}},{"kind":"Field","name":{"kind":"Name","value":"accessRoles"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"ChannelFragment"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"DiscordChannel"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"type"}}]}}]} as unknown as DocumentNode<GetEventSettingsQuery, GetEventSettingsQueryVariables>;
export const GetEventsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetEvents"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"filter"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"EventFilterInput"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"page"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"limit"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","alias":{"kind":"Name","value":"events"},"name":{"kind":"Name","value":"getEvents"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"filter"},"value":{"kind":"Variable","name":{"kind":"Name","value":"filter"}}},{"kind":"Argument","name":{"kind":"Name","value":"page"},"value":{"kind":"Variable","name":{"kind":"Name","value":"page"}}},{"kind":"Argument","name":{"kind":"Name","value":"limit"},"value":{"kind":"Variable","name":{"kind":"Name","value":"limit"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"items"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"EventFragment"}}]}},{"kind":"Field","name":{"kind":"Name","value":"itemsPerPage"}},{"kind":"Field","name":{"kind":"Name","value":"page"}},{"kind":"Field","name":{"kind":"Name","value":"nextPage"}},{"kind":"Field","name":{"kind":"Name","value":"prevPage"}},{"kind":"Field","name":{"kind":"Name","value":"total"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"ChannelFragment"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"DiscordChannel"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"type"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"UserFragment"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"User"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"scName"}},{"kind":"Field","name":{"kind":"Name","value":"discordId"}},{"kind":"Field","name":{"kind":"Name","value":"discordName"}},{"kind":"Field","name":{"kind":"Name","value":"discordUsername"}},{"kind":"Field","name":{"kind":"Name","value":"verified"}},{"kind":"Field","name":{"kind":"Name","value":"avatarUrl"}},{"kind":"Field","name":{"kind":"Name","value":"primaryRole"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"roles"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"EventMemberFragment"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"EventMember"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"pending"}},{"kind":"Field","name":{"kind":"Name","value":"user"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"avatarUrl"}}]}},{"kind":"Field","name":{"kind":"Name","value":"rsvp"}},{"kind":"Field","name":{"kind":"Name","value":"rsvpAt"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"EventFragment"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Event"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"channel"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"ChannelFragment"}}]}},{"kind":"Field","name":{"kind":"Name","value":"owner"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"UserFragment"}}]}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"summary"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"imageUrl"}},{"kind":"Field","name":{"kind":"Name","value":"eventType"}},{"kind":"Field","name":{"kind":"Name","value":"location"}},{"kind":"Field","name":{"kind":"Name","value":"rsvp"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"pending"}},{"kind":"Field","name":{"kind":"Name","value":"rsvp"}}]}},{"kind":"Field","alias":{"kind":"Name","value":"rsvpRoles"},"name":{"kind":"Name","value":"roles"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"emoji"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"image"}}]}},{"kind":"Field","name":{"kind":"Name","value":"limit"}}]}},{"kind":"Field","name":{"kind":"Name","value":"members"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"EventMemberFragment"}}]}},{"kind":"Field","name":{"kind":"Name","value":"posted"}},{"kind":"Field","name":{"kind":"Name","value":"duration"}},{"kind":"Field","name":{"kind":"Name","value":"startAt"}},{"kind":"Field","name":{"kind":"Name","value":"endedAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}}]}}]} as unknown as DocumentNode<GetEventsQuery, GetEventsQueryVariables>;
export const GetOwnedEventsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetOwnedEvents"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","alias":{"kind":"Name","value":"events"},"name":{"kind":"Name","value":"getCurrentUser"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"events"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"EventFragment"}}]}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"ChannelFragment"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"DiscordChannel"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"type"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"UserFragment"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"User"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"scName"}},{"kind":"Field","name":{"kind":"Name","value":"discordId"}},{"kind":"Field","name":{"kind":"Name","value":"discordName"}},{"kind":"Field","name":{"kind":"Name","value":"discordUsername"}},{"kind":"Field","name":{"kind":"Name","value":"verified"}},{"kind":"Field","name":{"kind":"Name","value":"avatarUrl"}},{"kind":"Field","name":{"kind":"Name","value":"primaryRole"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"roles"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"EventMemberFragment"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"EventMember"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"pending"}},{"kind":"Field","name":{"kind":"Name","value":"user"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"avatarUrl"}}]}},{"kind":"Field","name":{"kind":"Name","value":"rsvp"}},{"kind":"Field","name":{"kind":"Name","value":"rsvpAt"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"EventFragment"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Event"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"channel"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"ChannelFragment"}}]}},{"kind":"Field","name":{"kind":"Name","value":"owner"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"UserFragment"}}]}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"summary"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"imageUrl"}},{"kind":"Field","name":{"kind":"Name","value":"eventType"}},{"kind":"Field","name":{"kind":"Name","value":"location"}},{"kind":"Field","name":{"kind":"Name","value":"rsvp"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"pending"}},{"kind":"Field","name":{"kind":"Name","value":"rsvp"}}]}},{"kind":"Field","alias":{"kind":"Name","value":"rsvpRoles"},"name":{"kind":"Name","value":"roles"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"emoji"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"image"}}]}},{"kind":"Field","name":{"kind":"Name","value":"limit"}}]}},{"kind":"Field","name":{"kind":"Name","value":"members"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"EventMemberFragment"}}]}},{"kind":"Field","name":{"kind":"Name","value":"posted"}},{"kind":"Field","name":{"kind":"Name","value":"duration"}},{"kind":"Field","name":{"kind":"Name","value":"startAt"}},{"kind":"Field","name":{"kind":"Name","value":"endedAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}}]}}]} as unknown as DocumentNode<GetOwnedEventsQuery, GetOwnedEventsQueryVariables>;
export const GetResourceDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetResource"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","alias":{"kind":"Name","value":"resource"},"name":{"kind":"Name","value":"getResource"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"ResourceFragment"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"UserFragment"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"User"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"scName"}},{"kind":"Field","name":{"kind":"Name","value":"discordId"}},{"kind":"Field","name":{"kind":"Name","value":"discordName"}},{"kind":"Field","name":{"kind":"Name","value":"discordUsername"}},{"kind":"Field","name":{"kind":"Name","value":"verified"}},{"kind":"Field","name":{"kind":"Name","value":"avatarUrl"}},{"kind":"Field","name":{"kind":"Name","value":"primaryRole"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"roles"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"ResourceFragment"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Resource"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"owner"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"UserFragment"}}]}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"sizeKb"}},{"kind":"Field","name":{"kind":"Name","value":"shortDescription"}},{"kind":"Field","name":{"kind":"Name","value":"previewUrl"}},{"kind":"Field","name":{"kind":"Name","value":"downloadUrl"}},{"kind":"Field","name":{"kind":"Name","value":"tags"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}}]}}]} as unknown as DocumentNode<GetResourceQuery, GetResourceQueryVariables>;
export const GetResourcesDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetResources"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"filter"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"ResourceFilterInput"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"page"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"limit"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","alias":{"kind":"Name","value":"resources"},"name":{"kind":"Name","value":"getResources"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"filter"},"value":{"kind":"Variable","name":{"kind":"Name","value":"filter"}}},{"kind":"Argument","name":{"kind":"Name","value":"page"},"value":{"kind":"Variable","name":{"kind":"Name","value":"page"}}},{"kind":"Argument","name":{"kind":"Name","value":"limit"},"value":{"kind":"Variable","name":{"kind":"Name","value":"limit"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"items"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"ResourceFragment"}}]}},{"kind":"Field","name":{"kind":"Name","value":"itemsPerPage"}},{"kind":"Field","name":{"kind":"Name","value":"page"}},{"kind":"Field","name":{"kind":"Name","value":"nextPage"}},{"kind":"Field","name":{"kind":"Name","value":"prevPage"}},{"kind":"Field","name":{"kind":"Name","value":"total"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"UserFragment"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"User"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"scName"}},{"kind":"Field","name":{"kind":"Name","value":"discordId"}},{"kind":"Field","name":{"kind":"Name","value":"discordName"}},{"kind":"Field","name":{"kind":"Name","value":"discordUsername"}},{"kind":"Field","name":{"kind":"Name","value":"verified"}},{"kind":"Field","name":{"kind":"Name","value":"avatarUrl"}},{"kind":"Field","name":{"kind":"Name","value":"primaryRole"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"roles"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"ResourceFragment"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Resource"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"owner"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"UserFragment"}}]}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"sizeKb"}},{"kind":"Field","name":{"kind":"Name","value":"shortDescription"}},{"kind":"Field","name":{"kind":"Name","value":"previewUrl"}},{"kind":"Field","name":{"kind":"Name","value":"downloadUrl"}},{"kind":"Field","name":{"kind":"Name","value":"tags"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}}]}}]} as unknown as DocumentNode<GetResourcesQuery, GetResourcesQueryVariables>;
export const GetRoleDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetRole"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"roleId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","alias":{"kind":"Name","value":"role"},"name":{"kind":"Name","value":"getRole"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"roleId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"discordId"}},{"kind":"Field","name":{"kind":"Name","value":"primary"}},{"kind":"Field","name":{"kind":"Name","value":"permissions"}},{"kind":"Field","name":{"kind":"Name","value":"users"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"avatarUrl"}}]}}]}},{"kind":"Field","alias":{"kind":"Name","value":"discordRoles"},"name":{"kind":"Name","value":"getAllDiscordRoles"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"everyone"},"value":{"kind":"BooleanValue","value":false}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"color"}}]}}]}}]} as unknown as DocumentNode<GetRoleQuery, GetRoleQueryVariables>;
export const GetSystemSettingsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetSystemSettings"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","alias":{"kind":"Name","value":"settings"},"name":{"kind":"Name","value":"getSystemSettings"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"discordGuild"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"defaultEventChannel"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"ChannelFragment"}}]}}]}},{"kind":"Field","alias":{"kind":"Name","value":"eventChannels"},"name":{"kind":"Name","value":"getAllEventChannels"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"ChannelFragment"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"ChannelFragment"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"DiscordChannel"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"type"}}]}}]} as unknown as DocumentNode<GetSystemSettingsQuery, GetSystemSettingsQueryVariables>;
export const GetUserDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetUser"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","alias":{"kind":"Name","value":"user"},"name":{"kind":"Name","value":"getUser"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"UserFragment"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"UserFragment"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"User"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"scName"}},{"kind":"Field","name":{"kind":"Name","value":"discordId"}},{"kind":"Field","name":{"kind":"Name","value":"discordName"}},{"kind":"Field","name":{"kind":"Name","value":"discordUsername"}},{"kind":"Field","name":{"kind":"Name","value":"verified"}},{"kind":"Field","name":{"kind":"Name","value":"avatarUrl"}},{"kind":"Field","name":{"kind":"Name","value":"primaryRole"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"roles"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}}]}}]} as unknown as DocumentNode<GetUserQuery, GetUserQueryVariables>;
export const OnRolesUpdatedDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"subscription","name":{"kind":"Name","value":"OnRolesUpdated"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"userId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","alias":{"kind":"Name","value":"roles"},"name":{"kind":"Name","value":"userRolesUpdated"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"userId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"userId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"permissions"}},{"kind":"Field","name":{"kind":"Name","value":"primaryRole"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"roles"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}}]}}]} as unknown as DocumentNode<OnRolesUpdatedSubscription, OnRolesUpdatedSubscriptionVariables>;