import { browser } from "$app/environment";
import type { Operation, TypedDocumentNode } from "@apollo/client";
import { ApolloClient, InMemoryCache } from "@apollo/client/core";
import { setContext } from "@apollo/client/link/context";
import { HttpLink } from "@apollo/client/link/http";
import { GraphQLWsLink } from "@apollo/client/link/subscriptions";
import { getMainDefinition } from "@apollo/client/utilities";
import type { ResultOf, VariablesOf } from "@graphql-typed-document-node/core";
import { Kind, OperationTypeNode } from "graphql";
import { createClient } from "graphql-ws";
import { onMount } from "svelte";

import { Routes, apiUri } from "$lib/api";

import { fragments } from "./documents/fragments";

export function create_apollo_client(headers?: Record<string, string>) {
	const http_link = new HttpLink({
		uri: apiUri(Routes.graphqlServer()),
		credentials: "include",
		headers
	});
	
	const ws_link = browser
		? new GraphQLWsLink(
				createClient({
					url: apiUri(Routes.graphqlServer(), location.protocol === "https:" ? "wss" : "ws"),
				})
		  )
		: null;
	
	function link_splitter({ query }: Operation) {
		const definition = getMainDefinition(query);
		return (
			definition.kind === Kind.OPERATION_DEFINITION &&
			definition.operation === OperationTypeNode.SUBSCRIPTION
		);
	}
	
	const link_chain = ws_link ? setContext(() => ({})).split(link_splitter, ws_link, http_link) : http_link;
	
	return new ApolloClient({
		ssrMode: !browser,
		link: link_chain,
		cache: new InMemoryCache({
			fragments,
			typePolicies: {
				Event: {
					merge: true
				},
				UserStatus: {
					merge: true
				},
				UpdatedUserRoles: {
					merge: true
				}
			}
		})
	});
}

export type TypedApolloClient = ReturnType<typeof create_apollo_client>;
const browser_apollo = browser ? create_apollo_client() : null;

export function get_apollo() {
	if (!browser) throw new Error("DO NOT USE SHARED APOLLO CLIENT ON SERVER, use locals.apollo");
	return browser_apollo!;
}

type SubscribeOptions<T extends TypedDocumentNode<any, any>> = {
	variables?: VariablesOf<T>;
	onNext: (data: NonNullable<ResultOf<T>>) => void;
	onError?: ((error: any) => void);
	onComplete?: (() => void);
};

export function subscribe<T extends TypedDocumentNode<any, any>>(document: T, options: SubscribeOptions<T>) {
	const observer = get_apollo().subscribe({
		query: document,
		variables: options.variables,
		errorPolicy: "all"
	});

	const subscription = observer.subscribe(({ data, errors }) => {
		if (errors && errors.length > 0) {
			console.error("Error on subscription", { query: document, variables: options.variables }, errors);
			return;
		}
		if (!data) return;

		options.onNext(data as NonNullable<ResultOf<T>>);
	}, options.onError, options.onComplete);

	return () => {
		if (subscription.closed) return;
		subscription.unsubscribe();
	};
}

export function subscribe_on_mount<T extends TypedDocumentNode<any, any>>(document: T, options: SubscribeOptions<T>) {
	onMount(() => {
		return subscribe(document, options);
	});
}