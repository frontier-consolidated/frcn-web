import type { User } from "@prisma/client";

import type { UserRole as GQLUserRole, UpdatedUserRoles as GQLUpdatedUserRoles } from "./__generated__/resolvers-types";
import { pubsub } from "./pubsub";
import type { WithModel } from "./schema/resolvers/types";

export function publishUserRolesUpdated(users: User[]) {
	for (const user of users) {
        pubsub.publish("USER_ROLES_UPDATED", {
            userRolesUpdated: {
                _model: user,
                userId: user.id,
                permissions: 0, // field-resolved
                primaryRole: null as unknown as GQLUserRole, // field-resolved
                roles: [], // field-resolved
            } as WithModel<GQLUpdatedUserRoles, User>
		});
	}
}