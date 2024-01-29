import { browser } from "$app/environment";
import type { Operation } from "@apollo/client";
import { ApolloClient, InMemoryCache } from "@apollo/client/core";
import { setContext } from "@apollo/client/link/context";
import { HttpLink } from "@apollo/client/link/http";
import { GraphQLWsLink } from "@apollo/client/link/subscriptions";
import { getMainDefinition } from "@apollo/client/utilities";
import { Kind, OperationTypeNode } from "graphql";
import { createClient } from "graphql-ws";

import { Routes, apiUri } from "$lib/api";

import { fragments } from "./operations/fragments";

const httpLink = new HttpLink({
	uri: apiUri(Routes.graphql()),
	credentials: "include",
});

const wsLink = browser
	? new GraphQLWsLink(
			createClient({
				url: apiUri(Routes.graphqlSubscriptions(), "ws"),
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

export const apollo = new ApolloClient({
	link: linkChain,
	cache: new InMemoryCache({
		fragments,
		typePolicies: {
			Event: {
				merge: true
			}
		}
	}),
});
