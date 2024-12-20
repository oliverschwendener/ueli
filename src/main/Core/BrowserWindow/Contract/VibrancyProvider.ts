import type { Vibrancy } from "./Vibrancy";

export interface BrowserWindowVibrancyProvider {
    get(): Vibrancy | null;
}
