import type { WebBrowser } from "./WebBrowser";

export interface WebBrowserRegistry {
    getAll(): WebBrowser[];
    getByName(name: string): WebBrowser | undefined;
    getByNames(names: string[]): WebBrowser[];
}
