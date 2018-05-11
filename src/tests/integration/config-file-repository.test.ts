import * as fs from "fs";
import { ConfigFileRepository } from "../../ts/config-file-repository";
import { WebSearch } from "../../ts/web-search";
import { ConfigOptions } from "../../ts/config-options";
import { dummyWebSearches } from "../unit/test-helpers";

const defaultConfigMock = {
    webSearches: [
        {
            icon: "<this-is-an-icon>",
            name: "Dummy Search",
            prefix: "ds",
            url: "https://dummy-search.com/query=",
        },
        {
            icon: "<this-is-an-icon-2>",
            name: "Dummy Search 2",
            prefix: "ds2",
            url: "https://dummy-search-2.com/query=",
        },
    ],
} as ConfigOptions;

const fakeUserConfig = {
    webSearches: [
        {
            icon: "<this-is-a-custom-icon>",
            name: "Custom User Search Engine",
            prefix: "cuse",
            url: "https://custom-user-search.com/query=",
        },
    ],
} as ConfigOptions;

const fakeUserConfigFilePath = "./fake-user-config.json";
const notExistingConfigFile = "./does-not-exist";

describe(ConfigFileRepository.name, (): void => {
    it("loads default config when there is no config file", () => {
        const actual = new ConfigFileRepository(defaultConfigMock).getConfig();

        expect(actual.webSearches.length).toBe(defaultConfigMock.webSearches.length);

        for (const webSearch of actual.webSearches) {
            const defaultWebSearch = defaultConfigMock.webSearches.filter((w: WebSearch): boolean => {
                return w.name === webSearch.name;
            })[0];

            expect(webSearch.icon).toBe(defaultWebSearch.icon);
            expect(webSearch.name).toBe(defaultWebSearch.name);
            expect(webSearch.prefix).toBe(defaultWebSearch.prefix);
            expect(webSearch.url).toBe(defaultWebSearch.url);
        }
    });

    it("loads default config when user config file does not exist", (): void => {
        const actual = new ConfigFileRepository(defaultConfigMock, notExistingConfigFile).getConfig();

        expect(actual.webSearches.length).toBe(defaultConfigMock.webSearches.length);

        for (const webSearch of actual.webSearches) {
            const defaultWebSearch = defaultConfigMock.webSearches.filter((w: WebSearch): boolean => {
                return w.name === webSearch.name;
            })[0];

            expect(webSearch.icon).toBe(defaultWebSearch.icon);
            expect(webSearch.name).toBe(defaultWebSearch.name);
            expect(webSearch.prefix).toBe(defaultWebSearch.prefix);
            expect(webSearch.url).toBe(defaultWebSearch.url);
        }
    });

    it("loads user config when user config is available", (): void => {
        const actual = new ConfigFileRepository(defaultConfigMock, fakeUserConfigFilePath).getConfig();
        expect(actual.webSearches.length).toBe(fakeUserConfig.webSearches.length);

        for (const webSearch of actual.webSearches) {
            const fakeUserWebSearch = fakeUserConfig.webSearches.filter((w: WebSearch): boolean => {
                return w.name === webSearch.name;
            })[0];

            expect(webSearch.icon).toBe(fakeUserWebSearch.icon);
            expect(webSearch.name).toBe(fakeUserWebSearch.name);
            expect(webSearch.prefix).toBe(fakeUserWebSearch.prefix);
            expect(webSearch.url).toBe(fakeUserWebSearch.url);
        }
    });

    beforeAll((): void => {
        fs.writeFileSync(fakeUserConfigFilePath, JSON.stringify(fakeUserConfig), "utf-8");
    });

    afterAll((): void => {
        fs.unlinkSync(fakeUserConfigFilePath);
    });
});
