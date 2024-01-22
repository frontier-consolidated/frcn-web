import { createFragmentRegistry } from "@apollo/client/cache";
import { EVENT_SETTINGS_FRAGMENT } from "./eventSettings.fragment";
import { EVENT_USER_FRAGMENT } from "./eventUser.fragment";
import { EVENT_FRAGMENT } from "./event.fragment";

export const fragments = createFragmentRegistry(
	EVENT_FRAGMENT,
	EVENT_SETTINGS_FRAGMENT,
	EVENT_USER_FRAGMENT
);
