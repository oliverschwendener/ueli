export class FaviconeFaviconProvider {
    public getUrl(host: string, size: number = 48): string {
        return `https://favicone.com/${host}?s=${size}`;
    }
}
