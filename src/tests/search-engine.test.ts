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
import { ExecutionPlugin } from "../main/execution-plugin";
import { TranslationSet } from "../common/translation/translation-set";
import { FakeFavoriteRepository } from "./fake-favorite-repository";

describe(SearchEngine.name, () => {
    const fakeFavoritesRepository = new FakeFavoriteRepository([]);
    const logger = new TestLogger();
    it("should find search results when searching for the exact name", async (done) => {
        const items: SearchResultItem[] = [
            {
                description: "Google Chrome",
                executionArgument: "C:\\ProgramData\\Microsoft\\Windows\\Start Menu\\Programs\\Google Chrome.lnk",
                hideMainWindowAfterExecution: true,
                icon: dummyIcon,
                name: "Google Chrome",
                originPluginType: PluginType.Test,
                searchable: ["Google Chrome"],
            },
        ];

        const searchPlugins: SearchPlugin[] = [
            new FakeSearchPlugin(PluginType.Test, items, true),
        ];
        const userConfig = {
            generalOptions: {
                logExecution: false,
            },
        } as UserConfigOptions;
        const config = Object.assign({}, defaultUserConfigOptions, userConfig);
        try {
            const searchEngine = new SearchEngine(searchPlugins, [], [], config, englishTranslationSet, logger, fakeFavoritesRepository);
            const searchResults = await searchEngine.getSearchResults("Google Chrome");
            expect(searchResults.length).toBe(1);
            expect(searchResults[0].name).toBe("Google Chrome");
            done();
        } catch (error) {
            done(error);
        }

    });

    it("should return no search results found when searching for something non-existent", async (done) => {
        const items: SearchResultItem[] = [
            {
                description: "Google Chrome",
                executionArgument: "C:\\ProgramData\\Microsoft\\Windows\\Start Menu\\Programs\\Google Chrome.lnk",
                hideMainWindowAfterExecution: true,
                icon: dummyIcon,
                name: "Google Chrome",
                originPluginType: PluginType.Test,
                searchable: ["Google Chrome"],
            },
        ];
        const translationSet = englishTranslationSet;

        const searchPlugins: SearchPlugin[] = [
            new FakeSearchPlugin(PluginType.Test, items, true),
        ];
        const userConfig = {
            generalOptions: {
                logExecution: false,
            },
        } as UserConfigOptions;
        const config = Object.assign({}, defaultUserConfigOptions, userConfig);

        const searchEngine = new SearchEngine(searchPlugins, [], [], config, translationSet, logger, fakeFavoritesRepository);
        try {
            const searchResults = await searchEngine.getSearchResults("blabla");
            expect(searchResults.length).toBe(1);
            expect(searchResults[0].name).toBe(translationSet.noSearchResultsFoundTitle);
            done();
        } catch (error) {
            done(error);
        }
    });

    it("it should be case insensitive", async (done) => {
        const items: SearchResultItem[] = [
            {
                description: "Google Chrome",
                executionArgument: "C:\\ProgramData\\Microsoft\\Windows\\Start Menu\\Programs\\Google Chrome.lnk",
                hideMainWindowAfterExecution: true,
                icon: dummyIcon,
                name: "Google Chrome",
                originPluginType: PluginType.Test,
                searchable: ["Google Chrome"],
            },
        ];
        const translationSet = englishTranslationSet;

        const searchPlugins: SearchPlugin[] = [
            new FakeSearchPlugin(PluginType.Test, items, true),
        ];
        const userConfig = {
            generalOptions: {
                logExecution: false,
            },
        } as UserConfigOptions;
        const config = Object.assign({}, defaultUserConfigOptions, userConfig);

        const searchEngine = new SearchEngine(searchPlugins, [], [], config, translationSet, logger, fakeFavoritesRepository);
        try {
            const searchResults = await searchEngine.getSearchResults("gOoGlE ChRoMe");
            expect(searchResults.length).toBe(1);
            expect(searchResults[0].name).toBe("Google Chrome");
            done();
        } catch (error) {
            done(error);
        }
    });

    it("it should allow inprecise search terms when fuzzyness threshold is higher", async (done) => {
        const items: SearchResultItem[] = [
            {
                description: "Google Chrome",
                executionArgument: "C:\\ProgramData\\Microsoft\\Windows\\Start Menu\\Programs\\Google Chrome.lnk",
                hideMainWindowAfterExecution: true,
                icon: dummyIcon,
                name: "Google Chrome",
                originPluginType: PluginType.Test,
                searchable: ["Google Chrome"],
            },
        ];
        const translationSet = englishTranslationSet;

        const searchPlugins: SearchPlugin[] = [
            new FakeSearchPlugin(PluginType.Test, items, true),
        ];
        const userConfig = {
            generalOptions: {
                logExecution: false,
            },
            searchEngineOptions: {
                fuzzyness: 0.8,
            },
        } as UserConfigOptions;
        const config = Object.assign({}, defaultUserConfigOptions, userConfig);

        const searchEngine = new SearchEngine(searchPlugins, [], [], config, translationSet, logger, fakeFavoritesRepository);
        try {
            const searchResults = await searchEngine.getSearchResults("gglchrm");
            expect(searchResults.length).toBe(1);
            expect(searchResults[0].name).toBe("Google Chrome");
            done();
        } catch (error) {
            done(error);
        }
    });

    it("it should require more precise search terms when fuzzyness threshold is lower", async (done) => {
        const items: SearchResultItem[] = [
            {
                description: "Google Chrome",
                executionArgument: "C:\\ProgramData\\Microsoft\\Windows\\Start Menu\\Programs\\Google Chrome.lnk",
                hideMainWindowAfterExecution: true,
                icon: dummyIcon,
                name: "Google Chrome",
                originPluginType: PluginType.Test,
                searchable: ["Google Chrome"],
            },
        ];
        const translationSet = englishTranslationSet;

        const searchPlugins: SearchPlugin[] = [
            new FakeSearchPlugin(PluginType.Test, items, true),
        ];
        const userConfig = {
            generalOptions: {
                logExecution: false,
            },
            searchEngineOptions: {
                fuzzyness: 0.2,
            },
        } as UserConfigOptions;
        const config = Object.assign({}, defaultUserConfigOptions, userConfig);

        const searchEngine = new SearchEngine(searchPlugins, [], [], config, translationSet, logger, fakeFavoritesRepository);
        try {
            const searchResults = await searchEngine.getSearchResults("gglchrm");
            expect(searchResults.length).toBe(1);
            expect(searchResults[0].name).toBe(translationSet.noSearchResultsFoundTitle);
            done();
        } catch (error) {
            done(error);
        }
    });

    it("should list frequently accessed items higher", async (done) => {
        const config = {
            generalOptions: {
                logExecution: true,
            },
            searchEngineOptions: {
                fuzzyness: 0.4,
            },
        } as UserConfigOptions;
        const translationSet = {} as TranslationSet;
        const items = [
            { name: "abc", executionArgument: "abc", searchable: ["abc"] },
            { name: "abcd", executionArgument: "abcd", searchable: ["abcd"] },
            { name: "abcde", executionArgument: "abcde", searchable: ["abcde"] },
            { name: "abcdef", executionArgument: "abcdef", searchable: ["abcdef"] },
        ] as SearchResultItem[];
        const favoritesRepository = new FakeFavoriteRepository([
            { executionCount: 0, item: items[0] },
            { executionCount: 0, item: items[1] },
            { executionCount: 0, item: items[2] },
            { executionCount: 10, item: items[3] },
        ]);
        const searchPlugins: SearchPlugin[] = [
            new FakeSearchPlugin(PluginType.Test, items, true),
        ];
        const executionPlugins: ExecutionPlugin[] = [];
        const fallbackPlugins: ExecutionPlugin[] = [];
        const searchEngine = new SearchEngine(
            searchPlugins,
            executionPlugins,
            fallbackPlugins,
            config,
            translationSet,
            logger,
            favoritesRepository,
        );
        try {
            const searchResults = await searchEngine.getSearchResults("a");
            expect(searchResults.length).toBe(4);
            expect(searchResults[0].name).toBe("abcdef");
            done();
        } catch (error) {
            done(error);
        }
    });
});
