import type { FaviconProvider } from "./FaviconProvider";

export class DuckDuckGoFaviconProvider implements FaviconProvider {
    public getUrl(host: string): string {
        return `https://icons.duckduckgo.com/ip3/${host}.ico`;
    }
}
