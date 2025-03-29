import { EventEmitter } from "events";

type EventMap = {};

export const EventBus = new EventEmitter<EventMap>();
