import "./ambient.js";
import type adapter from "./types/index.d.ts";

export default adapter;

export interface AdapterPageConfig {
    isr?: boolean;
}

export type Config = AdapterPageConfig