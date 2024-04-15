import type { Browser } from "./Browser";

export type ChromiumBrowser = Exclude<Browser, "Firefox">;
