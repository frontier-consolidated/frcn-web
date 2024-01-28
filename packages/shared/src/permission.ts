export enum Permission {
	CreateEvents = 0b0000000000000000000000000000001,
	ManageRoles = 0b0000000000000000000000000000010,
	ManageSystem = 0b0000000000000000000000000000100,
	Admin = 0b1000000000000000000000000000000,
}

export function permissions(masks: Permission[] = []) {
	let permission = 0;
	for (const mask of masks) {
		permission |= mask;
	}
	return permission;
}

export function hasPermission(permissions: number, permission: Permission) {
	if ((permissions & Permission.Admin) > 0) return true;
	return (permissions & permission) > 0;
}

export function hasOneOfPermissions(permissions: number, oneOf: Permission[]) {
	for (const permission of oneOf) {
		if (hasPermission(permissions, permission)) return true;
	}
	return false;
}

export function hasAllOfPermissions(permissions: number, allOf: Permission[]) {
	for (const permission of allOf) {
		if (!hasPermission(permissions, permission)) return false;
	}
	return true;
}
