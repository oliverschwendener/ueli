import * as fs from "fs";
import { ConfigLoader } from "../../ts/config-loader";
import { WebSearch } from "../../ts/web-search";

const defaultConfigMock = {
    autoStartApp: true,
    maxSearchResultCount: 10,
    rescanInterval: 30,
    searchOperatinSystemSettings: false,
    showHiddenFiles: true,
    version: "Some otherrr stuff",
    webSearches: new Array<WebSearch>(),
    windowWith: 860,
};

const buggyConfig = {
    nothing: null,
};

const fakeFilePath = "./fakeFile";
const buggyFilePath = "./buggy";

describe(ConfigLoader.name, (): void => {
    it("loads config form file", () => {
        const configLoader = new ConfigLoader(defaultConfigMock, "./fakeFile");
        const config = configLoader.loadConigFromConfigFile();
        expect(config.version).toBe(defaultConfigMock.version);
        expect(config.webSearches.length).toBe(0);
    });

    it("loads default config when error is thrown", () => {
        fs.writeFileSync("./buggy", buggyConfig);
        const configLoader = new ConfigLoader(defaultConfigMock, "./buggy");
        const config = configLoader.loadConigFromConfigFile();
        expect(config.version).toBe(defaultConfigMock.version);
        expect(config.webSearches.length).toBe(0);
    });

    it("loads default path when not passed", () => {
        const configLoader = new ConfigLoader(defaultConfigMock);
        const config = configLoader.loadConigFromConfigFile();
        expect(config.version).not.toBe(defaultConfigMock.version);
        expect(config.webSearches.length).toBeGreaterThan(0);
    });

    afterAll(() => {
        fs.unlink(fakeFilePath);
        fs.unlink(buggyFilePath);
    });
});
