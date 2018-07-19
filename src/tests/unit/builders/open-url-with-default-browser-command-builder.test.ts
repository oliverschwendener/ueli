import { OpenUrlWithDefaultBrowserCommandBuilder } from "../../../ts/builders/open-url-with-default-browser-command-builder";

describe(OpenUrlWithDefaultBrowserCommandBuilder.name, (): void => {
    describe(OpenUrlWithDefaultBrowserCommandBuilder.buildMacCommand.name, (): void => {
        it("should build the open url with default browser command correctly for mac os", (): void => {
            const url = "https://github.com";
            const expected = `open "${url}"`;

            const actual = OpenUrlWithDefaultBrowserCommandBuilder.buildMacCommand(url);

            expect(actual).toBe(expected);
        });
    });

    describe(OpenUrlWithDefaultBrowserCommandBuilder.buildWindowsCommand.name, (): void => {
        const url = "https://github.com";
        const expected = `start explorer "${url}"`;

        const actual = OpenUrlWithDefaultBrowserCommandBuilder.buildWindowsCommand(url);

        expect(actual).toBe(expected);
    });
});
