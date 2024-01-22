function graphqlSubscriptions(): "/subscriptions" {
	return "/subscriptions";
}

function graphql(): "/graphql" {
	return "/graphql";
}

function oauth(): "/oauth" {
	return "/oauth";
}

function logout(): "/logout" {
	return "/logout";
}

export const Routes = {
	oauth,
	logout,
	graphql,
	graphqlSubscriptions,
};
