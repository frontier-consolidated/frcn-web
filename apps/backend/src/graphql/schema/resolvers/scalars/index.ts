import { ObjectScalar } from "./Object";
import { TimestampScalar } from "./Timestamp";

export const scalarResolvers = {
	Timestamp: TimestampScalar,
	Object: ObjectScalar
};
