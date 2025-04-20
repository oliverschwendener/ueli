export interface FaviconProvider {
    getUrl(host: string, size?: number): string;
}
