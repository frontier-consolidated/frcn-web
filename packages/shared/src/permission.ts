export enum Permission {
	CreateEvents = 1 << 0,
	CreateResources = 1 << 1,
	CmsRead = 1 << 2,
	CmsWrite = 1 << 3,
	Unassigned4 = 1 << 4,
	Unassigned5 = 1 << 5,
	Unassigned6 = 1 << 6,
	Unassigned7 = 1 << 7,
	Unassigned8 = 1 << 8,
	Unassigned9 = 1 << 9,
	Unassigned10 = 1 << 10,
	Unassigned11 = 1 << 11,
	Unassigned12 = 1 << 12,
	Unassigned13 = 1 << 13,
	Unassigned14 = 1 << 14,
	Unassigned15 = 1 << 15,
	Unassigned16 = 1 << 16,
	Unassigned17 = 1 << 17,
	Unassigned18 = 1 << 18,
	Unassigned19 = 1 << 19,
	Unassigned20 = 1 << 20,
	Unassigned21 = 1 << 21,
	Unassigned22 = 1 << 22,
	Unassigned23 = 1 << 23,
	Unassigned24 = 1 << 24,
	Unassigned25 = 1 << 25,
	ManageEvents = 1 << 26,
	ManageResources = 1 << 27,
	ManageRoles = 1 << 28,
	ManageSystem = 1 << 29,
	Admin = 1 << 30,
}

export function permissions(masks: Permission[] = []) {
	let permission = 0;
	for (const mask of masks) {
		permission |= mask;
	}
	return permission;
}

export function has_admin(permissions: number) {
	return (permissions & Permission.Admin) > 0;
}

export function has_permission(permissions: number, permission: Permission) {
	if (has_admin(permissions)) return true;
	return (permissions & permission) > 0;
}

export function has_one_of_permissions(permissions: number, masks: Permission[]) {
	for (const permission of masks) {
		if (has_permission(permissions, permission)) return true;
	}
	return false;
}

export function has_all_of_permissions(permissions: number, masks: Permission[]) {
	for (const permission of masks) {
		if (!has_permission(permissions, permission)) return false;
	}
	return true;
}

export function has_owned_object_permission({ user, owner, required, override }: { user: { id?: string, permissions: number } | null | undefined, owner: { id?: string } | null | undefined, required: Permission, override?: Permission }) {
	if (!user) return false;
	const is_owner = !!user.id && !!owner?.id && user.id === owner?.id;

	if (is_owner && has_permission(user.permissions, required)) return true;
	return override && has_permission(user.permissions, override);
}