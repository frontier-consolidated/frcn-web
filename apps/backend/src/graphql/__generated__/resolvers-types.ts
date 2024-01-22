import { ID } from '@frcn/graphql-scalar-types';
import { String } from '@frcn/graphql-scalar-types';
import { Boolean } from '@frcn/graphql-scalar-types';
import { Int } from '@frcn/graphql-scalar-types';
import { Date } from '@frcn/graphql-scalar-types';
import { GraphQLResolveInfo, GraphQLScalarType, GraphQLScalarTypeConfig } from 'graphql';
import { Context } from '../context';
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

export type Event = EventBase & {
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
  imageUrl?: Maybe<Scalars['String']['output']>;
  location: Array<Scalars['String']['output']>;
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

export type EventBase = {
  channel: DiscordChannel;
  createdAt: Scalars['Date']['output'];
  description: Scalars['String']['output'];
  duration?: Maybe<Scalars['Int']['output']>;
  endedAt?: Maybe<Scalars['Date']['output']>;
  eventType?: Maybe<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  imageUrl?: Maybe<Scalars['String']['output']>;
  location: Array<Scalars['String']['output']>;
  name: Scalars['String']['output'];
  owner?: Maybe<PartialUser>;
  startAt?: Maybe<Scalars['Date']['output']>;
  summary: Scalars['String']['output'];
  updatedAt: Scalars['Date']['output'];
};

export type EventEditInput = {
  channel: Scalars['ID']['input'];
  description: Scalars['String']['input'];
  duration: Scalars['Int']['input'];
  eventType: Scalars['String']['input'];
  imageUrl: Scalars['String']['input'];
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

export type EventRsvpRole = EventRsvpRoleBase & {
  __typename?: 'EventRsvpRole';
  id: Scalars['ID']['output'];
  limit: Scalars['Int']['output'];
  members: Array<Scalars['Int']['output']>;
  name: Scalars['String']['output'];
};

export type EventRsvpRoleBase = {
  id: Scalars['ID']['output'];
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

export type PartialEvent = EventBase & {
  __typename?: 'PartialEvent';
  channel: DiscordChannel;
  createdAt: Scalars['Date']['output'];
  description: Scalars['String']['output'];
  duration?: Maybe<Scalars['Int']['output']>;
  endedAt?: Maybe<Scalars['Date']['output']>;
  eventType?: Maybe<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  imageUrl?: Maybe<Scalars['String']['output']>;
  location: Array<Scalars['String']['output']>;
  name: Scalars['String']['output'];
  owner?: Maybe<PartialUser>;
  startAt?: Maybe<Scalars['Date']['output']>;
  summary: Scalars['String']['output'];
  updatedAt: Scalars['Date']['output'];
};

export type PartialEventRsvpRole = EventRsvpRoleBase & {
  __typename?: 'PartialEventRsvpRole';
  id: Scalars['ID']['output'];
  name: Scalars['String']['output'];
};

export type PartialUser = UserBase & {
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

export type User = UserBase & {
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

export type UserBase = {
  avatarUrl: Scalars['String']['output'];
  createdAt: Scalars['Date']['output'];
  discordName: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  name: Scalars['String']['output'];
  scName?: Maybe<Scalars['String']['output']>;
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


/** Mapping of interface types */
export type ResolversInterfaceTypes<RefType extends Record<string, unknown>> = ResolversObject<{
  EventBase: ( Event ) | ( PartialEvent );
  EventRsvpRoleBase: ( EventRsvpRole ) | ( PartialEventRsvpRole );
  UserBase: ( PartialUser ) | ( User );
}>;

/** Mapping between all available schema types and the resolvers types */
export type ResolversTypes = ResolversObject<{
  Boolean: ResolverTypeWrapper<Scalars['Boolean']['output']>;
  CacheControlScope: CacheControlScope;
  Date: ResolverTypeWrapper<Scalars['Date']['output']>;
  DiscordChannel: ResolverTypeWrapper<DiscordChannel>;
  Event: ResolverTypeWrapper<Event>;
  EventAccessType: EventAccessType;
  EventBase: ResolverTypeWrapper<ResolversInterfaceTypes<ResolversTypes>['EventBase']>;
  EventEditInput: EventEditInput;
  EventFilterInput: EventFilterInput;
  EventMember: ResolverTypeWrapper<EventMember>;
  EventRoleInput: EventRoleInput;
  EventRsvp: ResolverTypeWrapper<EventRsvp>;
  EventRsvpRole: ResolverTypeWrapper<EventRsvpRole>;
  EventRsvpRoleBase: ResolverTypeWrapper<ResolversInterfaceTypes<ResolversTypes>['EventRsvpRoleBase']>;
  EventSettings: ResolverTypeWrapper<EventSettings>;
  EventSettingsInput: EventSettingsInput;
  ID: ResolverTypeWrapper<Scalars['ID']['output']>;
  Int: ResolverTypeWrapper<Scalars['Int']['output']>;
  Mutation: ResolverTypeWrapper<{}>;
  PagedEvent: ResolverTypeWrapper<PagedEvent>;
  PartialEvent: ResolverTypeWrapper<PartialEvent>;
  PartialEventRsvpRole: ResolverTypeWrapper<PartialEventRsvpRole>;
  PartialUser: ResolverTypeWrapper<PartialUser>;
  Permission: Permission;
  Query: ResolverTypeWrapper<{}>;
  String: ResolverTypeWrapper<Scalars['String']['output']>;
  SystemEditInput: SystemEditInput;
  SystemSettings: ResolverTypeWrapper<SystemSettings>;
  User: ResolverTypeWrapper<User>;
  UserBase: ResolverTypeWrapper<ResolversInterfaceTypes<ResolversTypes>['UserBase']>;
  UserRole: ResolverTypeWrapper<UserRole>;
  UserSettings: ResolverTypeWrapper<UserSettings>;
  UserStatus: ResolverTypeWrapper<UserStatus>;
  UserStatusEditInput: UserStatusEditInput;
}>;

/** Mapping between all available schema types and the resolvers parents */
export type ResolversParentTypes = ResolversObject<{
  Boolean: Scalars['Boolean']['output'];
  Date: Scalars['Date']['output'];
  DiscordChannel: DiscordChannel;
  Event: Event;
  EventBase: ResolversInterfaceTypes<ResolversParentTypes>['EventBase'];
  EventEditInput: EventEditInput;
  EventFilterInput: EventFilterInput;
  EventMember: EventMember;
  EventRoleInput: EventRoleInput;
  EventRsvp: EventRsvp;
  EventRsvpRole: EventRsvpRole;
  EventRsvpRoleBase: ResolversInterfaceTypes<ResolversParentTypes>['EventRsvpRoleBase'];
  EventSettings: EventSettings;
  EventSettingsInput: EventSettingsInput;
  ID: Scalars['ID']['output'];
  Int: Scalars['Int']['output'];
  Mutation: {};
  PagedEvent: PagedEvent;
  PartialEvent: PartialEvent;
  PartialEventRsvpRole: PartialEventRsvpRole;
  PartialUser: PartialUser;
  Query: {};
  String: Scalars['String']['output'];
  SystemEditInput: SystemEditInput;
  SystemSettings: SystemSettings;
  User: User;
  UserBase: ResolversInterfaceTypes<ResolversParentTypes>['UserBase'];
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

export type CacheControlDirectiveResolver<Result, Parent, ContextType = Context, Args = CacheControlDirectiveArgs> = DirectiveResolverFn<Result, Parent, ContextType, Args>;

export type ManagesDirectiveArgs = { };

export type ManagesDirectiveResolver<Result, Parent, ContextType = Context, Args = ManagesDirectiveArgs> = DirectiveResolverFn<Result, Parent, ContextType, Args>;

export type PermissionDirectiveArgs = {
  name: Permission;
};

export type PermissionDirectiveResolver<Result, Parent, ContextType = Context, Args = PermissionDirectiveArgs> = DirectiveResolverFn<Result, Parent, ContextType, Args>;

export type PrivateDirectiveArgs = { };

export type PrivateDirectiveResolver<Result, Parent, ContextType = Context, Args = PrivateDirectiveArgs> = DirectiveResolverFn<Result, Parent, ContextType, Args>;

export interface DateScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['Date'], any> {
  name: 'Date';
}

export type DiscordChannelResolvers<ContextType = Context, ParentType extends ResolversParentTypes['DiscordChannel'] = ResolversParentTypes['DiscordChannel']> = ResolversObject<{
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  type?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type EventResolvers<ContextType = Context, ParentType extends ResolversParentTypes['Event'] = ResolversParentTypes['Event']> = ResolversObject<{
  accessRoles?: Resolver<Array<ResolversTypes['UserRole']>, ParentType, ContextType>;
  accessType?: Resolver<ResolversTypes['EventAccessType'], ParentType, ContextType>;
  channel?: Resolver<ResolversTypes['DiscordChannel'], ParentType, ContextType>;
  createdAt?: Resolver<ResolversTypes['Date'], ParentType, ContextType>;
  description?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  duration?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  endedAt?: Resolver<Maybe<ResolversTypes['Date']>, ParentType, ContextType>;
  eventType?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  imageUrl?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  location?: Resolver<Array<ResolversTypes['String']>, ParentType, ContextType>;
  members?: Resolver<Array<ResolversTypes['EventMember']>, ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  owner?: Resolver<Maybe<ResolversTypes['PartialUser']>, ParentType, ContextType>;
  posted?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  roles?: Resolver<Array<ResolversTypes['EventRsvpRole']>, ParentType, ContextType>;
  settings?: Resolver<ResolversTypes['EventSettings'], ParentType, ContextType>;
  startAt?: Resolver<Maybe<ResolversTypes['Date']>, ParentType, ContextType>;
  summary?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  updatedAt?: Resolver<ResolversTypes['Date'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type EventBaseResolvers<ContextType = Context, ParentType extends ResolversParentTypes['EventBase'] = ResolversParentTypes['EventBase']> = ResolversObject<{
  __resolveType: TypeResolveFn<'Event' | 'PartialEvent', ParentType, ContextType>;
  channel?: Resolver<ResolversTypes['DiscordChannel'], ParentType, ContextType>;
  createdAt?: Resolver<ResolversTypes['Date'], ParentType, ContextType>;
  description?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  duration?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  endedAt?: Resolver<Maybe<ResolversTypes['Date']>, ParentType, ContextType>;
  eventType?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  imageUrl?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  location?: Resolver<Array<ResolversTypes['String']>, ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  owner?: Resolver<Maybe<ResolversTypes['PartialUser']>, ParentType, ContextType>;
  startAt?: Resolver<Maybe<ResolversTypes['Date']>, ParentType, ContextType>;
  summary?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  updatedAt?: Resolver<ResolversTypes['Date'], ParentType, ContextType>;
}>;

export type EventMemberResolvers<ContextType = Context, ParentType extends ResolversParentTypes['EventMember'] = ResolversParentTypes['EventMember']> = ResolversObject<{
  id?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  pending?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  rsvp?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  rsvpAt?: Resolver<ResolversTypes['Date'], ParentType, ContextType>;
  user?: Resolver<ResolversTypes['PartialUser'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type EventRsvpResolvers<ContextType = Context, ParentType extends ResolversParentTypes['EventRsvp'] = ResolversParentTypes['EventRsvp']> = ResolversObject<{
  event?: Resolver<ResolversTypes['PartialEvent'], ParentType, ContextType>;
  invite?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  rsvp?: Resolver<Maybe<ResolversTypes['PartialEventRsvpRole']>, ParentType, ContextType>;
  rsvpAt?: Resolver<ResolversTypes['Date'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type EventRsvpRoleResolvers<ContextType = Context, ParentType extends ResolversParentTypes['EventRsvpRole'] = ResolversParentTypes['EventRsvpRole']> = ResolversObject<{
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  limit?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  members?: Resolver<Array<ResolversTypes['Int']>, ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type EventRsvpRoleBaseResolvers<ContextType = Context, ParentType extends ResolversParentTypes['EventRsvpRoleBase'] = ResolversParentTypes['EventRsvpRoleBase']> = ResolversObject<{
  __resolveType: TypeResolveFn<'EventRsvpRole' | 'PartialEventRsvpRole', ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
}>;

export type EventSettingsResolvers<ContextType = Context, ParentType extends ResolversParentTypes['EventSettings'] = ResolversParentTypes['EventSettings']> = ResolversObject<{
  allowCrewSwitching?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  allowTeamSwitching?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  hideLocation?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  inviteOnly?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  openToJoinRequests?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type MutationResolvers<ContextType = Context, ParentType extends ResolversParentTypes['Mutation'] = ResolversParentTypes['Mutation']> = ResolversObject<{
  createEvent?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  editEvent?: Resolver<ResolversTypes['Event'], ParentType, ContextType, RequireFields<MutationEditEventArgs, 'data' | 'id'>>;
  editEventChannels?: Resolver<Array<ResolversTypes['DiscordChannel']>, ParentType, ContextType, RequireFields<MutationEditEventChannelsArgs, 'channels'>>;
  editSystem?: Resolver<ResolversTypes['SystemSettings'], ParentType, ContextType, RequireFields<MutationEditSystemArgs, 'data'>>;
  editUserStatus?: Resolver<ResolversTypes['UserStatus'], ParentType, ContextType, RequireFields<MutationEditUserStatusArgs, 'data'>>;
  postEvent?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType, RequireFields<MutationPostEventArgs, 'id'>>;
  reorderRoles?: Resolver<ResolversTypes['SystemSettings'], ParentType, ContextType, RequireFields<MutationReorderRolesArgs, 'order'>>;
  setUserScName?: Resolver<ResolversTypes['User'], ParentType, ContextType, RequireFields<MutationSetUserScNameArgs, 'name'>>;
  verifyUserScName?: Resolver<ResolversTypes['User'], ParentType, ContextType, RequireFields<MutationVerifyUserScNameArgs, 'code'>>;
}>;

export type PagedEventResolvers<ContextType = Context, ParentType extends ResolversParentTypes['PagedEvent'] = ResolversParentTypes['PagedEvent']> = ResolversObject<{
  items?: Resolver<Array<ResolversTypes['Event']>, ParentType, ContextType>;
  nextPage?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  page?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  total?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type PartialEventResolvers<ContextType = Context, ParentType extends ResolversParentTypes['PartialEvent'] = ResolversParentTypes['PartialEvent']> = ResolversObject<{
  channel?: Resolver<ResolversTypes['DiscordChannel'], ParentType, ContextType>;
  createdAt?: Resolver<ResolversTypes['Date'], ParentType, ContextType>;
  description?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  duration?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  endedAt?: Resolver<Maybe<ResolversTypes['Date']>, ParentType, ContextType>;
  eventType?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  imageUrl?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  location?: Resolver<Array<ResolversTypes['String']>, ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  owner?: Resolver<Maybe<ResolversTypes['PartialUser']>, ParentType, ContextType>;
  startAt?: Resolver<Maybe<ResolversTypes['Date']>, ParentType, ContextType>;
  summary?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  updatedAt?: Resolver<ResolversTypes['Date'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type PartialEventRsvpRoleResolvers<ContextType = Context, ParentType extends ResolversParentTypes['PartialEventRsvpRole'] = ResolversParentTypes['PartialEventRsvpRole']> = ResolversObject<{
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type PartialUserResolvers<ContextType = Context, ParentType extends ResolversParentTypes['PartialUser'] = ResolversParentTypes['PartialUser']> = ResolversObject<{
  avatarUrl?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  createdAt?: Resolver<ResolversTypes['Date'], ParentType, ContextType>;
  discordName?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  scName?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  updatedAt?: Resolver<ResolversTypes['Date'], ParentType, ContextType>;
  verified?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type QueryResolvers<ContextType = Context, ParentType extends ResolversParentTypes['Query'] = ResolversParentTypes['Query']> = ResolversObject<{
  getAllDiscordChannels?: Resolver<Array<ResolversTypes['DiscordChannel']>, ParentType, ContextType>;
  getAllEventChannels?: Resolver<Array<ResolversTypes['DiscordChannel']>, ParentType, ContextType>;
  getAllRoles?: Resolver<Array<ResolversTypes['UserRole']>, ParentType, ContextType>;
  getCurrentUser?: Resolver<Maybe<ResolversTypes['User']>, ParentType, ContextType>;
  getEvent?: Resolver<Maybe<ResolversTypes['Event']>, ParentType, ContextType, RequireFields<QueryGetEventArgs, 'id'>>;
  getEvents?: Resolver<Maybe<ResolversTypes['PagedEvent']>, ParentType, ContextType, Partial<QueryGetEventsArgs>>;
  getPrimaryRoles?: Resolver<Array<ResolversTypes['UserRole']>, ParentType, ContextType>;
  getSystemSettings?: Resolver<ResolversTypes['SystemSettings'], ParentType, ContextType>;
  getUser?: Resolver<Maybe<ResolversTypes['User']>, ParentType, ContextType, RequireFields<QueryGetUserArgs, 'id'>>;
  getUserScVerifyCode?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
}>;

export type SystemSettingsResolvers<ContextType = Context, ParentType extends ResolversParentTypes['SystemSettings'] = ResolversParentTypes['SystemSettings']> = ResolversObject<{
  defaultEventChannel?: Resolver<ResolversTypes['DiscordChannel'], ParentType, ContextType>;
  discordGuildId?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  roleOrder?: Resolver<Array<ResolversTypes['ID']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type UserResolvers<ContextType = Context, ParentType extends ResolversParentTypes['User'] = ResolversParentTypes['User']> = ResolversObject<{
  avatarUrl?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  createdAt?: Resolver<ResolversTypes['Date'], ParentType, ContextType>;
  discordName?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  permissions?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  primaryRole?: Resolver<ResolversTypes['UserRole'], ParentType, ContextType>;
  roles?: Resolver<Array<ResolversTypes['UserRole']>, ParentType, ContextType>;
  rsvps?: Resolver<Array<ResolversTypes['EventRsvp']>, ParentType, ContextType>;
  scName?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  settings?: Resolver<ResolversTypes['UserSettings'], ParentType, ContextType>;
  status?: Resolver<ResolversTypes['UserStatus'], ParentType, ContextType>;
  updatedAt?: Resolver<ResolversTypes['Date'], ParentType, ContextType>;
  verified?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type UserBaseResolvers<ContextType = Context, ParentType extends ResolversParentTypes['UserBase'] = ResolversParentTypes['UserBase']> = ResolversObject<{
  __resolveType: TypeResolveFn<'PartialUser' | 'User', ParentType, ContextType>;
  avatarUrl?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  createdAt?: Resolver<ResolversTypes['Date'], ParentType, ContextType>;
  discordName?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  scName?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  updatedAt?: Resolver<ResolversTypes['Date'], ParentType, ContextType>;
  verified?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
}>;

export type UserRoleResolvers<ContextType = Context, ParentType extends ResolversParentTypes['UserRole'] = ResolversParentTypes['UserRole']> = ResolversObject<{
  createdAt?: Resolver<ResolversTypes['Date'], ParentType, ContextType>;
  discordId?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  permissions?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  primary?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  updatedAt?: Resolver<ResolversTypes['Date'], ParentType, ContextType>;
  users?: Resolver<Array<ResolversTypes['PartialUser']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type UserSettingsResolvers<ContextType = Context, ParentType extends ResolversParentTypes['UserSettings'] = ResolversParentTypes['UserSettings']> = ResolversObject<{
  updatedAt?: Resolver<ResolversTypes['Date'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type UserStatusResolvers<ContextType = Context, ParentType extends ResolversParentTypes['UserStatus'] = ResolversParentTypes['UserStatus']> = ResolversObject<{
  activity?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  ship?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  updatedAt?: Resolver<ResolversTypes['Date'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type Resolvers<ContextType = Context> = ResolversObject<{
  Date?: GraphQLScalarType;
  DiscordChannel?: DiscordChannelResolvers<ContextType>;
  Event?: EventResolvers<ContextType>;
  EventBase?: EventBaseResolvers<ContextType>;
  EventMember?: EventMemberResolvers<ContextType>;
  EventRsvp?: EventRsvpResolvers<ContextType>;
  EventRsvpRole?: EventRsvpRoleResolvers<ContextType>;
  EventRsvpRoleBase?: EventRsvpRoleBaseResolvers<ContextType>;
  EventSettings?: EventSettingsResolvers<ContextType>;
  Mutation?: MutationResolvers<ContextType>;
  PagedEvent?: PagedEventResolvers<ContextType>;
  PartialEvent?: PartialEventResolvers<ContextType>;
  PartialEventRsvpRole?: PartialEventRsvpRoleResolvers<ContextType>;
  PartialUser?: PartialUserResolvers<ContextType>;
  Query?: QueryResolvers<ContextType>;
  SystemSettings?: SystemSettingsResolvers<ContextType>;
  User?: UserResolvers<ContextType>;
  UserBase?: UserBaseResolvers<ContextType>;
  UserRole?: UserRoleResolvers<ContextType>;
  UserSettings?: UserSettingsResolvers<ContextType>;
  UserStatus?: UserStatusResolvers<ContextType>;
}>;

export type DirectiveResolvers<ContextType = Context> = ResolversObject<{
  cacheControl?: CacheControlDirectiveResolver<any, any, ContextType>;
  manages?: ManagesDirectiveResolver<any, any, ContextType>;
  permission?: PermissionDirectiveResolver<any, any, ContextType>;
  private?: PrivateDirectiveResolver<any, any, ContextType>;
}>;
