import type { ID } from '@frcn/graphql-scalar-types/server';
import type { String } from '@frcn/graphql-scalar-types/server';
import type { Boolean } from '@frcn/graphql-scalar-types/server';
import type { Int } from '@frcn/graphql-scalar-types/server';
import type { Object } from '@frcn/graphql-scalar-types/server';
import type { Timestamp } from '@frcn/graphql-scalar-types/server';
import type { GraphQLResolveInfo, GraphQLScalarType, GraphQLScalarTypeConfig } from 'graphql';
import type { GQLContext } from '../context';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
export type RequireFields<T, K extends keyof T> = Omit<T, K> & { [P in K]-?: NonNullable<T[P]> };
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
  channel?: Maybe<EventChannel>;
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

export type EventChannel = {
  __typename?: 'EventChannel';
  discordId: Scalars['String']['output'];
  events: Array<Event>;
  id: Scalars['Int']['output'];
  name: Scalars['String']['output'];
  type?: Maybe<Scalars['String']['output']>;
};

export type EventChannelEditInput = {
  channelId?: InputMaybe<Scalars['ID']['input']>;
};

export type EventEditInput = {
  accessRoles?: InputMaybe<Array<Scalars['ID']['input']>>;
  accessType?: InputMaybe<EventAccessType>;
  channel?: InputMaybe<Scalars['Int']['input']>;
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
  createEventChannel: EventChannel;
  createEventTeam: EventTeam;
  createResource: Resource;
  createRole: Scalars['ID']['output'];
  deleteAccessKey: Scalars['Boolean']['output'];
  deleteContentContainer: Scalars['Boolean']['output'];
  deleteContentContainerFile: Scalars['Boolean']['output'];
  deleteCurrentUser: Scalars['Boolean']['output'];
  deleteEvent: Scalars['Boolean']['output'];
  deleteEventChannel: Scalars['Boolean']['output'];
  deleteEventTeam: Scalars['Boolean']['output'];
  deleteResource: Scalars['Boolean']['output'];
  deleteRole: Scalars['Boolean']['output'];
  editAccessKey?: Maybe<AccessKey>;
  editContentContainer?: Maybe<ContentContainer>;
  editContentContainerFile?: Maybe<ContentContainerFile>;
  editEvent?: Maybe<Event>;
  editEventChannel?: Maybe<EventChannel>;
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


export type MutationCreateEventChannelArgs = {
  linkTo: Scalars['ID']['input'];
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


export type MutationDeleteEventChannelArgs = {
  id: Scalars['Int']['input'];
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


export type MutationEditEventChannelArgs = {
  data: EventChannelEditInput;
  id: Scalars['Int']['input'];
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
  getAllEventChannels: Array<EventChannel>;
  getAllUsers: Array<User>;
  getContentContainer?: Maybe<ContentContainer>;
  getContentContainerById?: Maybe<ContentContainer>;
  getContentContainersOfType: Array<ContentContainer>;
  getCurrentAccessKey?: Maybe<AccessKey>;
  getCurrentUser?: Maybe<User>;
  getEvent?: Maybe<Event>;
  getEventChannel?: Maybe<EventChannel>;
  getEvents?: Maybe<PagedEvent>;
  getResource?: Maybe<Resource>;
  getResources?: Maybe<PagedResource>;
  getRole?: Maybe<UserRole>;
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


export type QueryGetEventChannelArgs = {
  id: Scalars['Int']['input'];
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
  defaultEventChannelId?: InputMaybe<Scalars['Int']['input']>;
  discordGuildId?: InputMaybe<Scalars['ID']['input']>;
};

export type SystemSettings = {
  __typename?: 'SystemSettings';
  defaultEventChannel?: Maybe<EventChannel>;
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
  default: Scalars['Boolean']['output'];
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

export type WithIndex<TObject> = TObject & Record<string, any>;
export type ResolversObject<TObject> = WithIndex<TObject>;

export type ResolverTypeWrapper<T> = Promise<T> | T;


export type ResolverWithResolve<TResult, TParent, TContext, TArgs> = {
  resolve: ResolverFn<TResult, TParent, TContext, TArgs>;
};
export type Resolver<TResult, TParent = {}, TContext = {}, TArgs = {}> = ResolverFn<TResult, TParent, TContext, TArgs> | ResolverWithResolve<TResult, TParent, TContext, TArgs>;

export type ResolverFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => Promise<TResult> | TResult;

export type SubscriptionSubscribeFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => AsyncIterable<TResult> | Promise<AsyncIterable<TResult>>;

export type SubscriptionResolveFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => TResult | Promise<TResult>;

export interface SubscriptionSubscriberObject<TResult, TKey extends string, TParent, TContext, TArgs> {
  subscribe: SubscriptionSubscribeFn<{ [key in TKey]: TResult }, TParent, TContext, TArgs>;
  resolve?: SubscriptionResolveFn<TResult, { [key in TKey]: TResult }, TContext, TArgs>;
}

export interface SubscriptionResolverObject<TResult, TParent, TContext, TArgs> {
  subscribe: SubscriptionSubscribeFn<any, TParent, TContext, TArgs>;
  resolve: SubscriptionResolveFn<TResult, any, TContext, TArgs>;
}

export type SubscriptionObject<TResult, TKey extends string, TParent, TContext, TArgs> =
  | SubscriptionSubscriberObject<TResult, TKey, TParent, TContext, TArgs>
  | SubscriptionResolverObject<TResult, TParent, TContext, TArgs>;

export type SubscriptionResolver<TResult, TKey extends string, TParent = {}, TContext = {}, TArgs = {}> =
  | ((...args: any[]) => SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>)
  | SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>;

export type TypeResolveFn<TTypes, TParent = {}, TContext = {}> = (
  parent: TParent,
  context: TContext,
  info: GraphQLResolveInfo
) => Maybe<TTypes> | Promise<Maybe<TTypes>>;

export type IsTypeOfResolverFn<T = {}, TContext = {}> = (obj: T, context: TContext, info: GraphQLResolveInfo) => boolean | Promise<boolean>;

export type NextResolverFn<T> = () => Promise<T>;

export type DirectiveResolverFn<TResult = {}, TParent = {}, TContext = {}, TArgs = {}> = (
  next: NextResolverFn<TResult>,
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => TResult | Promise<TResult>;



/** Mapping between all available schema types and the resolvers types */
export type ResolversTypes = ResolversObject<{
  AccessKey: ResolverTypeWrapper<AccessKey>;
  AccessKeyEditInput: AccessKeyEditInput;
  Boolean: ResolverTypeWrapper<Scalars['Boolean']['output']>;
  CacheControlScope: CacheControlScope;
  ContentContainer: ResolverTypeWrapper<ContentContainer>;
  ContentContainerEditInput: ContentContainerEditInput;
  ContentContainerFile: ResolverTypeWrapper<ContentContainerFile>;
  ContentContainerFileEditInput: ContentContainerFileEditInput;
  DiscordChannel: ResolverTypeWrapper<DiscordChannel>;
  DiscordEmoji: ResolverTypeWrapper<DiscordEmoji>;
  DiscordEmojis: ResolverTypeWrapper<DiscordEmojis>;
  DiscordGuild: ResolverTypeWrapper<DiscordGuild>;
  DiscordRole: ResolverTypeWrapper<DiscordRole>;
  Event: ResolverTypeWrapper<Event>;
  EventAccessType: EventAccessType;
  EventChannel: ResolverTypeWrapper<EventChannel>;
  EventChannelEditInput: EventChannelEditInput;
  EventEditInput: EventEditInput;
  EventFilterInput: EventFilterInput;
  EventMember: ResolverTypeWrapper<EventMember>;
  EventRoleInput: EventRoleInput;
  EventRsvp: ResolverTypeWrapper<EventRsvp>;
  EventRsvpRole: ResolverTypeWrapper<EventRsvpRole>;
  EventSettings: ResolverTypeWrapper<EventSettings>;
  EventSettingsInput: EventSettingsInput;
  EventTeam: ResolverTypeWrapper<EventTeam>;
  EventTeamCreateInput: EventTeamCreateInput;
  EventTeamEditInput: EventTeamEditInput;
  ID: ResolverTypeWrapper<Scalars['ID']['output']>;
  Int: ResolverTypeWrapper<Scalars['Int']['output']>;
  Mutation: ResolverTypeWrapper<{}>;
  Object: ResolverTypeWrapper<Scalars['Object']['output']>;
  PagedEvent: ResolverTypeWrapper<PagedEvent>;
  PagedResource: ResolverTypeWrapper<PagedResource>;
  Permission: Permission;
  Query: ResolverTypeWrapper<{}>;
  Resource: ResolverTypeWrapper<Resource>;
  ResourceCreateInput: ResourceCreateInput;
  ResourceEditInput: ResourceEditInput;
  ResourceFilterInput: ResourceFilterInput;
  RoleEditInput: RoleEditInput;
  String: ResolverTypeWrapper<Scalars['String']['output']>;
  Subscription: ResolverTypeWrapper<{}>;
  SystemEditInput: SystemEditInput;
  SystemSettings: ResolverTypeWrapper<SystemSettings>;
  Timestamp: ResolverTypeWrapper<Scalars['Timestamp']['output']>;
  UpdatedUserRoles: ResolverTypeWrapper<UpdatedUserRoles>;
  User: ResolverTypeWrapper<User>;
  UserRole: ResolverTypeWrapper<UserRole>;
  UserSettings: ResolverTypeWrapper<UserSettings>;
  UserStatus: ResolverTypeWrapper<UserStatus>;
  UserStatusEditInput: UserStatusEditInput;
}>;

/** Mapping between all available schema types and the resolvers parents */
export type ResolversParentTypes = ResolversObject<{
  AccessKey: AccessKey;
  AccessKeyEditInput: AccessKeyEditInput;
  Boolean: Scalars['Boolean']['output'];
  ContentContainer: ContentContainer;
  ContentContainerEditInput: ContentContainerEditInput;
  ContentContainerFile: ContentContainerFile;
  ContentContainerFileEditInput: ContentContainerFileEditInput;
  DiscordChannel: DiscordChannel;
  DiscordEmoji: DiscordEmoji;
  DiscordEmojis: DiscordEmojis;
  DiscordGuild: DiscordGuild;
  DiscordRole: DiscordRole;
  Event: Event;
  EventChannel: EventChannel;
  EventChannelEditInput: EventChannelEditInput;
  EventEditInput: EventEditInput;
  EventFilterInput: EventFilterInput;
  EventMember: EventMember;
  EventRoleInput: EventRoleInput;
  EventRsvp: EventRsvp;
  EventRsvpRole: EventRsvpRole;
  EventSettings: EventSettings;
  EventSettingsInput: EventSettingsInput;
  EventTeam: EventTeam;
  EventTeamCreateInput: EventTeamCreateInput;
  EventTeamEditInput: EventTeamEditInput;
  ID: Scalars['ID']['output'];
  Int: Scalars['Int']['output'];
  Mutation: {};
  Object: Scalars['Object']['output'];
  PagedEvent: PagedEvent;
  PagedResource: PagedResource;
  Query: {};
  Resource: Resource;
  ResourceCreateInput: ResourceCreateInput;
  ResourceEditInput: ResourceEditInput;
  ResourceFilterInput: ResourceFilterInput;
  RoleEditInput: RoleEditInput;
  String: Scalars['String']['output'];
  Subscription: {};
  SystemEditInput: SystemEditInput;
  SystemSettings: SystemSettings;
  Timestamp: Scalars['Timestamp']['output'];
  UpdatedUserRoles: UpdatedUserRoles;
  User: User;
  UserRole: UserRole;
  UserSettings: UserSettings;
  UserStatus: UserStatus;
  UserStatusEditInput: UserStatusEditInput;
}>;

export type CacheControlDirectiveArgs = {
  inheritMaxAge?: Maybe<Scalars['Boolean']['input']>;
  maxAge?: Maybe<Scalars['Int']['input']>;
  scope?: Maybe<CacheControlScope>;
};

export type CacheControlDirectiveResolver<Result, Parent, ContextType = GQLContext, Args = CacheControlDirectiveArgs> = DirectiveResolverFn<Result, Parent, ContextType, Args>;

export type OwnershipDirectiveArgs = { };

export type OwnershipDirectiveResolver<Result, Parent, ContextType = GQLContext, Args = OwnershipDirectiveArgs> = DirectiveResolverFn<Result, Parent, ContextType, Args>;

export type PermissionDirectiveArgs = {
  all?: Maybe<Array<Permission>>;
  has?: Maybe<Permission>;
  one?: Maybe<Array<Permission>>;
};

export type PermissionDirectiveResolver<Result, Parent, ContextType = GQLContext, Args = PermissionDirectiveArgs> = DirectiveResolverFn<Result, Parent, ContextType, Args>;

export type AccessKeyResolvers<ContextType = GQLContext, ParentType extends ResolversParentTypes['AccessKey'] = ResolversParentTypes['AccessKey']> = ResolversObject<{
  createdAt?: Resolver<ResolversTypes['Timestamp'], ParentType, ContextType>;
  description?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  key?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  permissions?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  updatedAt?: Resolver<ResolversTypes['Timestamp'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type ContentContainerResolvers<ContextType = GQLContext, ParentType extends ResolversParentTypes['ContentContainer'] = ResolversParentTypes['ContentContainer']> = ResolversObject<{
  children?: Resolver<Array<ResolversTypes['ContentContainer']>, ParentType, ContextType>;
  content?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  files?: Resolver<Array<ResolversTypes['ContentContainerFile']>, ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  identifier?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  parent?: Resolver<Maybe<ResolversTypes['ContentContainer']>, ParentType, ContextType>;
  recursiveChildren?: Resolver<Array<ResolversTypes['Object']>, ParentType, ContextType>;
  title?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  type?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type ContentContainerFileResolvers<ContextType = GQLContext, ParentType extends ResolversParentTypes['ContentContainerFile'] = ResolversParentTypes['ContentContainerFile']> = ResolversObject<{
  contentType?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  fileName?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  fileSizeKb?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  identifier?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  previewUrl?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type DiscordChannelResolvers<ContextType = GQLContext, ParentType extends ResolversParentTypes['DiscordChannel'] = ResolversParentTypes['DiscordChannel']> = ResolversObject<{
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  type?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type DiscordEmojiResolvers<ContextType = GQLContext, ParentType extends ResolversParentTypes['DiscordEmoji'] = ResolversParentTypes['DiscordEmoji']> = ResolversObject<{
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  image?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type DiscordEmojisResolvers<ContextType = GQLContext, ParentType extends ResolversParentTypes['DiscordEmojis'] = ResolversParentTypes['DiscordEmojis']> = ResolversObject<{
  emojis?: Resolver<Array<ResolversTypes['DiscordEmoji']>, ParentType, ContextType>;
  serverAvatar?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  serverName?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type DiscordGuildResolvers<ContextType = GQLContext, ParentType extends ResolversParentTypes['DiscordGuild'] = ResolversParentTypes['DiscordGuild']> = ResolversObject<{
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type DiscordRoleResolvers<ContextType = GQLContext, ParentType extends ResolversParentTypes['DiscordRole'] = ResolversParentTypes['DiscordRole']> = ResolversObject<{
  color?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type EventResolvers<ContextType = GQLContext, ParentType extends ResolversParentTypes['Event'] = ResolversParentTypes['Event']> = ResolversObject<{
  accessRoles?: Resolver<Array<ResolversTypes['UserRole']>, ParentType, ContextType>;
  accessType?: Resolver<ResolversTypes['EventAccessType'], ParentType, ContextType>;
  channel?: Resolver<Maybe<ResolversTypes['EventChannel']>, ParentType, ContextType>;
  createdAt?: Resolver<ResolversTypes['Timestamp'], ParentType, ContextType>;
  description?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  duration?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  endedAt?: Resolver<Maybe<ResolversTypes['Timestamp']>, ParentType, ContextType>;
  eventType?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  imageUrl?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  location?: Resolver<Maybe<Array<ResolversTypes['String']>>, ParentType, ContextType>;
  members?: Resolver<Array<ResolversTypes['EventMember']>, ParentType, ContextType>;
  mentions?: Resolver<Array<ResolversTypes['ID']>, ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  owner?: Resolver<Maybe<ResolversTypes['User']>, ParentType, ContextType>;
  posted?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  roles?: Resolver<Array<ResolversTypes['EventRsvpRole']>, ParentType, ContextType>;
  rsvp?: Resolver<Maybe<ResolversTypes['EventMember']>, ParentType, ContextType>;
  settings?: Resolver<ResolversTypes['EventSettings'], ParentType, ContextType>;
  startAt?: Resolver<Maybe<ResolversTypes['Timestamp']>, ParentType, ContextType>;
  summary?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  teams?: Resolver<Array<ResolversTypes['EventTeam']>, ParentType, ContextType>;
  updatedAt?: Resolver<ResolversTypes['Timestamp'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type EventChannelResolvers<ContextType = GQLContext, ParentType extends ResolversParentTypes['EventChannel'] = ResolversParentTypes['EventChannel']> = ResolversObject<{
  discordId?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  events?: Resolver<Array<ResolversTypes['Event']>, ParentType, ContextType>;
  id?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  type?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type EventMemberResolvers<ContextType = GQLContext, ParentType extends ResolversParentTypes['EventMember'] = ResolversParentTypes['EventMember']> = ResolversObject<{
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  pending?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  rsvp?: Resolver<Maybe<ResolversTypes['ID']>, ParentType, ContextType>;
  rsvpAt?: Resolver<ResolversTypes['Timestamp'], ParentType, ContextType>;
  user?: Resolver<ResolversTypes['User'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type EventRsvpResolvers<ContextType = GQLContext, ParentType extends ResolversParentTypes['EventRsvp'] = ResolversParentTypes['EventRsvp']> = ResolversObject<{
  event?: Resolver<ResolversTypes['Event'], ParentType, ContextType>;
  invite?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  rsvp?: Resolver<Maybe<ResolversTypes['EventRsvpRole']>, ParentType, ContextType>;
  rsvpAt?: Resolver<ResolversTypes['Timestamp'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type EventRsvpRoleResolvers<ContextType = GQLContext, ParentType extends ResolversParentTypes['EventRsvpRole'] = ResolversParentTypes['EventRsvpRole']> = ResolversObject<{
  emoji?: Resolver<ResolversTypes['DiscordEmoji'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  limit?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  members?: Resolver<Array<ResolversTypes['ID']>, ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type EventSettingsResolvers<ContextType = GQLContext, ParentType extends ResolversParentTypes['EventSettings'] = ResolversParentTypes['EventSettings']> = ResolversObject<{
  allowTeamSwitching?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  hideLocation?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  inviteOnly?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  openToJoinRequests?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type EventTeamResolvers<ContextType = GQLContext, ParentType extends ResolversParentTypes['EventTeam'] = ResolversParentTypes['EventTeam']> = ResolversObject<{
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  members?: Resolver<Array<ResolversTypes['EventMember']>, ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type MutationResolvers<ContextType = GQLContext, ParentType extends ResolversParentTypes['Mutation'] = ResolversParentTypes['Mutation']> = ResolversObject<{
  createAccessKey?: Resolver<ResolversTypes['AccessKey'], ParentType, ContextType>;
  createContentContainer?: Resolver<ResolversTypes['ContentContainer'], ParentType, ContextType, RequireFields<MutationCreateContentContainerArgs, 'type'>>;
  createEvent?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  createEventChannel?: Resolver<ResolversTypes['EventChannel'], ParentType, ContextType, RequireFields<MutationCreateEventChannelArgs, 'linkTo'>>;
  createEventTeam?: Resolver<ResolversTypes['EventTeam'], ParentType, ContextType, RequireFields<MutationCreateEventTeamArgs, 'data' | 'id'>>;
  createResource?: Resolver<ResolversTypes['Resource'], ParentType, ContextType, RequireFields<MutationCreateResourceArgs, 'data'>>;
  createRole?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  deleteAccessKey?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType, RequireFields<MutationDeleteAccessKeyArgs, 'id'>>;
  deleteContentContainer?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType, RequireFields<MutationDeleteContentContainerArgs, 'id'>>;
  deleteContentContainerFile?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType, RequireFields<MutationDeleteContentContainerFileArgs, 'id'>>;
  deleteCurrentUser?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  deleteEvent?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType, RequireFields<MutationDeleteEventArgs, 'id'>>;
  deleteEventChannel?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType, RequireFields<MutationDeleteEventChannelArgs, 'id'>>;
  deleteEventTeam?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType, RequireFields<MutationDeleteEventTeamArgs, 'id' | 'team'>>;
  deleteResource?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType, RequireFields<MutationDeleteResourceArgs, 'id'>>;
  deleteRole?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType, RequireFields<MutationDeleteRoleArgs, 'id'>>;
  editAccessKey?: Resolver<Maybe<ResolversTypes['AccessKey']>, ParentType, ContextType, RequireFields<MutationEditAccessKeyArgs, 'data' | 'id'>>;
  editContentContainer?: Resolver<Maybe<ResolversTypes['ContentContainer']>, ParentType, ContextType, RequireFields<MutationEditContentContainerArgs, 'data' | 'id'>>;
  editContentContainerFile?: Resolver<Maybe<ResolversTypes['ContentContainerFile']>, ParentType, ContextType, RequireFields<MutationEditContentContainerFileArgs, 'data' | 'id'>>;
  editEvent?: Resolver<Maybe<ResolversTypes['Event']>, ParentType, ContextType, RequireFields<MutationEditEventArgs, 'data' | 'id'>>;
  editEventChannel?: Resolver<Maybe<ResolversTypes['EventChannel']>, ParentType, ContextType, RequireFields<MutationEditEventChannelArgs, 'data' | 'id'>>;
  editEventTeam?: Resolver<ResolversTypes['EventTeam'], ParentType, ContextType, RequireFields<MutationEditEventTeamArgs, 'data' | 'id'>>;
  editResource?: Resolver<Maybe<ResolversTypes['Resource']>, ParentType, ContextType, RequireFields<MutationEditResourceArgs, 'data' | 'id'>>;
  editRole?: Resolver<Maybe<ResolversTypes['UserRole']>, ParentType, ContextType, RequireFields<MutationEditRoleArgs, 'data' | 'id'>>;
  editSystemSettings?: Resolver<ResolversTypes['SystemSettings'], ParentType, ContextType, RequireFields<MutationEditSystemSettingsArgs, 'data'>>;
  editUserStatus?: Resolver<ResolversTypes['UserStatus'], ParentType, ContextType, RequireFields<MutationEditUserStatusArgs, 'data'>>;
  giveUserRole?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType, RequireFields<MutationGiveUserRoleArgs, 'roleId' | 'userId'>>;
  kickEventMember?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType, RequireFields<MutationKickEventMemberArgs, 'id' | 'member'>>;
  postEvent?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType, RequireFields<MutationPostEventArgs, 'id'>>;
  regenerateAccessKey?: Resolver<Maybe<ResolversTypes['AccessKey']>, ParentType, ContextType, RequireFields<MutationRegenerateAccessKeyArgs, 'id'>>;
  removeUserRole?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType, RequireFields<MutationRemoveUserRoleArgs, 'roleId' | 'userId'>>;
  reorderContentContainerChildren?: Resolver<Maybe<ResolversTypes['ContentContainer']>, ParentType, ContextType, RequireFields<MutationReorderContentContainerChildrenArgs, 'id' | 'order'>>;
  reorderContentContainerFiles?: Resolver<Maybe<ResolversTypes['ContentContainer']>, ParentType, ContextType, RequireFields<MutationReorderContentContainerFilesArgs, 'id' | 'order'>>;
  reorderRoles?: Resolver<Array<ResolversTypes['ID']>, ParentType, ContextType, RequireFields<MutationReorderRolesArgs, 'order'>>;
  rsvpForEvent?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType, RequireFields<MutationRsvpForEventArgs, 'id' | 'rsvp'>>;
  setEventMemberTeam?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType, RequireFields<MutationSetEventMemberTeamArgs, 'id' | 'member'>>;
  setUserScName?: Resolver<ResolversTypes['User'], ParentType, ContextType, RequireFields<MutationSetUserScNameArgs, 'name'>>;
  syncRole?: Resolver<Maybe<ResolversTypes['UserRole']>, ParentType, ContextType, RequireFields<MutationSyncRoleArgs, 'id'>>;
  unrsvpForEvent?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType, RequireFields<MutationUnrsvpForEventArgs, 'id'>>;
  verifyUserScName?: Resolver<ResolversTypes['User'], ParentType, ContextType, RequireFields<MutationVerifyUserScNameArgs, 'code'>>;
}>;

export interface ObjectScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['Object'], any> {
  name: 'Object';
}

export type PagedEventResolvers<ContextType = GQLContext, ParentType extends ResolversParentTypes['PagedEvent'] = ResolversParentTypes['PagedEvent']> = ResolversObject<{
  items?: Resolver<Array<ResolversTypes['Event']>, ParentType, ContextType>;
  itemsPerPage?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  nextPage?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  page?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  prevPage?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  total?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type PagedResourceResolvers<ContextType = GQLContext, ParentType extends ResolversParentTypes['PagedResource'] = ResolversParentTypes['PagedResource']> = ResolversObject<{
  items?: Resolver<Array<ResolversTypes['Resource']>, ParentType, ContextType>;
  itemsPerPage?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  nextPage?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  page?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  prevPage?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  total?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type QueryResolvers<ContextType = GQLContext, ParentType extends ResolversParentTypes['Query'] = ResolversParentTypes['Query']> = ResolversObject<{
  getAccessKey?: Resolver<Maybe<ResolversTypes['AccessKey']>, ParentType, ContextType, RequireFields<QueryGetAccessKeyArgs, 'id'>>;
  getAllAccessKeys?: Resolver<Array<ResolversTypes['AccessKey']>, ParentType, ContextType>;
  getAllDiscordChannels?: Resolver<Array<ResolversTypes['DiscordChannel']>, ParentType, ContextType>;
  getAllDiscordEmojis?: Resolver<ResolversTypes['DiscordEmojis'], ParentType, ContextType>;
  getAllDiscordRoles?: Resolver<Array<ResolversTypes['DiscordRole']>, ParentType, ContextType, Partial<QueryGetAllDiscordRolesArgs>>;
  getAllEventChannels?: Resolver<Array<ResolversTypes['EventChannel']>, ParentType, ContextType>;
  getAllUsers?: Resolver<Array<ResolversTypes['User']>, ParentType, ContextType>;
  getContentContainer?: Resolver<Maybe<ResolversTypes['ContentContainer']>, ParentType, ContextType, RequireFields<QueryGetContentContainerArgs, 'identifier' | 'type'>>;
  getContentContainerById?: Resolver<Maybe<ResolversTypes['ContentContainer']>, ParentType, ContextType, RequireFields<QueryGetContentContainerByIdArgs, 'id'>>;
  getContentContainersOfType?: Resolver<Array<ResolversTypes['ContentContainer']>, ParentType, ContextType, RequireFields<QueryGetContentContainersOfTypeArgs, 'type'>>;
  getCurrentAccessKey?: Resolver<Maybe<ResolversTypes['AccessKey']>, ParentType, ContextType>;
  getCurrentUser?: Resolver<Maybe<ResolversTypes['User']>, ParentType, ContextType>;
  getEvent?: Resolver<Maybe<ResolversTypes['Event']>, ParentType, ContextType, RequireFields<QueryGetEventArgs, 'id'>>;
  getEventChannel?: Resolver<Maybe<ResolversTypes['EventChannel']>, ParentType, ContextType, RequireFields<QueryGetEventChannelArgs, 'id'>>;
  getEvents?: Resolver<Maybe<ResolversTypes['PagedEvent']>, ParentType, ContextType, Partial<QueryGetEventsArgs>>;
  getResource?: Resolver<Maybe<ResolversTypes['Resource']>, ParentType, ContextType, RequireFields<QueryGetResourceArgs, 'id'>>;
  getResources?: Resolver<Maybe<ResolversTypes['PagedResource']>, ParentType, ContextType, Partial<QueryGetResourcesArgs>>;
  getRole?: Resolver<Maybe<ResolversTypes['UserRole']>, ParentType, ContextType, RequireFields<QueryGetRoleArgs, 'id'>>;
  getRoles?: Resolver<Array<ResolversTypes['UserRole']>, ParentType, ContextType>;
  getSystemSettings?: Resolver<ResolversTypes['SystemSettings'], ParentType, ContextType>;
  getUser?: Resolver<Maybe<ResolversTypes['User']>, ParentType, ContextType, RequireFields<QueryGetUserArgs, 'id'>>;
  getUserScVerifyCode?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
}>;

export type ResourceResolvers<ContextType = GQLContext, ParentType extends ResolversParentTypes['Resource'] = ResolversParentTypes['Resource']> = ResolversObject<{
  createdAt?: Resolver<ResolversTypes['Timestamp'], ParentType, ContextType>;
  downloadUrl?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  owner?: Resolver<Maybe<ResolversTypes['User']>, ParentType, ContextType>;
  previewUrl?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  shortDescription?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  sizeKb?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  tags?: Resolver<Array<ResolversTypes['String']>, ParentType, ContextType>;
  updatedAt?: Resolver<ResolversTypes['Timestamp'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type SubscriptionResolvers<ContextType = GQLContext, ParentType extends ResolversParentTypes['Subscription'] = ResolversParentTypes['Subscription']> = ResolversObject<{
  userRolesUpdated?: SubscriptionResolver<ResolversTypes['UpdatedUserRoles'], "userRolesUpdated", ParentType, ContextType, RequireFields<SubscriptionUserRolesUpdatedArgs, 'userId'>>;
}>;

export type SystemSettingsResolvers<ContextType = GQLContext, ParentType extends ResolversParentTypes['SystemSettings'] = ResolversParentTypes['SystemSettings']> = ResolversObject<{
  defaultEventChannel?: Resolver<Maybe<ResolversTypes['EventChannel']>, ParentType, ContextType>;
  discordGuild?: Resolver<ResolversTypes['DiscordGuild'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export interface TimestampScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['Timestamp'], any> {
  name: 'Timestamp';
}

export type UpdatedUserRolesResolvers<ContextType = GQLContext, ParentType extends ResolversParentTypes['UpdatedUserRoles'] = ResolversParentTypes['UpdatedUserRoles']> = ResolversObject<{
  permissions?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  primaryRole?: Resolver<ResolversTypes['UserRole'], ParentType, ContextType>;
  roles?: Resolver<Array<ResolversTypes['UserRole']>, ParentType, ContextType>;
  userId?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type UserResolvers<ContextType = GQLContext, ParentType extends ResolversParentTypes['User'] = ResolversParentTypes['User']> = ResolversObject<{
  avatarUrl?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  createdAt?: Resolver<ResolversTypes['Timestamp'], ParentType, ContextType>;
  discordId?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  discordName?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  discordUsername?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  events?: Resolver<Array<ResolversTypes['Event']>, ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  permissions?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  primaryRole?: Resolver<ResolversTypes['UserRole'], ParentType, ContextType>;
  roles?: Resolver<Array<ResolversTypes['UserRole']>, ParentType, ContextType>;
  rsvps?: Resolver<Array<ResolversTypes['EventRsvp']>, ParentType, ContextType>;
  scName?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  settings?: Resolver<ResolversTypes['UserSettings'], ParentType, ContextType>;
  status?: Resolver<ResolversTypes['UserStatus'], ParentType, ContextType>;
  updatedAt?: Resolver<ResolversTypes['Timestamp'], ParentType, ContextType>;
  verified?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type UserRoleResolvers<ContextType = GQLContext, ParentType extends ResolversParentTypes['UserRole'] = ResolversParentTypes['UserRole']> = ResolversObject<{
  createdAt?: Resolver<ResolversTypes['Timestamp'], ParentType, ContextType>;
  default?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  discordId?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  permissions?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  primary?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  updatedAt?: Resolver<ResolversTypes['Timestamp'], ParentType, ContextType>;
  users?: Resolver<Array<ResolversTypes['User']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type UserSettingsResolvers<ContextType = GQLContext, ParentType extends ResolversParentTypes['UserSettings'] = ResolversParentTypes['UserSettings']> = ResolversObject<{
  updatedAt?: Resolver<ResolversTypes['Timestamp'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type UserStatusResolvers<ContextType = GQLContext, ParentType extends ResolversParentTypes['UserStatus'] = ResolversParentTypes['UserStatus']> = ResolversObject<{
  activity?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  ship?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  updatedAt?: Resolver<ResolversTypes['Timestamp'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type Resolvers<ContextType = GQLContext> = ResolversObject<{
  AccessKey?: AccessKeyResolvers<ContextType>;
  ContentContainer?: ContentContainerResolvers<ContextType>;
  ContentContainerFile?: ContentContainerFileResolvers<ContextType>;
  DiscordChannel?: DiscordChannelResolvers<ContextType>;
  DiscordEmoji?: DiscordEmojiResolvers<ContextType>;
  DiscordEmojis?: DiscordEmojisResolvers<ContextType>;
  DiscordGuild?: DiscordGuildResolvers<ContextType>;
  DiscordRole?: DiscordRoleResolvers<ContextType>;
  Event?: EventResolvers<ContextType>;
  EventChannel?: EventChannelResolvers<ContextType>;
  EventMember?: EventMemberResolvers<ContextType>;
  EventRsvp?: EventRsvpResolvers<ContextType>;
  EventRsvpRole?: EventRsvpRoleResolvers<ContextType>;
  EventSettings?: EventSettingsResolvers<ContextType>;
  EventTeam?: EventTeamResolvers<ContextType>;
  Mutation?: MutationResolvers<ContextType>;
  Object?: GraphQLScalarType;
  PagedEvent?: PagedEventResolvers<ContextType>;
  PagedResource?: PagedResourceResolvers<ContextType>;
  Query?: QueryResolvers<ContextType>;
  Resource?: ResourceResolvers<ContextType>;
  Subscription?: SubscriptionResolvers<ContextType>;
  SystemSettings?: SystemSettingsResolvers<ContextType>;
  Timestamp?: GraphQLScalarType;
  UpdatedUserRoles?: UpdatedUserRolesResolvers<ContextType>;
  User?: UserResolvers<ContextType>;
  UserRole?: UserRoleResolvers<ContextType>;
  UserSettings?: UserSettingsResolvers<ContextType>;
  UserStatus?: UserStatusResolvers<ContextType>;
}>;

export type DirectiveResolvers<ContextType = GQLContext> = ResolversObject<{
  cacheControl?: CacheControlDirectiveResolver<any, any, ContextType>;
  ownership?: OwnershipDirectiveResolver<any, any, ContextType>;
  permission?: PermissionDirectiveResolver<any, any, ContextType>;
}>;
