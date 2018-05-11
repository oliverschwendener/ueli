import * as fs from "fs";
import { ConfigFileRepository } from "../../ts/config-file-repository";
import { WebSearch } from "../../ts/web-search";
import { ConfigOptions } from "../../ts/config-options";

const defaultConfigMock = {
    autoStartApp: true,
    maxSearchResultCount: 10,
    rescanInterval: 30,
    searchOperatingSystemSettings: false,
    webSearches: [] as WebSearch[],
    windowWith: 860,
} as ConfigOptions;

const buggyConfig = {
    nothing: null,
};

const fakeFilePath = "./fakeFile";
const buggyFilePath = "./buggy";

describe(ConfigFileRepository.name, (): void => {
    it("loads config form file", () => {
        const configFileRepository = new ConfigFileRepository(defaultConfigMock, "./fakeFile");
        const configOptions = configFileRepository.getConfig();
        expect(configOptions.webSearches.length).toBe(0);
    });

    it("loads default config when error is thrown", (): void => {
        fs.writeFileSync("./buggy", buggyConfig);
        const configFileRepository = new ConfigFileRepository(defaultConfigMock, "./buggy");
        const configOptions = configFileRepository.getConfig();
        expect(configOptions.webSearches.length).toBe(0);
    });

    it("loads default path when not passed", (): void => {
        const configFileRepository = new ConfigFileRepository(defaultConfigMock);
        const configOptions = configFileRepository.getConfig();
        expect(configOptions.webSearches.length).toBeGreaterThan(0);
    });

    afterAll((): void => {
        fs.unlink(fakeFilePath);
        fs.unlink(buggyFilePath);
    });
});
