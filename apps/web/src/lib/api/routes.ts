function graphqlSubscriptions(): "/subscriptions" {
	return "/subscriptions";
}

function graphqlServer(): "/graphql" {
	return "/graphql";
}

function oauth(): "/oauth" {
	return "/oauth";
}

function logout(): "/logout" {
	return "/logout";
}

function consent(): "/consent" {
	return "/consent";
}

function upload(type: "resource" | "cms_container", attachTo: string): `/media/upload?type=${string}&attach_to=${string}` {
	return `/media/upload?type=${type}&attach_to=${attachTo}`;
}

export const Routes = {
	oauth,
	logout,
	consent,
	graphqlServer,
	graphqlSubscriptions,
	upload
};
