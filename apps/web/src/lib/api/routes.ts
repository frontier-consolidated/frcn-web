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

function consent(): "/consent" {
	return "/consent"
}

export const Routes = {
	oauth,
	logout,
	consent,
	graphql,
	graphqlSubscriptions,
};
