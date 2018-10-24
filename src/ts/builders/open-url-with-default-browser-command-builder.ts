export class OpenUrlWithDefaultBrowserCommandBuilder {
    public static buildWindowsCommand(url: string): string {
        return `start explorer "${url}"`;
    }

    public static buildMacCommand(url: string): string {
        return `open "${url}"`;
    }
}
