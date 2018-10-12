export class OpenUrlWithDefaultBrowserCommandBuilder {
    public static buildWindowsCommand(url: string): string {
        // return `start explorer "${url}"`;
        return `start "${url}"`;
    }

    public static buildMacCommand(url: string): string {
        return `open "${url}"`;
    }
}
