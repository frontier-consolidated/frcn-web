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

function createIcsExport(): "/events_export" {
	return "/events_export";
}

function modifyIcsExport(exportId: number): `/events_export/${string}` {
	return `/events_export/${exportId}`;
}

function getIcsExport(exportId: number, accessKey: string): `/events_export/${string}` {
	return `/events_export/${exportId}?access_key=${accessKey}`;
}

export const Routes = {
	oauth,
	logout,
	consent,
	graphqlServer,
	upload,
	createIcsExport,
	modifyIcsExport,
	getIcsExport
};
