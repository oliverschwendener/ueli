import type { WebBrowser, WebBrowserRegistry as WebBrowserRegistryContract } from "../Contract";

export class WebBrowserRegistry implements WebBrowserRegistryContract {
    public constructor(private readonly webBrowsers: WebBrowser[]) {}

    public getAll(): WebBrowser[] {
        return this.webBrowsers;
    }

    public getByName(name: string): WebBrowser | undefined {
        return this.webBrowsers.find((webBrowser) => webBrowser.getName() === name);
    }

    public getByNames(names: string[]): WebBrowser[] {
        return this.webBrowsers.filter((webBrowser) => names.includes(webBrowser.getName()));
    }
}
