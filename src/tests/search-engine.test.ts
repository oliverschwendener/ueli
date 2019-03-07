import { SearchEngine } from "../main/search-engine";
import { SearchPlugin } from "../main/search-plugin";
import { defaultUserConfigOptions } from "../common/config/default-user-config-options";
import { UserConfigOptions } from "../common/config/user-config-options";
import { englishTranslationSet } from "../common/translation/english-translation-set";
import { FakeSearchPlugin } from "./fake-search-plugin";
import { SearchResultItem } from "../common/search-result-item";
import { PluginType } from "../main/plugin-type";
import { dummyIcon } from "./dummy-icon";
import { TestLogger } from "./test-logger";

describe(SearchEngine.name, () => {
    const logger = new TestLogger();
    it("should find search results when searching for the exact name", (done) => {
        const items: SearchResultItem[] = [
            {
                description: "Google Chrome",
                executionArgument: "C:\\ProgramData\\Microsoft\\Windows\\Start Menu\\Programs\\Google Chrome.lnk",
                hideMainWindowAfterExecution: true,
                icon: dummyIcon,
                name: "Google Chrome",
                originPluginType: PluginType.ApplicationSearchPlugin,
                searchable: ["Google Chrome"],
            },
        ];

        const searchPlugins: SearchPlugin[] = [
            new FakeSearchPlugin(PluginType.ApplicationSearchPlugin, items, true),
        ];
        const userConfig = {
            //
        } as UserConfigOptions;
        const config = Object.assign({}, defaultUserConfigOptions, userConfig);

        const searchEngine = new SearchEngine(searchPlugins, [], [], config, englishTranslationSet, logger);

        searchEngine.getSearchResults("Google Chrome")
            .then((searchResults) => {
                expect(searchResults.length).toBe(1);
                expect(searchResults[0].name).toBe("Google Chrome");
                done();
            })
            .catch((err) => done(err));
    });

    it("should return no search results found when searching for something non-existent", (done) => {
        const items: SearchResultItem[] = [
            {
                description: "Google Chrome",
                executionArgument: "C:\\ProgramData\\Microsoft\\Windows\\Start Menu\\Programs\\Google Chrome.lnk",
                hideMainWindowAfterExecution: true,
                icon: dummyIcon,
                name: "Google Chrome",
                originPluginType: PluginType.ApplicationSearchPlugin,
                searchable: ["Google Chrome"],
            },
        ];
        const translationSet = englishTranslationSet;

        const searchPlugins: SearchPlugin[] = [
            new FakeSearchPlugin(PluginType.ApplicationSearchPlugin, items, true),
        ];
        const userConfig = {
            //
        } as UserConfigOptions;
        const config = Object.assign({}, defaultUserConfigOptions, userConfig);

        const searchEngine = new SearchEngine(searchPlugins, [], [], config, translationSet, logger);

        searchEngine.getSearchResults("blabla")
            .then((searchResults) => {
                expect(searchResults.length).toBe(1);
                expect(searchResults[0].name).toBe(translationSet.noSearchResultsFoundTitle);
                done();
            })
            .catch((err) => done(err));
    });

    it("it should be case insensitive", (done) => {
        const items: SearchResultItem[] = [
            {
                description: "Google Chrome",
                executionArgument: "C:\\ProgramData\\Microsoft\\Windows\\Start Menu\\Programs\\Google Chrome.lnk",
                hideMainWindowAfterExecution: true,
                icon: dummyIcon,
                name: "Google Chrome",
                originPluginType: PluginType.ApplicationSearchPlugin,
                searchable: ["Google Chrome"],
            },
        ];
        const translationSet = englishTranslationSet;

        const searchPlugins: SearchPlugin[] = [
            new FakeSearchPlugin(PluginType.ApplicationSearchPlugin, items, true),
        ];
        const userConfig = {
            //
        } as UserConfigOptions;
        const config = Object.assign({}, defaultUserConfigOptions, userConfig);

        const searchEngine = new SearchEngine(searchPlugins, [], [], config, translationSet, logger);

        searchEngine.getSearchResults("gOoGlE ChRoMe")
            .then((searchResults) => {
                expect(searchResults.length).toBe(1);
                expect(searchResults[0].name).toBe("Google Chrome");
                done();
            })
            .catch((err) => done(err));
    });

    it("it should allow inprecise search terms when fuzzyness threshold is higher", (done) => {
        const items: SearchResultItem[] = [
            {
                description: "Google Chrome",
                executionArgument: "C:\\ProgramData\\Microsoft\\Windows\\Start Menu\\Programs\\Google Chrome.lnk",
                hideMainWindowAfterExecution: true,
                icon: dummyIcon,
                name: "Google Chrome",
                originPluginType: PluginType.ApplicationSearchPlugin,
                searchable: ["Google Chrome"],
            },
        ];
        const translationSet = englishTranslationSet;

        const searchPlugins: SearchPlugin[] = [
            new FakeSearchPlugin(PluginType.ApplicationSearchPlugin, items, true),
        ];
        const userConfig = {
            searchEngineOptions: {
                fuzzyness: 0.8,
            }
        } as UserConfigOptions;
        const config = Object.assign({}, defaultUserConfigOptions, userConfig);

        const searchEngine = new SearchEngine(searchPlugins, [], [], config, translationSet, logger);

        searchEngine.getSearchResults("gglchrm")
            .then((searchResults) => {
                expect(searchResults.length).toBe(1);
                expect(searchResults[0].name).toBe("Google Chrome");
                done();
            })
            .catch((err) => done(err));
    });

    it("it should require more precise search terms when fuzzyness threshold is lower", (done) => {
        const items: SearchResultItem[] = [
            {
                description: "Google Chrome",
                executionArgument: "C:\\ProgramData\\Microsoft\\Windows\\Start Menu\\Programs\\Google Chrome.lnk",
                hideMainWindowAfterExecution: true,
                icon: dummyIcon,
                name: "Google Chrome",
                originPluginType: PluginType.ApplicationSearchPlugin,
                searchable: ["Google Chrome"],
            },
        ];
        const translationSet = englishTranslationSet;

        const searchPlugins: SearchPlugin[] = [
            new FakeSearchPlugin(PluginType.ApplicationSearchPlugin, items, true),
        ];
        const userConfig = {
            searchEngineOptions: {
                fuzzyness: 0.2,
            },
        } as UserConfigOptions;
        const config = Object.assign({}, defaultUserConfigOptions, userConfig);

        const searchEngine = new SearchEngine(searchPlugins, [], [], config, translationSet, logger);

        searchEngine.getSearchResults("gglchrm")
            .then((searchResults) => {
                expect(searchResults.length).toBe(1);
                expect(searchResults[0].name).toBe(translationSet.noSearchResultsFoundTitle);
                done();
            })
            .catch((err) => done(err));
    });
});
