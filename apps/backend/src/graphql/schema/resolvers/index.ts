import { cmsResolvers } from "./Cms";
import { discordResolvers } from "./Discord";
import { eventResolvers } from "./Event";
import { resourceResolvers } from "./Resources";
import { roleResolvers } from "./Roles";
import { scalarResolvers } from "./scalars";
import { systemResolvers } from "./System";
import { userResolvers } from "./User";

export const resolvers = [
	scalarResolvers,
	userResolvers,
	eventResolvers,
	roleResolvers,
	discordResolvers,
	resourceResolvers,
	systemResolvers,
	cmsResolvers
];
