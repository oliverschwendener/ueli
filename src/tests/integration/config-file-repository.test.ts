import * as fs from "fs";
import { ConfigFileRepository } from "../../ts/config-file-repository";
import { WebSearch } from "../../ts/web-search";
import { ConfigOptions } from "../../ts/config-options";
import { dummyWebSearches } from "../unit/test-helpers";

const defaultConfig = {
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

describe(ConfigFileRepository.name, (): void => {
    const notExistingConfigFile = "./does-not-exist";

    describe("getConfig", (): void => {
        it("loads default config and creates default config file when user config file does not exist", (): void => {
            const actual = new ConfigFileRepository(defaultConfig, notExistingConfigFile).getConfig();

            expect(actual.webSearches.length).toBe(defaultConfig.webSearches.length);

            for (const webSearch of actual.webSearches) {
                const defaultWebSearch = defaultConfig.webSearches.filter((w: WebSearch): boolean => {
                    return w.name === webSearch.name;
                })[0];

                expect(webSearch.icon).toBe(defaultWebSearch.icon);
                expect(webSearch.name).toBe(defaultWebSearch.name);
                expect(webSearch.prefix).toBe(defaultWebSearch.prefix);
                expect(webSearch.url).toBe(defaultWebSearch.url);
            }

            const configFileContent = fs.readFileSync(notExistingConfigFile, "utf-8");
            const configFromFile = JSON.parse(configFileContent) as ConfigOptions;

            for (const webSearch of configFromFile.webSearches) {
                const defaultWebSearch = defaultConfig.webSearches.filter((w: WebSearch): boolean => {
                    return w.name === webSearch.name;
                })[0];

                expect(webSearch.icon).toBe(defaultWebSearch.icon);
                expect(webSearch.name).toBe(defaultWebSearch.name);
                expect(webSearch.prefix).toBe(defaultWebSearch.prefix);
                expect(webSearch.url).toBe(defaultWebSearch.url);
            }
        });

        afterAll((): void => {
            fs.unlinkSync(notExistingConfigFile);
        });
    });

    describe("getConfig", (): void => {
        const fakeUserConfigFilePath = "./fake-user-config.json";

        it("loads user config when user config is available", (): void => {
            const actual = new ConfigFileRepository(defaultConfig, fakeUserConfigFilePath).getConfig();
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

    describe("getConfig", (): void => {
        const configFilePath = "test-config.json";
        const config = "<html>This is invalid json</hmtl>";

        it("should return default config if an error occurs when reading config file", (): void => {
            const actual = new ConfigFileRepository(defaultConfig, configFilePath).getConfig();

            expect(actual.webSearches.length).toBe(defaultConfig.webSearches.length);

            for (const webSearch of actual.webSearches) {
                const defaultWebSearch = defaultConfig.webSearches.filter((w: WebSearch): boolean => {
                    return w.name === webSearch.name;
                })[0];

                expect(webSearch.icon).toBe(defaultWebSearch.icon);
                expect(webSearch.name).toBe(defaultWebSearch.name);
                expect(webSearch.prefix).toBe(defaultWebSearch.prefix);
                expect(webSearch.url).toBe(defaultWebSearch.url);
            }
        });

        beforeAll((): void => {
            fs.writeFileSync(configFilePath, config, "utf-8");
        });

        afterAll((): void => {
            fs.unlinkSync(configFilePath);
        });
    });
});
