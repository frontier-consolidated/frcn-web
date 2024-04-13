import { browser } from "$app/environment";
import type { Operation, TypedDocumentNode } from "@apollo/client";
import { ApolloClient, InMemoryCache } from "@apollo/client/core";
import { setContext } from "@apollo/client/link/context";
import { HttpLink } from "@apollo/client/link/http";
import { GraphQLWsLink } from "@apollo/client/link/subscriptions";
import { getMainDefinition } from "@apollo/client/utilities";
import type { ResultOf } from "@graphql-typed-document-node/core";
import { Kind, OperationTypeNode } from "graphql";
import { createClient } from "graphql-ws";
import { onMount } from "svelte";

import { Routes, apiUri } from "$lib/api";

import { fragments } from "./documents/fragments";

export function createApolloClient(headers?: Record<string, string>) {
	const httpLink = new HttpLink({
		uri: apiUri(Routes.graphqlServer()),
		credentials: "include",
		headers
	});
	
	const wsLink = browser
		? new GraphQLWsLink(
				createClient({
					url: apiUri(Routes.graphqlSubscriptions(), location.protocol === "https:" ? "wss" : "ws"),
				})
		  )
		: null;
	
	function linkSplitter({ query }: Operation) {
		const definition = getMainDefinition(query);
		return (
			definition.kind === Kind.OPERATION_DEFINITION &&
			definition.operation === OperationTypeNode.SUBSCRIPTION
		);
	}
	
	const linkChain = wsLink ? setContext(() => ({})).split(linkSplitter, wsLink, httpLink) : httpLink;
	
	return new ApolloClient({
		ssrMode: !browser,
		link: linkChain,
		cache: new InMemoryCache({
			fragments,
			typePolicies: {
				Event: {
					merge: true
				},
				UserStatus: {
					merge: true
				}
			}
		})
	});
}

export type TypedApolloClient = ReturnType<typeof createApolloClient>;
const browserApollo = browser ? createApolloClient() : null;

export function getApollo() {
	if (!browser) throw new Error("DO NOT USE SHARED APOLLO CLIENT ON SERVER, use locals.apollo");
	return browserApollo!;
}

export function subscribe<T extends TypedDocumentNode<any, any>>(document: T, callback: (data: NonNullable<ResultOf<T>>) => void) {
	const observer = getApollo().subscribe({
		query: document,
	});
	const subscription = observer.subscribe(({ data }) => {
		if (!data) return;
		callback(data as NonNullable<ResultOf<T>>);
	});

	return () => {
		if (subscription.closed) return;
		subscription.unsubscribe();
	};
}

export function subscribeOnMount<T extends TypedDocumentNode<any, any>>(document: T, callback: (data: NonNullable<ResultOf<T>>) => void) {
	onMount(() => {
		return subscribe(document, callback);
	});
}