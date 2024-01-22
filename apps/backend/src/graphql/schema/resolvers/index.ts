import { eventResolvers } from "./Event";
import { roleResolvers } from "./Roles";
import { systemResolvers } from "./System";
import { userResolvers } from "./User";
import { scalarResolvers } from "./scalars";

export const resolvers = [
	scalarResolvers,
	userResolvers,
	eventResolvers,
	roleResolvers,
	systemResolvers,
];
