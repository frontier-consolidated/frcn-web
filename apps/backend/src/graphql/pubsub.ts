/* eslint-disable @typescript-eslint/no-explicit-any */
import { EventEmitter } from "events";

import type { GraphQLResolveInfo } from "graphql";
import { PubSubEngine } from "graphql-subscriptions";

import type { SubscriptionResolver, SubscriptionResolvers, SubscriptionSubscribeFn } from "./__generated__/resolvers-types";

class CustomPubSub<Events extends Record<string, any>> extends PubSubEngine {
    private emitter: EventEmitter;

    private subscriptions: Record<number, [Exclude<keyof Events, symbol | number>, (payload: Events[keyof Events]) => void]> = {};
    private nextId = 0;

    constructor() {
        super();
        this.emitter = new EventEmitter();
    }

    // eslint-disable-next-line require-await
    async publish<TKey extends Exclude<keyof Events, symbol | number>>(triggerName: TKey, payload: Events[TKey]) {
        this.emitter.emit(triggerName, payload);
    }

    // eslint-disable-next-line require-await
    async subscribe<TKey extends Exclude<keyof Events, symbol | number>>(triggerName: TKey, onMessage: (payload: Events[TKey]) => void) {
        this.emitter.addListener(triggerName, onMessage);
        this.subscriptions[this.nextId++] = [triggerName, onMessage as (payload: Events[keyof Events]) => void];
        return this.nextId - 1;
    }

    unsubscribe(subId: number) {
        const subscription = this.subscriptions[subId];
        delete this.subscriptions[subId];
        this.emitter.removeListener(subscription[0], subscription[1]);
    }

    override asyncIterator<TKey extends Exclude<keyof Events, symbol | number>>(triggers: TKey | TKey[]): AsyncIterator<Events[TKey]> {
        return super.asyncIterator<Events[TKey]>(triggers);
    }

    asyncIterable<TKey extends Exclude<keyof Events, symbol | number>>(triggers: TKey | TKey[]): AsyncIterable<Events[TKey]> {
        const asyncIterator = this.asyncIterator<TKey>(triggers);

        return {
            [Symbol.asyncIterator]() {
                return asyncIterator;
            }
        };
    }
}

export type SubscriptionResult<TKey extends keyof SubscriptionResolvers> = {
    [key in TKey]: NonNullable<SubscriptionResolvers[TKey]> extends SubscriptionResolver<infer Result, TKey, infer _TParent, infer _TContext, infer _TArgs> ? Result : never
};

export const pubsub = new CustomPubSub<{
    ROLES_UPDATED: SubscriptionResult<"rolesUpdated">
    USER_ROLES_UPDATED: SubscriptionResult<"userRolesUpdated">
}>();

export type SubscribeFn<TResult, TParent, TContext, TArgs> = (
    parent: TParent,
    args: TArgs,
    context: TContext,
    info: GraphQLResolveInfo
  ) => AsyncIterator<TResult>;
export type FilterFn<TResult, TContext, TArgs> = (
    parent: TResult,
    args: TArgs,
    context: TContext,
    info: GraphQLResolveInfo
  ) => boolean | Promise<boolean>;

export function withFilter<TResult, TKey extends string, TParent, TContext, TArgs>(
    subscribeFn: SubscribeFn<{ [key in TKey]: TResult }, TParent, TContext, TArgs>,
    filterFn: FilterFn<{ [key in TKey]: TResult }, TContext, TArgs>,
) {
    const resolver: SubscriptionSubscribeFn<{ [key in TKey]: TResult }, TParent, TContext, TArgs> = (parent, args, context, info) => {
        const asyncIterator = subscribeFn(parent, args, context, info);

        return {
            [Symbol.asyncIterator]() {
                return {
                    next() {
                        return new Promise((resolve, reject) => {
                            function innerNext() {
                                asyncIterator.next()
                                    .then((payload) => {
                                        if (payload.done) {
                                            resolve(payload);
                                            return;
                                        }
                                        Promise.resolve(filterFn(payload.value, args, context, info))
                                            .catch(() => { return false; })
                                            .then(result => {
                                                if (result) {
                                                    resolve(payload);
                                                    return;
                                                }
                                                innerNext();
                                            });
                                    })
                                    .catch(reject);
                            }
                            innerNext();
                        });
                    },
                    return() {
                        return asyncIterator.return!();
                    },
                    throw(err) {
                        return asyncIterator.throw!(err);
                    }
                };
            }
        };
    };
    return resolver;
}