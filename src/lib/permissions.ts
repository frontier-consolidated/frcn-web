export enum Permission {
	NewsEditor = 1 << 0,
	UploadMemberCards = 1 << 1,
	Unassigned2 = 1 << 2,
	Unassigned3 = 1 << 3,
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
	Unassigned26 = 1 << 26,
	Unassigned27 = 1 << 27,
	Unassigned28 = 1 << 28,
	Unassigned29 = 1 << 29,
	Admin = 1 << 30
}

type PermissionOption = {
	name: string;
	description: string;
	value: Permission;
};

export const permission_options: PermissionOption[] = [
	{
		name: "Admin",
		description: "Can perform any permissioned action",
		value: Permission.Admin
	}
];

export function permissions_to_int(masks: Permission[] = []) {
	let permission = 0;
	for (const mask of masks) {
		permission |= mask;
	}
	return permission;
}

export function int_to_permissions(permissions: number | null | undefined) {
	if (!permissions) return [];
	const masks: Permission[] = [];
	for (const mask of Object.values(Permission).filter((value) => typeof value === "number")) {
		if ((permissions & mask) > 0) {
			masks.push(mask);
		}
	}
	return masks;
}

export function has_admin(permissions: number | null | undefined) {
	if (!permissions) return false;
	return (permissions & Permission.Admin) > 0;
}

export function has_perm(permissions: number | null | undefined, mask: Permission) {
	if (!permissions) return false;
	if (has_admin(permissions)) return true;
	return (permissions & mask) > 0;
}

export function has_one_perm(permissions: number | null | undefined, masks: Permission[]) {
	if (!permissions) return false;
	for (const permission of masks) {
		if (has_perm(permissions, permission)) return true;
	}
	return false;
}

export function has_all_perms(permissions: number | null | undefined, masks: Permission[]) {
	if (!permissions) return false;
	for (const permission of masks) {
		if (!has_perm(permissions, permission)) return false;
	}
	return true;
}
