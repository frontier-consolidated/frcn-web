import type { ID } from '@frcn/graphql-scalar-types/server';
import type { String } from '@frcn/graphql-scalar-types/server';
import type { Boolean } from '@frcn/graphql-scalar-types/server';
import type { Int } from '@frcn/graphql-scalar-types/server';
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

export type DiscordEmojis = {
  __typename?: 'DiscordEmojis';
  emojis: Array<DiscordEmoji>;
  serverAvatar?: Maybe<Scalars['String']['output']>;
  serverName: Scalars['String']['output'];
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
  createEvent: Scalars['ID']['output'];
  createEventTeam: EventTeam;
  createResource: Resource;
  createRole: Scalars['ID']['output'];
  deleteEvent: Scalars['Boolean']['output'];
  deleteEventTeam: Scalars['Boolean']['output'];
  deleteResource: Scalars['Boolean']['output'];
  deleteRole: Scalars['Boolean']['output'];
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
  removeUserRole: Scalars['Boolean']['output'];
  reorderRoles: Array<Scalars['ID']['output']>;
  rsvpForEvent: Scalars['Boolean']['output'];
  setEventMemberTeam: Scalars['Boolean']['output'];
  setUserScName: User;
  syncRole?: Maybe<UserRole>;
  unrsvpForEvent: Scalars['Boolean']['output'];
  verifyUserScName: User;
};


export type MutationCreateEventTeamArgs = {
  data: EventTeamCreateInput;
  id: Scalars['ID']['input'];
};


