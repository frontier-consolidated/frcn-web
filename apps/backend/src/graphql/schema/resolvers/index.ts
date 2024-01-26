import { discordResolvers } from "./Discord";
import { eventResolvers } from "./Event";
import { roleResolvers } from "./Roles";
import { scalarResolvers } from "./scalars";
import { userResolvers } from "./User";

export const resolvers = [
	scalarResolvers,
	userResolvers,
	eventResolvers,
	roleResolvers,
	discordResolvers,
];
