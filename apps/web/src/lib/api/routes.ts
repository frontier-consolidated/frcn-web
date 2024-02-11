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

function resource(id: string): `/res/${string}` {
	return `/res/${id}`
}

function resourceDownload(id: string): `/res/${string}/download` {
	return `/res/${id}/download`
}

export const Routes = {
	oauth,
	logout,
	consent,
	graphql,
	graphqlSubscriptions,
	resource,
	resourceDownload
};