export type MutationCreateResourceArgs = {
  data: ResourceCreateInput;
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


export type MutationRemoveUserRoleArgs = {
  roleId: Scalars['ID']['input'];
  userId: Scalars['ID']['input'];
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
  CreateEvents = 'CreateEvents',
  ManageRoles = 'ManageRoles',
  ManageSystem = 'ManageSystem',
  Unassigned2 = 'Unassigned2',
  Unassigned3 = 'Unassigned3',
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
  getAllDiscordChannels: Array<DiscordChannel>;
  getAllDiscordEmojis: DiscordEmojis;
  getAllDiscordRoles: Array<DiscordRole>;
  getAllEventChannels: Array<Maybe<DiscordChannel>>;
  getCurrentUser?: Maybe<User>;
  getEvent?: Maybe<Event>;
  getEvents?: Maybe<PagedEvent>;
  getResources?: Maybe<PagedResource>;
  getRole?: Maybe<UserRole>;
  getRoleOrder: Array<Scalars['ID']['output']>;
  getRoles: Array<UserRole>;
  getSystemSettings: SystemSettings;
  getUser?: Maybe<User>;
  getUserScVerifyCode?: Maybe<Scalars['String']['output']>;
};


export type QueryGetAllDiscordRolesArgs = {
  everyone?: InputMaybe<Scalars['Boolean']['input']>;
};


export type QueryGetEventArgs = {
  id: Scalars['ID']['input'];
};


export type QueryGetEventsArgs = {
  filter?: InputMaybe<EventFilterInput>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  page?: InputMaybe<Scalars['Int']['input']>;
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
  discordGuildId?: InputMaybe<Scalars['ID']['input']>;
};

export type SystemSettings = {
  __typename?: 'SystemSettings';
  defaultEventChannel?: Maybe<DiscordChannel>;
  discordGuildId: Scalars['String']['output'];
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
  discordName: Scalars['String']['output'];
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
  Boolean: ResolverTypeWrapper<Scalars['Boolean']['output']>;
  CacheControlScope: CacheControlScope;
  DiscordChannel: ResolverTypeWrapper<DiscordChannel>;
  DiscordEmoji: ResolverTypeWrapper<DiscordEmoji>;
  DiscordEmojis: ResolverTypeWrapper<DiscordEmojis>;
  DiscordRole: ResolverTypeWrapper<DiscordRole>;
  Event: ResolverTypeWrapper<Event>;
  EventAccessType: EventAccessType;
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
  Boolean: Scalars['Boolean']['output'];
  DiscordChannel: DiscordChannel;
  DiscordEmoji: DiscordEmoji;
  DiscordEmojis: DiscordEmojis;
  DiscordRole: DiscordRole;
  Event: Event;
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

export type DiscordRoleResolvers<ContextType = GQLContext, ParentType extends ResolversParentTypes['DiscordRole'] = ResolversParentTypes['DiscordRole']> = ResolversObject<{
  color?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type EventResolvers<ContextType = GQLContext, ParentType extends ResolversParentTypes['Event'] = ResolversParentTypes['Event']> = ResolversObject<{
  accessRoles?: Resolver<Array<ResolversTypes['UserRole']>, ParentType, ContextType>;
  accessType?: Resolver<ResolversTypes['EventAccessType'], ParentType, ContextType>;
  channel?: Resolver<ResolversTypes['DiscordChannel'], ParentType, ContextType>;
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
  createEvent?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  createEventTeam?: Resolver<ResolversTypes['EventTeam'], ParentType, ContextType, RequireFields<MutationCreateEventTeamArgs, 'data' | 'id'>>;
  createResource?: Resolver<ResolversTypes['Resource'], ParentType, ContextType, RequireFields<MutationCreateResourceArgs, 'data'>>;
  createRole?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  deleteEvent?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType, RequireFields<MutationDeleteEventArgs, 'id'>>;
  deleteEventTeam?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType, RequireFields<MutationDeleteEventTeamArgs, 'id' | 'team'>>;
  deleteResource?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType, RequireFields<MutationDeleteResourceArgs, 'id'>>;
  deleteRole?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType, RequireFields<MutationDeleteRoleArgs, 'id'>>;
  editEvent?: Resolver<Maybe<ResolversTypes['Event']>, ParentType, ContextType, RequireFields<MutationEditEventArgs, 'data' | 'id'>>;
  editEventChannels?: Resolver<Array<ResolversTypes['DiscordChannel']>, ParentType, ContextType, RequireFields<MutationEditEventChannelsArgs, 'channels'>>;
  editEventTeam?: Resolver<ResolversTypes['EventTeam'], ParentType, ContextType, RequireFields<MutationEditEventTeamArgs, 'data' | 'id'>>;
  editResource?: Resolver<Maybe<ResolversTypes['Resource']>, ParentType, ContextType, RequireFields<MutationEditResourceArgs, 'data' | 'id'>>;
  editRole?: Resolver<Maybe<ResolversTypes['UserRole']>, ParentType, ContextType, RequireFields<MutationEditRoleArgs, 'data' | 'id'>>;
  editSystemSettings?: Resolver<ResolversTypes['SystemSettings'], ParentType, ContextType, RequireFields<MutationEditSystemSettingsArgs, 'data'>>;
  editUserStatus?: Resolver<ResolversTypes['UserStatus'], ParentType, ContextType, RequireFields<MutationEditUserStatusArgs, 'data'>>;
  giveUserRole?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType, RequireFields<MutationGiveUserRoleArgs, 'roleId' | 'userId'>>;
  kickEventMember?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType, RequireFields<MutationKickEventMemberArgs, 'id' | 'member'>>;
  postEvent?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType, RequireFields<MutationPostEventArgs, 'id'>>;
  removeUserRole?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType, RequireFields<MutationRemoveUserRoleArgs, 'roleId' | 'userId'>>;
  reorderRoles?: Resolver<Array<ResolversTypes['ID']>, ParentType, ContextType, RequireFields<MutationReorderRolesArgs, 'order'>>;
  rsvpForEvent?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType, RequireFields<MutationRsvpForEventArgs, 'id' | 'rsvp'>>;
  setEventMemberTeam?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType, RequireFields<MutationSetEventMemberTeamArgs, 'id' | 'member'>>;
  setUserScName?: Resolver<ResolversTypes['User'], ParentType, ContextType, RequireFields<MutationSetUserScNameArgs, 'name'>>;
  syncRole?: Resolver<Maybe<ResolversTypes['UserRole']>, ParentType, ContextType, RequireFields<MutationSyncRoleArgs, 'id'>>;
  unrsvpForEvent?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType, RequireFields<MutationUnrsvpForEventArgs, 'id'>>;
  verifyUserScName?: Resolver<ResolversTypes['User'], ParentType, ContextType, RequireFields<MutationVerifyUserScNameArgs, 'code'>>;
}>;

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
  getAllDiscordChannels?: Resolver<Array<ResolversTypes['DiscordChannel']>, ParentType, ContextType>;
  getAllDiscordEmojis?: Resolver<ResolversTypes['DiscordEmojis'], ParentType, ContextType>;
  getAllDiscordRoles?: Resolver<Array<ResolversTypes['DiscordRole']>, ParentType, ContextType, Partial<QueryGetAllDiscordRolesArgs>>;
  getAllEventChannels?: Resolver<Array<Maybe<ResolversTypes['DiscordChannel']>>, ParentType, ContextType>;
  getCurrentUser?: Resolver<Maybe<ResolversTypes['User']>, ParentType, ContextType>;
  getEvent?: Resolver<Maybe<ResolversTypes['Event']>, ParentType, ContextType, RequireFields<QueryGetEventArgs, 'id'>>;
  getEvents?: Resolver<Maybe<ResolversTypes['PagedEvent']>, ParentType, ContextType, Partial<QueryGetEventsArgs>>;
  getResources?: Resolver<Maybe<ResolversTypes['PagedResource']>, ParentType, ContextType, Partial<QueryGetResourcesArgs>>;
  getRole?: Resolver<Maybe<ResolversTypes['UserRole']>, ParentType, ContextType, RequireFields<QueryGetRoleArgs, 'id'>>;
  getRoleOrder?: Resolver<Array<ResolversTypes['ID']>, ParentType, ContextType>;
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
  defaultEventChannel?: Resolver<Maybe<ResolversTypes['DiscordChannel']>, ParentType, ContextType>;
  discordGuildId?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
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
  discordName?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
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
  DiscordChannel?: DiscordChannelResolvers<ContextType>;
  DiscordEmoji?: DiscordEmojiResolvers<ContextType>;
  DiscordEmojis?: DiscordEmojisResolvers<ContextType>;
  DiscordRole?: DiscordRoleResolvers<ContextType>;
  Event?: EventResolvers<ContextType>;
  EventMember?: EventMemberResolvers<ContextType>;
  EventRsvp?: EventRsvpResolvers<ContextType>;
  EventRsvpRole?: EventRsvpRoleResolvers<ContextType>;
  EventSettings?: EventSettingsResolvers<ContextType>;
  EventTeam?: EventTeamResolvers<ContextType>;
  Mutation?: MutationResolvers<ContextType>;
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
