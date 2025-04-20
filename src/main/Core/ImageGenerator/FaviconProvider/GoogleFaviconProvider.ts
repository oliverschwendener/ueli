import type { FaviconProvider } from "./FaviconProvider";

export class GoogleFaviconProvider implements FaviconProvider {
    public getUrl(host: string, size: number = 48): string {
        return `https://www.google.com/s2/favicons?domain=${host}&sz=${size}`;
    }
}
